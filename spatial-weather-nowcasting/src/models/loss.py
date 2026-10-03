"""
Spatial Weather Loss Functions Module.

Operational Role:
    Defines specialized loss functions tailored for spatial weather forecasting (e.g. weighted MSE
    emphasizing heavy precipitation/severe weather pixel values, SSIM for spatial pattern coherence,
    and balanced spatial loss metrics).
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class SpatialWeatherLoss(nn.Module):
    """
    Intensity-Weighted MSE and Spatial Loss for severe weather nowcasting.

    Higher weights are assigned to extreme values (e.g. high reflectivity dBZ or extreme rain rates)
    to prevent under-estimating rare severe weather events.
    """

    def __init__(self, weight_threshold: float = 0.5, extreme_weight: float = 5.0) -> None:
        """
        Initializes loss weighting hyper-parameters.

        Args:
            weight_threshold: Intensity threshold above which loss weights increase.
            extreme_weight: Weight multiplier applied to high-intensity spatial grid points.
        """
        super().__init__()
        self.weight_threshold = weight_threshold
        self.extreme_weight = extreme_weight

    def forward(self, pred: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        """
        Computes weighted spatial loss between predicted and ground-truth sequence frames.

        Args:
            pred: Predicted weather sequence tensor (B, T, C, H, W).
            target: Ground-truth target weather sequence tensor (B, T, C, H, W).

        Returns:
            torch.Tensor: Scalar loss tensor value.
        """
        diff_sq = (pred - target) ** 2

        # Create spatial weight map based on target reflectivity / precipitation intensity
        weights = torch.ones_like(target)
        weights[target > self.weight_threshold] = self.extreme_weight

        weighted_loss = diff_sq * weights
        return torch.mean(weighted_loss)


if __name__ == "__main__":
    print("[SpatialWeatherLoss Test] Initializing loss module placeholder...")
    criterion = SpatialWeatherLoss(weight_threshold=0.5, extreme_weight=5.0)

    pred = torch.rand(2, 6, 1, 128, 128, requires_grad=True)
    target = torch.rand(2, 6, 1, 128, 128)

    loss = criterion(pred, target)
    loss.backward()

    print(f"Calculated Spatial Loss: {loss.item():.6f}")
    print(f"Gradient computed successfully: {pred.grad is not None}")
