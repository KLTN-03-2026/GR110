import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPayment } from '~/apis/subscriptions.api'
import { initSocket, releaseSocket } from '~/socket/socket'

export default function usePayment() {
  const { subscriptionId } = useParams()
  const { workspaceId } = useParams()
  const [dataPayment, setDataPayment] = useState(null)
  const [localStatus, setLocalStatus] = useState('idle')

  const [selectedGateway, setSelectedGateway] = useState('sepay')

  useEffect(() => {
    if (!subscriptionId) return

    let isMounted = true
    const socket = initSocket()
    const join = () => socket.emit('workspace:join', { workspaceId })
    if (socket.connected) join()
    socket.on('connect', join)

    const handlePaymentUpdated = (data) => {
      if (data.workspaceId !== workspaceId) return
      if (data.subscriptionId !== subscriptionId) return
      setLocalStatus(data.status)
    }

    socket.on('payment:updated', handlePaymentUpdated)

    const fetchPaymentDetail = async () => {
      try {
        const res = await fetchPayment({ subscriptionId })
        if (!isMounted) return

        const mappingStatus = {
          pending: 'idle',
          active: 'success',
          failed: 'failed',
          checking: 'checking'
        }
        setLocalStatus(mappingStatus[res.status] || 'idle')
        setDataPayment(res)
      } catch (error) {
        console.log('ERROR FETCH PAYMENT:', error)
      }
    }

    fetchPaymentDetail()

    return () => {
      isMounted = false
      socket.off('connect', join)
      socket.off('payment:updated', handlePaymentUpdated)
      socket.emit('workspace:leave', { workspaceId })
      releaseSocket()
    }
  }, [subscriptionId, workspaceId])

  return {
    dataPayment,
    selectedGateway,
    setSelectedGateway,
    localStatus
  }
}
