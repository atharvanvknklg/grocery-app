import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/Users/Users'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const url = "http://localhost:4000"

const App = () => {
  return (
    <div className='app-wrapper'>
      <ToastContainer />
      <Navbar />
      <div className='app-content'>
        <Sidebar />
        <div className='main-content'>
          <Routes>
            <Route path='/' element={<Navigate to="/dashboard" replace />} />
            <Route path='/dashboard' element={<Dashboard url={url} />} />
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
            <Route path='/users' element={<Users url={url} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
