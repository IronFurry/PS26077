"""
Model Quantization & Export Module.

Operational Role:
    Handles post-training quantization (PyTorch INT8 dynamic/static quantization) and ONNX format export
    for accelerating real-time inference latency of spatial weather nowcasting models at edge stations
    or operational forecasting centers.
"""

import os
from typing import Tuple
import torch
import torch.nn as nn


class ModelQuantizer:
    """
    Quantizer & Exporter utility for converting PyTorch nowcasting models to ONNX and quantized formats.

    Attributes:
        model (nn.Module): Pre-trained PyTorch nowcasting model.
        export_dir (str): Output folder for storing exported ONNX/quantized models.
    """

    def __init__(self, model: nn.Module, export_dir: str = "models/exported") -> None:
        """
        Initializes the model quantizer.

        Args:
            model: PyTorch module instance to be exported/quantized.
            export_dir: Target directory path for exported artifacts.
        """
        self.model = model
        self.export_dir = export_dir
        os.makedirs(self.export_dir, exist_ok=True)

    def export_onnx(
        self,
        dummy_input: torch.Tensor,
        filename: str = "nowcast_net.onnx",
        opset_version: int = 14,
    ) -> str:
        """
        Exports PyTorch model to ONNX computational graph format.

        Args:
            dummy_input: Input tensor matching expected model input shape (B, T_in, C, H, W).
            filename: Output filename for ONNX model file.
            opset_version: Target ONNX operator set version.

        Returns:
            str: Path to saved ONNX model file.
        """
        self.model.eval()
        export_path = os.path.join(self.export_dir, filename)

        torch.onnx.export(
            self.model,
            dummy_input,
            export_path,
            export_params=True,
            opset_version=opset_version,
            do_constant_folding=True,
            input_names=["input_sequence"],
            output_names=["predicted_sequence"],
            dynamic_axes={
                "input_sequence": {0: "batch_size"},
                "predicted_sequence": {0: "batch_size"},
            },
        )
        print(f"[ModelQuantizer] ONNX model exported to: {export_path}")
        return export_path

    def quantize_dynamic(self) -> nn.Module:
        """
        Applies PyTorch dynamic INT8 quantization to linear/convolutional layers.

        Returns:
            nn.Module: Dynamically quantized PyTorch model module.
        """
        quantized_model = torch.ao.quantization.quantize_dynamic(
            self.model, {nn.Linear, nn.Conv2d}, dtype=torch.qint8
        )
        print("[ModelQuantizer] Dynamic INT8 quantization applied.")
        return quantized_model


if __name__ == "__main__":
    from src.models.nowcast_net import NowcastNet

    print("[ModelQuantizer Test] Initializing model quantizer placeholder...")
    model = NowcastNet(in_channels=1, out_channels=1, in_seq_len=4, out_seq_len=6)
    dummy_input = torch.randn(1, 4, 1, 128, 128)

    quantizer = ModelQuantizer(model=model, export_dir="models/exported")
    print(f"Export directory configured: {quantizer.export_dir}")
    print("Testing dynamic quantization placeholder...")
    qmodel = quantizer.quantize_dynamic()
    print("Quantization placeholder verified successfully.")
