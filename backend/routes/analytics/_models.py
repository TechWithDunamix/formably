from pydantic import BaseModel
from typing import Dict, Optional

class DeviceDistribution(BaseModel):
    desktop: int
    mobile: int
    tablet: int
    other: int

class ResponseStats(BaseModel):
    total_responses: int
    device_distribution: DeviceDistribution
    browser_distribution: Dict[str, int]
    completion_rate: Optional[float]
