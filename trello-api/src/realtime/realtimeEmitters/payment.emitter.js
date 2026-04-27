import { GET_SOCKET } from '~/config/socket'
import { REALTIME_EVENTS } from '~/realtime/realtime.events'
import { getWorkspaceRoom } from '~/realtime/realtime.rooms'

const emitPayment = ({ workspaceId, subscriptionId, status }) => {
  const io = GET_SOCKET()
  const workspaceRoom = getWorkspaceRoom(String(workspaceId))
  io.to(workspaceRoom).emit(REALTIME_EVENTS.PAYMENT, {
    workspaceId: String(workspaceId),
    subscriptionId: String(subscriptionId),
    status: String(status)
  })
}

export { emitPayment }