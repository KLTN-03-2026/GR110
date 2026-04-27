import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPayment } from '~/apis/subscriptions.api'
import { initSocket } from '~/socket/socket'

export default function usePayment() {
  const { subscriptionId } = useParams()
  const { workspaceId } = useParams()
  const [dataPayment, setDataPayment] = useState(null)
  const [localStatus, setLocalStatus] = useState('idle')

  const [selectedGateway, setSelectedGateway] = useState('sepay')

  useEffect(() => {
    if (!subscriptionId) return

    const fetchPaymentDetail = async () => {
      try {
        const res = await fetchPayment({ subscriptionId })
        setLocalStatus(res.status === 'active' ? 'success' : 'idle')
        
        const socket =initSocket()

        const join = () => socket.emit('workspace:join', { workspaceId })

        if (socket.connected) join()
        socket.on('connect', join)

        const handlePaymentUpdated = (data) => {
          if (data.workspaceId !== workspaceId) return
          if (data.subscriptionId !== subscriptionId) return

          setLocalStatus(data.status)
        }

        socket.on('payment:updated', handlePaymentUpdated)

        setDataPayment(res)
      } catch (error) {
        console.log('ERROR FETCH PAYMENT:', error)
      }
    }

    fetchPaymentDetail()
  }, [subscriptionId])

  return {
    dataPayment,
    selectedGateway,
    setSelectedGateway,
    localStatus,
  }
}
