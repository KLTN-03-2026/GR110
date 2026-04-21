import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPayment } from '~/apis/subscriptions.api'

export default function usePayment() {
  const { subscriptionId } = useParams()
  const [dataPayment, setDataPayment] = useState(null)

  const [selectedGateway, setSelectedGateway] = useState('sepay')

  useEffect(() => {
    if (!subscriptionId) return

    const fetchPaymentDetail = async () => {
      try {
        const res = await fetchPayment({ subscriptionId })
        console.log(res);
        
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
    setSelectedGateway
  }
}
