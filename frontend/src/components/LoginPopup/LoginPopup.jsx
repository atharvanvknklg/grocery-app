import React, { useContext, useState } from "react"
import "./LoginPopup.css"
import { assets } from "../../assets/assets"
import { StoreContext } from "../../context/storeContext"
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {
  const { url, saveToken } = useContext(StoreContext)
  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    let endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register"
    try {
      const response = await axios.post(url + endpoint, data)
      if (response.data.success) {
        saveToken(response.data.token, response.data.refreshToken, response.data.user)
        setShowLogin(false)
      } else {
        setError(response.data.message)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData(data => ({ ...data, [name]: value }))
  }

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign up" && (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password (min 8 chars)" required />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : currState === "Sign up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>New here? <span onClick={() => { setCurrState("Sign up"); setError("") }}>Create account</span></p>
          : <p>Already have an account? <span onClick={() => { setCurrState("Login"); setError("") }}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
