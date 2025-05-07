import { DataTable } from "@/components/custom ui/DataTable"
import { columns } from "@/components/orderItems/OrderItemsColums"
import {CustomTable} from "@/components/custom ui/CustomTable"

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`,
    { cache: "no-store" }
  )
  const { orderDetails, customer } = await res.json()

  const { street, city, state, postalCode, country } = orderDetails.shippingAddress

  return (
    <div className="p-6 sm:p-10 space-y-6 w-full max-w-3xl mx-auto">
  <div dir="rtl" className="space-y-4 bg-white rounded-xl shadow-md p-6 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-800">פרטי הזמנה</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-right text-gray-700 text-base">
      <div>
        <p className="font-semibold">מזהה הזמנה</p>
        <p className="text-sm text-gray-500 break-all">{orderDetails._id}</p>
      </div>

      <div>
        <p className="font-semibold">שם משתמש</p>
        <p className="text-sm text-gray-500">{customer.name}</p>
      </div>

      <div>
        <p className="font-semibold">פרטי לקוח</p>
        <p className="text-sm text-gray-500">{street}</p>
      </div>

      <div>
        <p className="font-semibold">מספר רכב</p>
        <p className="text-sm text-gray-500">{city}</p>
      </div>

      <div className="sm:col-span-2">
        <p className="font-semibold">סכום מחיר המוצרים</p>
        <p className="text-sm text-green-600 font-bold">₪ {orderDetails.totalAmount}</p>
      </div>
    </div>
  </div>


      
      <CustomTable columns={columns} data={orderDetails.products} />
    </div>
  )
}

export default OrderDetails