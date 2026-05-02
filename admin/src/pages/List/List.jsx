import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './List.css'

const List = ({ url }) => {
  const [list, setList] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [search, setSearch] = useState("")

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`)
      if (res.data.success) setList(res.data.data)
      else toast.error('Error fetching list')
    } catch {
      toast.error('Server error')
    }
  }

  const removeFood = async (id) => {
    if (!window.confirm("Remove this item?")) return
    const res = await axios.post(`${url}/api/food/remove`, { id })
    if (res.data.success) { toast.success(res.data.message); fetchList() }
    else toast.error('Failed to remove')
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setEditData({ price: item.price, stock: item.stock, available: item.available })
  }

  const saveEdit = async (id) => {
    const res = await axios.post(`${url}/api/food/update`, { id, ...editData })
    if (res.data.success) {
      toast.success('Item updated')
      setEditingId(null)
      fetchList()
    } else toast.error('Update failed')
  }

  useEffect(() => { fetchList() }, [])

  const filtered = list.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='list-page'>
      <div className='list-header'>
        <h1>Inventory <span className='list-count'>({list.length} items)</span></h1>
        <input
          className='list-search'
          type='text'
          placeholder='Search by name or category...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className='list-table-wrap'>
        <div className='list-table-head'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price (₹)</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.map(item => (
          <div key={item._id} className={`list-table-row ${!item.available ? 'unavailable' : ''}`}>
            <img src={`${url}/images/${item.image}`} alt='' className='list-img' />
            <span className='list-name'>{item.name}</span>
            <span className='list-cat'><span className='cat-tag'>{item.category}</span></span>

            {editingId === item._id ? (
              <>
                <input className='edit-input' type='number' value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} />
                <input className='edit-input' type='number' value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })} />
                <select className='edit-input' value={editData.available} onChange={e => setEditData({ ...editData, available: e.target.value === 'true' })}>
                  <option value='true'>Active</option>
                  <option value='false'>Inactive</option>
                </select>
                <div className='action-btns'>
                  <button className='save-btn' onClick={() => saveEdit(item._id)}>Save</button>
                  <button className='cancel-btn' onClick={() => setEditingId(null)}>✕</button>
                </div>
              </>
            ) : (
              <>
                <span>₹{item.price}</span>
                <span className={item.stock < 10 ? 'low-stock' : ''}>{item.stock ?? 'N/A'}</span>
                <span className={`avail-badge ${item.available !== false ? 'avail-yes' : 'avail-no'}`}>
                  {item.available !== false ? 'Active' : 'Inactive'}
                </span>
                <div className='action-btns'>
                  <button className='edit-btn' onClick={() => startEdit(item)}>Edit</button>
                  <button className='del-btn' onClick={() => removeFood(item._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
