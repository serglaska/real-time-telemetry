"""A simulated fleet vehicle: turns elapsed time into a MAVLink-encoded telemetry snapshot."""

from dataclasses import dataclass
from random import Random

from telemetry_mock import constants, flight_path, mavlink_codec


@dataclass(frozen=True)
class Vehicle:
    id: str
    name: str
    profile: flight_path.PatrolProfile
    altitude_phase: float


def build_fleet() -> list[Vehicle]:
    rng = Random(42)  # fixed seed: every server run reproduces the same flight paths
    fleet = []
    for index in range(constants.VEHICLE_COUNT):
        name = constants.VEHICLE_NAMES[index % len(constants.VEHICLE_NAMES)]
        profile = flight_path.PatrolProfile(
            radius_m=rng.uniform(constants.PATROL_RADIUS_MIN_M, constants.PATROL_RADIUS_MAX_M),
            period_s=rng.uniform(constants.PATROL_PERIOD_MIN_S, constants.PATROL_PERIOD_MAX_S),
            phase_rad=rng.uniform(0, 6.28),
            clockwise=index % 2 == 0,
        )
        fleet.append(
            Vehicle(
                id=f"uav-{index + 1:02d}",
                name=f"{name}-{index + 1}",
                profile=profile,
                altitude_phase=rng.uniform(0, 6.28),
            )
        )
    return fleet


def raw_state(vehicle: Vehicle, elapsed_s: float) -> dict:
    north_m, east_m, heading_deg = flight_path.patrol_position(vehicle.profile, elapsed_s)
    lat, lon = flight_path.offset_latlon(constants.BASE_LAT, constants.BASE_LON, north_m, east_m)
    battery_percent = flight_path.battery_percent(elapsed_s)
    return {
        "lat": lat,
        "lon": lon,
        "altitude_m": flight_path.altitude_m(elapsed_s, vehicle.altitude_phase),
        "heading_deg": heading_deg,
        "groundspeed_ms": flight_path.groundspeed_ms(elapsed_s, vehicle.altitude_phase),
        "battery_percent": battery_percent,
        "voltage_v": flight_path.voltage_v(battery_percent),
        "armed": True,
    }


def snapshot(vehicle: Vehicle, elapsed_s: float, encoder, decoder) -> dict:
    raw = raw_state(vehicle, elapsed_s)
    frame = mavlink_codec.encode_snapshot(encoder, raw)
    decoded = mavlink_codec.decode_snapshot(decoder, frame)
    flight_mode = "rtl" if decoded["batteryPercent"] < constants.BATTERY_LOW_PERCENT else "auto"
    return {
        "id": vehicle.id,
        "name": vehicle.name,
        "flightMode": flight_mode,
        **decoded,
    }
