"""WebSocket server broadcasting fleet telemetry snapshots to every connected browser."""

import asyncio
import json
import time
from typing import Set

from websockets import ConnectionClosed
from websockets.asyncio.server import ServerConnection, serve

from telemetry_mock import constants, mavlink_codec, vehicle

clients: Set[ServerConnection] = set()


async def handle_client(websocket: ServerConnection) -> None:
    clients.add(websocket)
    print(f"[telemetry_mock] client connected ({len(clients)} total)")
    try:
        await websocket.wait_closed()
    finally:
        clients.discard(websocket)
        print(f"[telemetry_mock] client disconnected ({len(clients)} total)")


async def broadcast_loop() -> None:
    fleet = vehicle.build_fleet()
    encoder = mavlink_codec.make_encoder()
    decoder = mavlink_codec.make_decoder()
    start = time.monotonic()

    while True:
        elapsed_s = time.monotonic() - start
        payload = json.dumps(
            {
                "type": "fleet-snapshot",
                "timestamp": time.time(),
                "vehicles": [vehicle.snapshot(v, elapsed_s, encoder, decoder) for v in fleet],
            }
        )
        if clients:
            await asyncio.gather(
                *(_send_safely(client, payload) for client in clients),
                return_exceptions=True,
            )
        await asyncio.sleep(constants.TICK_INTERVAL_S)


async def _send_safely(client: ServerConnection, payload: str) -> None:
    try:
        await client.send(payload)
    except ConnectionClosed:
        pass


async def main() -> None:
    async with serve(handle_client, constants.WS_HOST, constants.WS_PORT):
        print(f"[telemetry_mock] serving on ws://{constants.WS_HOST}:{constants.WS_PORT}")
        await broadcast_loop()


if __name__ == "__main__":
    asyncio.run(main())
