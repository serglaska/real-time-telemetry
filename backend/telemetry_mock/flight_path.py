"""Pure math for a simulated patrol flight: position, heading, altitude, battery over time."""

from dataclasses import dataclass
from math import atan2, cos, degrees, pi, radians, sin

from telemetry_mock import constants


@dataclass(frozen=True)
class PatrolProfile:
    radius_m: float
    period_s: float
    phase_rad: float
    clockwise: bool


def offset_latlon(lat: float, lon: float, north_m: float, east_m: float) -> tuple[float, float]:
    d_lat = degrees(north_m / constants.EARTH_RADIUS_M)
    d_lon = degrees(east_m / (constants.EARTH_RADIUS_M * cos(radians(lat))))
    return lat + d_lat, lon + d_lon


def patrol_position(profile: PatrolProfile, elapsed_s: float) -> tuple[float, float, float]:
    """Returns (north_m, east_m, heading_deg) for a point on the patrol circle."""
    direction = -1 if profile.clockwise else 1
    angle = direction * (2 * pi * elapsed_s / profile.period_s) + profile.phase_rad
    angular_velocity = direction * 2 * pi / profile.period_s

    north_m = profile.radius_m * sin(angle)
    east_m = profile.radius_m * (1 - cos(angle))

    d_north = profile.radius_m * angular_velocity * cos(angle)
    d_east = profile.radius_m * angular_velocity * sin(angle)
    heading_deg = degrees(atan2(d_east, d_north)) % 360

    return north_m, east_m, heading_deg


def altitude_m(elapsed_s: float, phase_rad: float) -> float:
    wave = sin(2 * pi * elapsed_s / constants.ALTITUDE_PERIOD_S + phase_rad)
    return constants.ALTITUDE_BASE_M + constants.ALTITUDE_AMPLITUDE_M * wave


def groundspeed_ms(elapsed_s: float, phase_rad: float) -> float:
    wave = sin(2 * pi * elapsed_s / constants.ALTITUDE_PERIOD_S + phase_rad + pi / 3)
    return constants.GROUNDSPEED_BASE_MS + constants.GROUNDSPEED_AMPLITUDE_MS * wave


def battery_percent(elapsed_s: float) -> float:
    drained = constants.BATTERY_DRAIN_PERCENT_PER_S * elapsed_s
    return max(constants.BATTERY_START_PERCENT - drained, 0.0)


def voltage_v(battery_pct: float) -> float:
    ratio = battery_pct / constants.BATTERY_START_PERCENT
    return constants.VOLTAGE_EMPTY_V + ratio * (constants.VOLTAGE_FULL_V - constants.VOLTAGE_EMPTY_V)
