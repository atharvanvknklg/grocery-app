import React, { useContext, useState } from 'react'
import "./Navbar.css"
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/storeContext'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const { getTotalCartAmount, token, logout, food_list } = useContext(StoreContext)
  const navigate = useNavigate()

  const toggleDark = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark-mode")
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim()) {
      navigate(`/?search=${e.target.value}`)
    } else {
      navigate("/")
    }
  }

  return (
    <div className='navbar'>
      <Link to="/"><img src={assets.logo} alt='' className='logo' /></Link>
      <ul className='navbar-menu'>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact-us</a>
      </ul>
      <div className='navbar-right'>
        {showSearch && (
          <div className='search-box'>
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
            <span onClick={() => { setShowSearch(false); setSearchQuery(""); navigate("/") }}>✕</span>
          </div>
        )}
        <img className="img1" src={assets.search_icon} alt="" onClick={() => setShowSearch(!showSearch)} style={{ cursor: 'pointer' }} />
        <button className='dark-toggle' onClick={toggleDark}>{darkMode ? '☀️' : '🌙'}</button>
        <div className='navbar-search-icon'>
          <Link to="/Cart"><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt='' />
            <ul className='nav-profile-dropdown'>
              <li onClick={() => navigate("/myorders")}><img src={assets.bag_icon} alt='' /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt='' /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
