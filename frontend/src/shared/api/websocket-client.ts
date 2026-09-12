import { CONNECTION_STATUS, WS_RECONNECT_DELAY_MS } from '@/shared/config/constants'

type ConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS]

type Listeners = {
  onMessage: (data: unknown) => void
  onStatusChange: (status: ConnectionStatus) => void
}

export function connectReconnectingSocket(url: string, { onMessage, onStatusChange }: Listeners) {
  let socket: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let stopped = false

  function open() {
    onStatusChange(CONNECTION_STATUS.CONNECTING)
    socket = new WebSocket(url)

    socket.onopen = () => onStatusChange(CONNECTION_STATUS.OPEN)

    socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data))
    }

    socket.onclose = () => {
      onStatusChange(CONNECTION_STATUS.CLOSED)
      if (!stopped) reconnectTimer = setTimeout(open, WS_RECONNECT_DELAY_MS)
    }

    socket.onerror = () => socket?.close()
  }

  open()

  return function disconnect() {
    stopped = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    socket?.close()
  }
}
