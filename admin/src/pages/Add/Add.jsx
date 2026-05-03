import React, { useState } from 'react'
import "./Add.css"
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({ url }) => {
  const [image, setImage] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [useUrl, setUseUrl] = useState(false)
  const [data, setData] = useState({
    name: "", description: "", price: "", category: "Fruits"
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)

    if (useUrl && imageUrl) {
      formData.append("imageUrl", imageUrl)
    } else if (image) {
      formData.append("image", image)
    } else {
      toast.error("Please provide an image")
      return
    }

    try {
      const response = await axios.post(`${url}/api/food/add`, formData)
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Fruits" })
        setImage(false)
        setImageUrl("")
        toast.success("Product added successfully!")
      } else {
        toast.error(response.data.message || "Failed to add product")
      }
    } catch (err) {
      toast.error("Server error. Please try again.")
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className='add-img-upload flex-col'>
          <p>Upload Image</p>
          <div className='image-toggle'>
            <button type='button' className={!useUrl ? 'active-tab' : ''} onClick={() => setUseUrl(false)}>Upload File</button>
            <button type='button' className={useUrl ? 'active-tab' : ''} onClick={() => setUseUrl(true)}>Use Image URL</button>
          </div>
          {!useUrl ? (
            <>
              <label htmlFor='image'>
                <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
              </label>
              <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
            </>
          ) : (
            <div className='url-input-wrap'>
              <input
                type='text'
                placeholder='Paste image URL here...'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className='url-input'
              />
              {imageUrl && <img src={imageUrl} alt='' className='url-preview' onError={(e) => e.target.style.display = 'none'} />}
            </div>
          )}
        </div>

        <div className='add-product-name flex-col'>
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Type here' required />
        </div>
        <div className='add-product-description flex-col'>
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name='description' rows="4" placeholder='Write description here' required></textarea>
        </div>
        <div className='add-category-price'>
          <div className='add-category flex-col'>
            <p>Product Category</p>
            <select onChange={onChangeHandler} name='category' value={data.category}>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Spices">Spices</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Frozen Food">Frozen Food</option>
              <option value="Beverages">Beverages</option>
              <option value="oils">Oils</option>
              <option value="condiments">Condiments</option>
            </select>
          </div>
          <div className='add-price flex-col'>
            <p>Product Price (₹)</p>
            <input onChange={onChangeHandler} value={data.price} type='number' name='price' placeholder='120' required />
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD PRODUCT</button>
      </form>
    </div>
  )
}

export default Add
