import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Users.css'

const Users = ({ url }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/user/all`)
      if (res.data.success) setUsers(res.data.data)
      else toast.error('Failed to load users')
    } catch {
      toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className='users-loading'><div className='spinner'></div><p>Loading Users...</p></div>

  return (
    <div className='users-page'>
      <div className='users-header'>
        <h1>Users <span className='user-count'>({users.length})</span></h1>
        <input
          className='user-search'
          type='text'
          placeholder='Search by name or email...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className='users-table'>
        <div className='users-table-head'>
          <span>#</span>
          <span>Name</span>
          <span>Email</span>
          <span>Joined</span>
          <span>Cart Items</span>
        </div>
        {filtered.length === 0 ? (
          <div className='no-users'>No users found</div>
        ) : (
          filtered.map((user, i) => (
            <div key={user._id} className='user-row'>
              <span className='user-idx'>{i + 1}</span>
              <div className='user-name-cell'>
                <div className='user-avatar'>{user.name.charAt(0).toUpperCase()}</div>
                <span>{user.name}</span>
              </div>
              <span className='user-email'>{user.email}</span>
              <span className='user-date'>{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className='user-cart'>{Object.keys(user.cartData || {}).filter(k => user.cartData[k] > 0).length} items</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Users
