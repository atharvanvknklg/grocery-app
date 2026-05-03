import React, { useContext, useEffect, useState } from 'react'
import "./MyOrders.css"
import { StoreContext } from '../../context/storeContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const statusSteps = ["Food Processing", "Out for Delivery", "Delivered"]

const MyOrders = () => {
  const { url, token } = useContext(StoreContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
      if (response.data.success) setData(response.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  const getStatusIndex = (status) => statusSteps.indexOf(status)

  const statusColor = (status) => {
    if (status === "Delivered") return "#4caf50"
    if (status === "Out for Delivery") return "#2196f3"
    return "#ff9800"
  }

  if (loading) return <div className='orders-loading'><div className='spinner'></div><p>Loading your orders...</p></div>

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      {data.length === 0 ? (
        <div className='no-orders'>
          <img src={assets.parcel_icon} alt='' />
          <p>No orders yet!</p>
        </div>
      ) : (
        <div className='container'>
          {data.map((order, index) => (
            <div key={index} className='my-orders-order'>
              <div className='order-top'>
                <div className='order-info'>
                  <img src={assets.parcel_icon} alt='' />
                  <div>
                    <p className='order-items'>
                      {order.items.map((item, i) =>
                        i === order.items.length - 1
                          ? `${item.name} x${item.quantity}`
                          : `${item.name} x${item.quantity}, `
                      )}
                    </p>
                    <p className='order-date'>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className='order-right'>
                  <p className='order-amount'>₹{order.amount}.00</p>
                  <p className='order-count'>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className='order-tracking'>
                <div className='tracking-bar'>
                  {statusSteps.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className='tracking-step'>
                        <div className={`tracking-dot ${i <= getStatusIndex(order.status) ? 'active' : ''}`}
                          style={{ background: i <= getStatusIndex(order.status) ? statusColor(order.status) : '#ddd' }}></div>
                        <p className={`tracking-label ${i <= getStatusIndex(order.status) ? 'active-label' : ''}`}>{step}</p>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className='tracking-line'
                          style={{ background: i < getStatusIndex(order.status) ? statusColor(order.status) : '#ddd' }}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <button onClick={fetchOrders} className='track-btn'>↻ Refresh Status</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
