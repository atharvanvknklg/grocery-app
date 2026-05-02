import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Dashboard.css'

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${url}/api/order/dashboard`)
      if (res.data.success) {
        setStats(res.data.data)
      } else {
        toast.error('Failed to load dashboard')
      }
    } catch {
      toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  if (loading) return <div className='dashboard-loading'><div className='spinner'></div><p>Loading Dashboard...</p></div>
  if (!stats) return <div className='dashboard-error'>Failed to load stats</div>

  const maxRevenue = Math.max(...stats.last7Days.map(d => d.revenue), 1)

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h1>Dashboard</h1>
        <button onClick={fetchStats} className='refresh-btn'>↻ Refresh</button>
      </div>

      {/* Stat Cards */}
      <div className='stat-cards'>
        <div className='stat-card revenue'>
          <div className='stat-icon'>₹</div>
          <div className='stat-info'>
            <p className='stat-label'>Total Revenue</p>
            <h2>₹{stats.totalRevenue.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <div className='stat-card orders'>
          <div className='stat-icon'>📦</div>
          <div className='stat-info'>
            <p className='stat-label'>Total Orders</p>
            <h2>{stats.totalOrders}</h2>
          </div>
        </div>
        <div className='stat-card users'>
          <div className='stat-icon'>👥</div>
          <div className='stat-info'>
            <p className='stat-label'>Total Users</p>
            <h2>{stats.totalUsers}</h2>
          </div>
        </div>
        <div className='stat-card pending'>
          <div className='stat-icon'>⏳</div>
          <div className='stat-info'>
            <p className='stat-label'>Pending Orders</p>
            <h2>{stats.pendingOrders}</h2>
          </div>
        </div>
        <div className='stat-card delivered'>
          <div className='stat-icon'>✅</div>
          <div className='stat-info'>
            <p className='stat-label'>Delivered</p>
            <h2>{stats.deliveredOrders}</h2>
          </div>
        </div>
      </div>

      <div className='dashboard-bottom'>
        {/* Revenue Chart */}
        <div className='chart-card'>
          <h3>Revenue — Last 7 Days</h3>
          <div className='bar-chart'>
            {stats.last7Days.map((day, i) => (
              <div key={i} className='bar-col'>
                <div className='bar-amount'>₹{day.revenue}</div>
                <div
                  className='bar'
                  style={{ height: `${(day.revenue / maxRevenue) * 160}px` }}
                  title={`₹${day.revenue}`}
                ></div>
                <div className='bar-label'>{day.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className='chart-card status-card'>
          <h3>Order Status Breakdown</h3>
          <div className='status-list'>
            {stats.statusBreakdown.map((item, i) => (
              <div key={i} className='status-row'>
                <div className={`status-dot status-${i}`}></div>
                <span className='status-name'>{item.status}</span>
                <span className='status-count'>{item.count}</span>
                <div className='status-bar-bg'>
                  <div
                    className={`status-bar-fill fill-${i}`}
                    style={{ width: `${stats.totalOrders ? (item.count / stats.totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
