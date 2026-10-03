"""
Model Fine-Tuning Pipeline Module.

Operational Role:
    Facilitates domain adaptation and fine-tuning of pre-trained spatial weather nowcasting models
    on regional high-resolution weather datasets, extreme storm events, or local radar station outputs.
    Supports layer freezing, selective learning rates, and warm-start checkpoint loading.
"""

from typing import List, Optional
import torch
import torch.nn as nn
from torch.utils.data import DataLoader


class FineTuner:
    """
    FineTuner class managing domain adaptation and transfer learning routines.

    Attributes:
        model (nn.Module): Pre-trained model to be fine-tuned.
        checkpoint_path (str): Filepath to pre-trained weight checkpoint.
        learning_rate (float): Learning rate for fine-tuning optimizer.
        device (str): Execution device ('cuda' or 'cpu').
    """

    def __init__(
        self,
        model: nn.Module,
        checkpoint_path: Optional[str] = None,
        learning_rate: float = 1e-4,
        device: str = "cpu",
    ) -> None:
        """
        Initializes fine-tuner, loads pre-trained weights if provided, and configures optimizer.

        Args:
            model: Neural network model instance.
            checkpoint_path: Optional path to pre-trained model checkpoint file.
            learning_rate: Fine-tuning learning rate (typically smaller than initial training LR).
            device: Hardware execution target.
        """
        self.model = model.to(device)
        self.learning_rate = learning_rate
        self.device = device

        if checkpoint_path:
            self.load_checkpoint(checkpoint_path)

        self.optimizer = torch.optim.Adam(
            filter(lambda p: p.requires_grad, self.model.parameters()), lr=self.learning_rate
        )

    def load_checkpoint(self, checkpoint_path: str) -> None:
        """
        Loads pre-trained weights from a checkpoint file.

        Args:
            checkpoint_path: Path to PyTorch checkpoint (.pth/.pt).
        """
        checkpoint = torch.load(checkpoint_path, map_location=self.device)
        if "state_dict" in checkpoint:
            self.model.load_state_dict(checkpoint["state_dict"])
        else:
            self.model.load_state_dict(checkpoint)
        print(f"[FineTuner] Pre-trained weights loaded from: {checkpoint_path}")

    def freeze_encoder(self) -> None:
        """Freezes encoder backbone layers to update only decoder parameters during fine-tuning."""
        if hasattr(self.model, "encoder"):
            for param in self.model.encoder.parameters():
                param.requires_grad = False
            print("[FineTuner] Encoder layers frozen.")
        else:
            print("[FineTuner] Warning: Model does not have an explicit 'encoder' attribute.")

    def unfreeze_all(self) -> None:
        """Unfreezes all parameters across encoder and decoder layers for full fine-tuning."""
        for param in self.model.parameters():
            param.requires_grad = True
        print("[FineTuner] All model parameters unfrozen.")

    def fine_tune_epoch(self, dataloader: DataLoader, criterion: nn.Module) -> float:
        """
        Runs a single fine-tuning epoch on regional/target dataset.

        Args:
            dataloader: PyTorch DataLoader for fine-tuning data.
            criterion: Loss function module.

        Returns:
            float: Average fine-tuning epoch loss.
        """
        self.model.train()
        running_loss = 0.0

        for inputs, targets in dataloader:
            inputs, targets = inputs.to(self.device), targets.to(self.device)

            self.optimizer.zero_grad()
            outputs = self.model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            self.optimizer.step()

            running_loss += loss.item()

        return running_loss / max(1, len(dataloader))


if __name__ == "__main__":
    from src.models.nowcast_net import NowcastNet

    print("[FineTuner Test] Initializing fine-tuning module placeholder...")
    model = NowcastNet(in_channels=1, out_channels=1, in_seq_len=4, out_seq_len=6)
    finetuner = FineTuner(model=model, learning_rate=1e-4, device="cpu")

    print(f"FineTuner initialized with LR: {finetuner.learning_rate}")
    finetuner.freeze_encoder()
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Trainable parameters after freezing encoder: {trainable_params:,}")
