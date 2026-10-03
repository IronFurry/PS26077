"""
Model Training Pipeline Module.

Operational Role:
    Manages the full end-to-end training loop for spatial weather nowcasting neural networks.
    Handles optimizer configuration, loss evaluation, validation epoch metrics, TensorBoard/W&B logging,
    and saving best checkpoint weights to models/checkpoints/.
"""

import os
from typing import Dict, Any
import torch
import torch.nn as nn
from torch.utils.data import DataLoader


class Trainer:
    """
    Trainer class encapsulating epoch loops, optimization, validation, and checkpoint persistence.

    Attributes:
        model (nn.Module): The nowcasting neural network instance.
        optimizer (torch.optim.Optimizer): Optimization algorithm instance.
        criterion (nn.Module): Loss function module.
        device (str): Execution device ('cuda' or 'cpu').
        checkpoint_dir (str): Destination path for model weights artifacts.
    """

    def __init__(
        self,
        model: nn.Module,
        optimizer: torch.optim.Optimizer,
        criterion: nn.Module,
        device: str = "cpu",
        checkpoint_dir: str = "models/checkpoints",
    ) -> None:
        """
        Initializes the trainer with model, optimizer, loss, and hardware device settings.

        Args:
            model: Neural network model instance.
            optimizer: Configured PyTorch optimizer.
            criterion: Loss function module.
            device: Hardware target string ('cuda', 'cpu', 'mps').
            checkpoint_dir: Path to directory where checkpoints are stored.
        """
        self.model = model.to(device)
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device
        self.checkpoint_dir = checkpoint_dir
        os.makedirs(self.checkpoint_dir, exist_ok=True)

    def train_epoch(self, dataloader: DataLoader) -> float:
        """
        Runs one training epoch over the given dataset loader.

        Args:
            dataloader: PyTorch DataLoader providing training batches.

        Returns:
            float: Average training loss across the epoch.
        """
        self.model.train()
        running_loss = 0.0

        for batch_idx, (inputs, targets) in enumerate(dataloader):
            inputs, targets = inputs.to(self.device), targets.to(self.device)

            self.optimizer.zero_grad()
            outputs = self.model(inputs)
            loss = self.criterion(outputs, targets)
            loss.backward()
            self.optimizer.step()

            running_loss += loss.item()

        return running_loss / max(1, len(dataloader))

    def validate(self, dataloader: DataLoader) -> float:
        """
        Evaluates the model on validation data.

        Args:
            dataloader: PyTorch DataLoader providing validation batches.

        Returns:
            float: Average validation loss across the dataset.
        """
        self.model.eval()
        running_loss = 0.0

        with torch.no_grad():
            for inputs, targets in enumerate(dataloader):
                inputs, targets = inputs.to(self.device), targets.to(self.device)
                outputs = self.model(inputs)
                loss = self.criterion(outputs, targets)
                running_loss += loss.item()

        return running_loss / max(1, len(dataloader))

    def save_checkpoint(self, filename: str, metadata: Dict[str, Any]) -> str:
        """
        Saves current model state dictionary and training metadata.

        Args:
            filename: Checkpoint filename (e.g. 'nowcast_epoch_10.pth').
            metadata: Dictionary containing epoch count, loss metrics, hyperparams.

        Returns:
            str: Absolute filepath of saved checkpoint.
        """
        save_path = os.path.join(self.checkpoint_dir, filename)
        checkpoint = {
            "state_dict": self.model.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "metadata": metadata,
        }
        torch.save(checkpoint, save_path)
        print(f"[Trainer] Checkpoint saved to: {save_path}")
        return save_path


if __name__ == "__main__":
    from src.models.nowcast_net import NowcastNet
    from src.models.loss import SpatialWeatherLoss
    from src.data.dataset import SpatialWeatherDataset

    print("[Trainer Test] Initializing training pipeline placeholder...")
    model = NowcastNet(in_channels=1, out_channels=1, in_seq_len=4, out_seq_len=6)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = SpatialWeatherLoss()

    trainer = Trainer(model=model, optimizer=optimizer, criterion=criterion, device="cpu")
    print(f"Trainer successfully configured for device: {trainer.device}")
    print(f"Checkpoints directory set to: {trainer.checkpoint_dir}")
