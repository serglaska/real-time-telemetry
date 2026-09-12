"""Round-trips simulated vehicle state through real MAVLink pack/unpack.

Each tick, a simulated vehicle's numbers are encoded into genuine MAVLink v2
frames (HEARTBEAT, GPS_RAW_INT, GLOBAL_POSITION_INT, VFR_HUD, SYS_STATUS) via
pymavlink, then decoded straight back — proving the wire format is real, not
a hand-rolled JSON stand-in. The decoded fields are what the WebSocket server
actually forwards to the browser.
"""

from io import BytesIO

from pymavlink.dialects.v20 import common as mavlink_common

GPS_FIX_NAMES = {
    mavlink_common.GPS_FIX_TYPE_NO_FIX: "no-fix",
    mavlink_common.GPS_FIX_TYPE_2D_FIX: "fix-2d",
    mavlink_common.GPS_FIX_TYPE_3D_FIX: "fix-3d",
}


def make_encoder() -> mavlink_common.MAVLink:
    return mavlink_common.MAVLink(BytesIO(), srcSystem=1, srcComponent=1)


def make_decoder() -> mavlink_common.MAVLink:
    return mavlink_common.MAVLink(BytesIO(), srcSystem=255, srcComponent=0)


def encode_snapshot(encoder: mavlink_common.MAVLink, raw: dict) -> bytes:
    base_mode = mavlink_common.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED
    if raw["armed"]:
        base_mode |= mavlink_common.MAV_MODE_FLAG_SAFETY_ARMED

    messages = [
        encoder.heartbeat_encode(
            type=mavlink_common.MAV_TYPE_QUADROTOR,
            autopilot=mavlink_common.MAV_AUTOPILOT_GENERIC,
            base_mode=base_mode,
            custom_mode=0,
            system_status=mavlink_common.MAV_STATE_ACTIVE,
        ),
        encoder.gps_raw_int_encode(
            time_usec=0,
            fix_type=mavlink_common.GPS_FIX_TYPE_3D_FIX,
            lat=round(raw["lat"] * 1e7),
            lon=round(raw["lon"] * 1e7),
            alt=round(raw["altitude_m"] * 1000),
            eph=100,
            epv=100,
            vel=round(raw["groundspeed_ms"] * 100),
            cog=round(raw["heading_deg"] * 100),
            satellites_visible=12,
        ),
        encoder.global_position_int_encode(
            time_boot_ms=0,
            lat=round(raw["lat"] * 1e7),
            lon=round(raw["lon"] * 1e7),
            alt=round(raw["altitude_m"] * 1000),
            relative_alt=round(raw["altitude_m"] * 1000),
            vx=0,
            vy=0,
            vz=0,
            hdg=round(raw["heading_deg"] * 100),
        ),
        encoder.vfr_hud_encode(
            airspeed=raw["groundspeed_ms"],
            groundspeed=raw["groundspeed_ms"],
            heading=round(raw["heading_deg"]),
            throttle=50,
            alt=raw["altitude_m"],
            climb=0.0,
        ),
        encoder.sys_status_encode(
            onboard_control_sensors_present=0,
            onboard_control_sensors_enabled=0,
            onboard_control_sensors_health=0,
            load=0,
            voltage_battery=round(raw["voltage_v"] * 1000),
            current_battery=-1,
            battery_remaining=round(raw["battery_percent"]),
            drop_rate_comm=0,
            errors_comm=0,
            errors_count1=0,
            errors_count2=0,
            errors_count3=0,
            errors_count4=0,
        ),
    ]
    return b"".join(msg.pack(encoder) for msg in messages)


def decode_snapshot(decoder: mavlink_common.MAVLink, frame_bytes: bytes) -> dict:
    fields: dict = {}
    for byte in frame_bytes:
        message = decoder.parse_char(bytes([byte]))
        if message is None:
            continue
        packet_type = message.get_type()
        if packet_type == "HEARTBEAT":
            fields["armed"] = bool(message.base_mode & mavlink_common.MAV_MODE_FLAG_SAFETY_ARMED)
        elif packet_type == "GPS_RAW_INT":
            fields["gpsFix"] = GPS_FIX_NAMES.get(message.fix_type, "no-fix")
        elif packet_type == "GLOBAL_POSITION_INT":
            fields["lat"] = message.lat / 1e7
            fields["lon"] = message.lon / 1e7
            fields["altitudeM"] = message.alt / 1000
            fields["headingDeg"] = message.hdg / 100
        elif packet_type == "VFR_HUD":
            fields["groundspeedMs"] = message.groundspeed
        elif packet_type == "SYS_STATUS":
            fields["voltageV"] = message.voltage_battery / 1000
            fields["batteryPercent"] = message.battery_remaining
    return fields
