import { getWorkspaceRoom } from '~/realtime/realtime.rooms'

const registerWorkspaceSocket = (socket) => {
  console.log(`registerWorkspaceSocket called for ${socket.id}`)

  socket.on('workspace:join', ({ workspaceId }) => {
    console.log('received workspace:join:', workspaceId)

    if (!workspaceId) return

    const normalizedworkspaceId = String(workspaceId)
    const workspaceRoom = getWorkspaceRoom(normalizedworkspaceId)

    socket.join(workspaceRoom)
    console.log(`Socket ${socket.id} joined room: ${workspaceRoom}`)
  })

  socket.on('workspace:leave', ({ workspaceId }) => {
    console.log('received workspace:leave:', workspaceId)

    if (!workspaceId) return

    const normalizedworkspaceId = String(workspaceId)
    const workspaceRoom = getWorkspaceRoom(normalizedworkspaceId)

    socket.leave(workspaceRoom)
    console.log(`Socket ${socket.id} left room: ${workspaceRoom}`)
  })
}

export { registerWorkspaceSocket }