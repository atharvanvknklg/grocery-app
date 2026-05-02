import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://grocery-backend-bys0.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);

  // Save token to state + localStorage
  const saveToken = (accessToken, refreshToken, userData) => {
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (userData) { setUser(userData); localStorage.setItem("user", JSON.stringify(userData)); }
  };

  // Refresh access token automatically
  const refreshAccessToken = useCallback(async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) return null;
    try {
      const res = await axios.post(url + "/api/user/refresh", { refreshToken: storedRefresh });
      if (res.data.success) {
        saveToken(res.data.token, res.data.refreshToken, null);
        return res.data.token;
      }
    } catch { }
    return null;
  }, []);

  // Axios interceptor - auto refresh on 401/expired
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        // If token expired, try refresh
        if (response.data?.expired) {
          return refreshAccessToken().then((newToken) => {
            if (newToken) {
              response.config.headers["token"] = newToken;
              return axios(response.config);
            }
            logout();
            return response;
          });
        }
        return response;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshAccessToken]);

  const logout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) axios.post(url + "/api/user/logout", { refreshToken });
    setToken("");
    setUser(null);
    setCartItems({});
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken) {
        setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const ContextValue = {
    food_list, cartItems, setCartItems,
    addToCart, removeFromCart, getTotalCartAmount,
    url, token, setToken, saveToken, logout, user, setUser,
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
