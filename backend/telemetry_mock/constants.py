"""Simulation and server tuning knobs — no magic numbers in the rest of the package."""

WS_HOST = "localhost"
WS_PORT = 8765

TICK_HZ = 2
TICK_INTERVAL_S = 1 / TICK_HZ

VEHICLE_COUNT = 5
VEHICLE_NAMES = ["Falcon", "Osprey", "Kestrel", "Harrier", "Merlin"]

BASE_LAT = 50.4501  # Kyiv, used as the fleet's home/patrol center
BASE_LON = 30.5234

PATROL_RADIUS_MIN_M = 400
PATROL_RADIUS_MAX_M = 900
PATROL_PERIOD_MIN_S = 90
PATROL_PERIOD_MAX_S = 160

ALTITUDE_BASE_M = 120
ALTITUDE_AMPLITUDE_M = 25
ALTITUDE_PERIOD_S = 45

GROUNDSPEED_BASE_MS = 12
GROUNDSPEED_AMPLITUDE_MS = 3

BATTERY_START_PERCENT = 100
BATTERY_DRAIN_PERCENT_PER_S = 100 / (20 * 60)  # full charge lasts ~20 simulated minutes
BATTERY_LOW_PERCENT = 25
VOLTAGE_FULL_V = 25.2
VOLTAGE_EMPTY_V = 19.8

EARTH_RADIUS_M = 6_371_000
