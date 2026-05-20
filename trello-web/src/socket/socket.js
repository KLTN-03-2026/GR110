import { io } from 'socket.io-client'

let socketInstance = null
let activeConsumers = 0
let hasBoundCoreListeners = false

const SOCKET_URL = 'http://localhost:8017'
const SOCKET_OPTIONS = {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
  // transports: ['websocket']
}

const bindCoreListeners = () => {
  if (!socketInstance || hasBoundCoreListeners) return

  socketInstance.on('connect', () => {
    console.log('Socket connected:', socketInstance.id)
  })

  socketInstance.on('connect_error', (error) => {
    console.error('Socket connect error:', error)
  })

  socketInstance.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  hasBoundCoreListeners = true
}

const initSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, SOCKET_OPTIONS)
  }

  bindCoreListeners()
  activeConsumers += 1

  if (!socketInstance.connected) {
    socketInstance.connect()
  }

  return socketInstance
}

const getSocket = () => {
  if (!socketInstance) {
    throw new Error('Socket is not initialized. Call initSocket first.')
  }

  return socketInstance
}

const disconnectSocket = () => {
  if (!socketInstance) return

  socketInstance.removeAllListeners()
  socketInstance.disconnect()
  socketInstance = null
  activeConsumers = 0
  hasBoundCoreListeners = false
}

const releaseSocket = () => {
  if (!socketInstance) return

  activeConsumers = Math.max(0, activeConsumers - 1)
  if (activeConsumers > 0) return

  disconnectSocket()
}

export { initSocket, getSocket, disconnectSocket, releaseSocket }
