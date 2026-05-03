import React, { useContext } from 'react'
import "./FoodDisplay.css"
import { StoreContext } from '../../context/storeContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, searchQuery = "" }) => {
  const { food_list } = useContext(StoreContext)

  const filtered = food_list.filter(item => {
    const matchCategory = category === "All" || category === item.category
    const matchSearch = searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className='food-display' id="food-display">
      <h2>
        {searchQuery ? `Results for "${searchQuery}"` : "Top Grocery Items"}
        <span className='food-count'> ({filtered.length} items)</span>
      </h2>
      {filtered.length === 0 ? (
        <div className='no-results'>
          <p>No items found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className='food-display-list'>
          {filtered.map((item, index) => (
            <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
