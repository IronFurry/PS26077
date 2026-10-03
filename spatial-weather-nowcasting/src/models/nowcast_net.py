"""
Weather Nowcasting 3D Spatiotemporal UNet Architecture Module.

Operational Role:
    Defines WeatherNowcastNet (and NowcastNet alias), a progressive 3D Spatiotemporal UNet model
    for short-term weather nowcasting. Processes historical multi-channel observation grids
    [B, 6, 8, 256, 256] to predict future precipitation lead frames [B, 12, 1, 256, 256].
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class SpatioTemporalConvBlock(nn.Module):
    """
    Reusable 3D Spatiotemporal Convolutional Block.

    Applies twin 3D convolutions with 3x3x3 kernels, 3D batch normalization, and SiLU activations.
    """

    def __init__(self, in_channels: int, out_channels: int) -> None:
        """
        Initializes the 3D convolution block.

        Args:
            in_channels: Number of input feature channels.
            out_channels: Number of output feature channels.
        """
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv3d(in_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm3d(out_channels),
            nn.SiLU(inplace=True),
            nn.Conv3d(out_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm3d(out_channels),
            nn.SiLU(inplace=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Forward pass for SpatioTemporalConvBlock."""
        return self.block(x)


class WeatherNowcastNet(nn.Module):
    """
    3D Spatiotemporal UNet for Spatial Weather Nowcasting.

    Architecture:
        - Encoder: Progressive channel expansion (6 -> 32 -> 64 -> 128) with spatial downsampling
                   using MaxPool3d(kernel_size=(1, 2, 2)) to preserve temporal frames.
        - Temporal Adapter: Adaptive 3D pooling mapping historical timesteps (8) to forecast lead timesteps (12).
        - Decoder: Progressive spatial upsampling using ConvTranspose3d(kernel_size=(1, 2, 2), stride=(1, 2, 2))
                   concatenated with adapted skip connections.
        - Output Head: 1x1x1 3D Conv projecting to 1 output rain channel with ReLU activation for non-negativity.
    """

    def __init__(
        self,
        in_channels: int = 6,
        out_channels: int = 1,
        in_timesteps: int = 8,
        out_timesteps: int = 12,
    ) -> None:
        """
        Initializes WeatherNowcastNet architecture components.

        Args:
            in_channels: Input channels count (default: 6 [tir1, tir2, wv, u10, v10, dem]).
            out_channels: Output channels count (default: 1 [rainfall rate]).
            in_timesteps: Input historical sequence frames (default: 8).
            out_timesteps: Target forecast sequence frames (default: 12).
        """
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.in_timesteps = in_timesteps
        self.out_timesteps = out_timesteps

        # Encoder Blocks
        self.enc1 = SpatioTemporalConvBlock(in_channels, 32)
        self.down1 = nn.MaxPool3d(kernel_size=(1, 2, 2), stride=(1, 2, 2))

        self.enc2 = SpatioTemporalConvBlock(32, 64)
        self.down2 = nn.MaxPool3d(kernel_size=(1, 2, 2), stride=(1, 2, 2))

        # Bottleneck Block
        self.bottleneck = SpatioTemporalConvBlock(64, 128)

        # Decoder Blocks & Upsampling
        self.up2 = nn.ConvTranspose3d(128, 64, kernel_size=(1, 2, 2), stride=(1, 2, 2))
        self.dec2 = SpatioTemporalConvBlock(128, 64)  # 64 (up) + 64 (skip2 adapted) = 128 in

        self.up1 = nn.ConvTranspose3d(64, 32, kernel_size=(1, 2, 2), stride=(1, 2, 2))
        self.dec1 = SpatioTemporalConvBlock(64, 32)   # 32 (up) + 32 (skip1 adapted) = 64 in

        # Final Projection Head
        self.final_conv = nn.Conv3d(32, out_channels, kernel_size=1)
        self.output_activation = nn.ReLU()

    def _adapt_temporal_dimension(self, x: torch.Tensor, target_t: int) -> torch.Tensor:
        """
        Adaptively interpolates/pools the 3D tensor's temporal dimension (axis 2) to target_t.

        Args:
            x: Input 5D tensor of shape [B, C, T_in, H, W].
            target_t: Desired temporal output frame count (12).

        Returns:
            torch.Tensor: Resampled tensor of shape [B, C, target_t, H, W].
        """
        _, _, _, h, w = x.shape
        return F.adaptive_avg_pool3d(x, (target_t, h, w))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for weather nowcasting prediction.

        Args:
            x: Input tensor of shape [B, 6, 8, 256, 256] -> (Batch, Channels, In_Timesteps, Height, Width).

        Returns:
            torch.Tensor: Forecast output tensor of shape [B, 12, 1, 256, 256] -> (Batch, Out_Timesteps, Out_Channels, Height, Width).
        """
        # Encoder Path
        skip1 = self.enc1(x)                # Shape: [B, 32, 8, 256, 256]
        x_down1 = self.down1(skip1)         # Shape: [B, 32, 8, 128, 128]

        skip2 = self.enc2(x_down1)          # Shape: [B, 64, 8, 128, 128]
        x_down2 = self.down2(skip2)         # Shape: [B, 64, 8, 64, 64]

        # Bottleneck Path
        bottleneck_feat = self.bottleneck(x_down2)  # Shape: [B, 128, 8, 64, 64]

        # Temporal Adapter: Map 8 historical timesteps to 12 forecast lead timesteps
        bottleneck_adapted = self._adapt_temporal_dimension(bottleneck_feat, self.out_timesteps)  # Shape: [B, 128, 12, 64, 64]
        skip2_adapted = self._adapt_temporal_dimension(skip2, self.out_timesteps)                # Shape: [B, 64, 12, 128, 128]
        skip1_adapted = self._adapt_temporal_dimension(skip1, self.out_timesteps)                # Shape: [B, 32, 12, 256, 256]

        # Decoder Path with Concatenated Adapted Skip Connections
        x_up2 = self.up2(bottleneck_adapted)                       # Shape: [B, 64, 12, 128, 128]
        x_concat2 = torch.cat([x_up2, skip2_adapted], dim=1)        # Shape: [B, 128, 12, 128, 128]
        x_dec2 = self.dec2(x_concat2)                              # Shape: [B, 64, 12, 128, 128]

        x_up1 = self.up1(x_dec2)                                   # Shape: [B, 32, 12, 256, 256]
        x_concat1 = torch.cat([x_up1, skip1_adapted], dim=1)        # Shape: [B, 64, 12, 256, 256]
        x_dec1 = self.dec1(x_concat1)                              # Shape: [B, 32, 12, 256, 256]

        # Final Projection to Target Rain Channel
        out = self.final_conv(x_dec1)                               # Shape: [B, 1, 12, 256, 256]
        out = self.output_activation(out)                           # Non-negative precipitation values (mm/hr)

        # Rearrange to contract shape: [B, 12, 1, 256, 256]
        out_rearranged = out.permute(0, 2, 1, 3, 4)
        return out_rearranged


# Backwards compatibility alias
NowcastNet = WeatherNowcastNet


if __name__ == "__main__":
    print("=" * 70)
    print("      Testing Production WeatherNowcastNet Architecture")
    print("=" * 70)

    model = WeatherNowcastNet(in_channels=6, out_channels=1, in_timesteps=8, out_timesteps=12)
    model.eval()

    # Create dummy batch [B=2, C=6, T=8, H=256, W=256]
    dummy_x = torch.randn(2, 6, 8, 256, 256)

    print(f"Input  Tensor Shape  [B, C, T_in, H, W] : {tuple(dummy_x.shape)}")

    with torch.no_grad():
        dummy_y = model(dummy_x)

    print(f"Output Tensor Shape  [B, T_out, C, H, W]: {tuple(dummy_y.shape)}")

    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

    print(f"\nTotal Model Parameters     : {total_params:,}")
    print(f"Trainable Model Parameters : {trainable_params:,}")

    # Output verification assertions
    assert dummy_y.shape == (2, 12, 1, 256, 256), f"Output shape mismatch: {dummy_y.shape}"
    assert (dummy_y >= 0.0).all(), "Found negative precipitation values in output!"

    print("\n[SUCCESS] WeatherNowcastNet architecture verified successfully!")
