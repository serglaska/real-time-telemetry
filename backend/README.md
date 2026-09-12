# Mock MAVLink telemetry server

Симулює 5-дронний флот, що летить патрульними маршрутами, і транслює його телеметрію
будь-якому підключеному браузеру через звичайний WebSocket, ~2 рази на секунду.

На кожному тіку симульована позиція/висота/батарея апарата пакується у справжні
MAVLink v2 фрейми (`HEARTBEAT`, `GPS_RAW_INT`, `GLOBAL_POSITION_INT`, `VFR_HUD`,
`SYS_STATUS`) через `pymavlink`, а потім одразу декодується назад — див.
[`mavlink_codec.py`](telemetry_mock/mavlink_codec.py). Саме декодовані поля йдуть на
фронтенд у вигляді JSON.

## Запуск

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m telemetry_mock
```

За замовчуванням обслуговує `ws://localhost:8765` (див. `telemetry_mock/constants.py`).
