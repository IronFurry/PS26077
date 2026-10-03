"""
Neural network architectures and loss functions module for spatial weather nowcasting.

Exports WeatherNowcastNet (and NowcastNet alias) alongside SpatialWeatherLoss.
"""

from .nowcast_net import WeatherNowcastNet, NowcastNet
from .loss import SpatialWeatherLoss

__all__ = ["WeatherNowcastNet", "NowcastNet", "SpatialWeatherLoss"]
