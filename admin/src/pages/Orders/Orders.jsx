import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Orders.css'

const statusOptions = ["Food Processing", "Out for Delivery", "Delivered"]

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`)
      if (res.data.success) setOrders(res.data.data)
      else toast.error('Failed to load orders')
    } catch {
      toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, { orderId, status })
      if (res.data.success) {
        toast.success('Status updated')
        fetchOrders()
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter)

  const statusColor = (status) => {
    if (status === "Delivered") return "status-delivered"
    if (status === "Out for Delivery") return "status-out"
    return "status-processing"
  }

  if (loading) return <div className='orders-loading'><div className='spinner'></div><p>Loading Orders...</p></div>

  return (
    <div className='orders-page'>
      <div className='orders-header'>
        <h1>Orders <span className='order-count'>({filtered.length})</span></h1>
        <div className='filter-tabs'>
          {["All", ...statusOptions].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='no-orders'>No orders found</div>
      ) : (
        <div className='orders-list'>
          {filtered.map((order, i) => (
            <div key={order._id} className='order-card'>
              <div className='order-top'>
                <div className='order-meta'>
                  <span className='order-num'>Order #{i + 1}</span>
                  <span className='order-date'>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <span className={`order-status-badge ${statusColor(order.status)}`}>{order.status}</span>
              </div>
              <div className='order-items'>
                {order.items.map((item, j) => (
                  <span key={j} className='order-item-tag'>{item.name} x{item.quantity}</span>
                ))}
              </div>
              <div className='order-bottom'>
                <div className='order-address'>
                  <span>📍 {order.address.street}, {order.address.city}</span>
                </div>
                <div className='order-right'>
                  <span className='order-amount'>₹{order.amount}</span>
                  <select className='status-select' value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
