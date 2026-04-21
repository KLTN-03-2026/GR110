import { getUserRoom } from '~/realtime/realtime.rooms'

const registerUserSocket = (socket) => {
  console.log(`registerUserSocket called for ${socket.id}`)

  socket.on('user:join', ({ userId }) => {
    console.log('received user:join:', userId)

    if (!userId) return

    const normalizedUserId = String(userId)
    const userRoom = getUserRoom(normalizedUserId)

    socket.join(userRoom)
    console.log(`Socket ${socket.id} joined room: ${userRoom}`)
  })

  socket.on('user:leave', ({ userId }) => {
    console.log('received user:leave:', userId)

    if (!userId) return

    const normalizedUserId = String(userId)
    const userRoom = getUserRoom(normalizedUserId)

    socket.leave(userRoom)
    console.log(`Socket ${socket.id} left room: ${userRoom}`)
  })
}

export { registerUserSocket }