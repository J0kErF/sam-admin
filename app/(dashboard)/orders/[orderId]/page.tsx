import { DataTable } from "@/components/custom ui/DataTable"
import { columns } from "@/components/orderItems/OrderItemsColums"

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`,
    { cache: "no-store" }
  )
  const { orderDetails, customer } = await res.json()

  const { street, city, state, postalCode, country } = orderDetails.shippingAddress

  return (
    <div className="flex flex-col p-10 gap-5">
      <div dir="rtl">
      <p className="text-base-bold">
        ID: <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      <p className="text-base-bold">
        שם משתמש: <span className="text-base-medium">{customer.name}</span>
      </p>
      <p className="text-base-bold">
        פרטי לקוח: <span className="text-base-medium">{street}</span>
      </p>
      
      <p className="text-base-bold">
        מספר רכב: <span className="text-base-medium">{city}</span>
      </p>
      <p className="text-base-bold">
        סכום מחיר המוצרים: <span className="text-base-medium">${orderDetails.totalAmount}</span>
      </p>
      </div>
      <DataTable columns={columns} data={orderDetails.products} searchKey="product" />
    </div>
  )
}

export default OrderDetails