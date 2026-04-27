import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useParams } from 'react-router-dom'
import { createOrderPal } from '~/apis/subscriptions.api'

export default function PaypalCheckout(payment) {
  const { subscriptionId } = useParams()
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'AUSnwZvB4niCNXPw3PIbEfsqooo_we0aiFJf7gqUhlmdM-Gzq3Zrz2iwle38w793d59hI2GnuXMmbtIc',
        currency: 'USD',
        intent: 'capture'
      }}
    >
      <PayPalButtons
        createOrder={async () => {
          console.log(subscriptionId);
          
          const data = await createOrderPal({ subscriptionId, payment })
          return data.orderId
        }}
        onError={(err) => {
          alert('Có lỗi thanh toán')
        }}
      />
    </PayPalScriptProvider>
  )
}
