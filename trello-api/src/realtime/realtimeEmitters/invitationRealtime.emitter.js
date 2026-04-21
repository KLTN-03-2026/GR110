import { GET_SOCKET } from '~/config/socket'
import { REALTIME_EVENTS } from '~/realtime/realtime.events'
import { getUserRoom } from '~/realtime/realtime.rooms'

const emitInvitationCreated = ({ userId, data }) => {
  const io = GET_SOCKET()
  const boardRoom = getUserRoom(String(userId))

  io.to(boardRoom).emit(REALTIME_EVENTS.INVITE, {
    userId: String(userId),
    data
  })
}

export { emitInvitationCreated }
