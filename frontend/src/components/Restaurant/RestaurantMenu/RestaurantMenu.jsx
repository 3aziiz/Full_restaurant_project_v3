import React, { useCallback, useEffect, useState } from "react";
import { useGetMenuByRestaurantIdQuery } from "../../../slices/menuApiSlice";
import { Link, useParams } from "react-router-dom";
import "./RestaurantMenu.css";
import { Button, Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { addToCart } from "../../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const RestaurantMenu = () => {
  const { id } = useParams();
  const [menuData, setMenuData] = useState([]);
  const {
    data,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuByRestaurantIdQuery(id);
  const cart = useSelector((state) => state?.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setMenuData(
        data.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: item.image[0]?.url || "",
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        }))
      );
    }
  }, [data]);

  // Cart management functions
  const addToCartHandler = useCallback((item) => {
    dispatch(addToCart({ item, qty: 1, resId: id })), [dispatch];
  });

  useEffect(() => {
    if (cart.successMessage) {
      toast.success(cart.successMessage);
    } else if (cart.errorMessage) {
      toast.error(cart.errorMessage);
    }
  }, [cart.errorMessage, cart.successMessage]);

  return (
    <>
      <div className="flex items-center justify-center">
        {menuError &&
          toast.error(`Error: ${menuError?.data?.message || menuError.error}`)}
        {menuLoading && (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
          </div>
        )}
      </div>
      <Link to="/">
        <Button size="medium" variant="outlined" className="mx-auto">
          Go back
        </Button>
      </Link>
      <div className="menu-container">
        {menuData.map((item) => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-image" />
            <div className="menu-details">
              <div className="menu-header">
                <h3>{item.name}</h3>

                <p
                  className={`menu-category ${item.isVeg ? "veg" : "non-veg"}`}
                >
                  {item.isVeg ? (
                    <box-icon name="food-tag" color="#56c309"></box-icon>
                  ) : (
                    <box-icon name="food-tag" color="#d80909"></box-icon>
                  )}
                </p>
              </div>
              <p className="line-clamp-3">{item.description}</p>
              <p className="menu-price">Price: ${item.price}</p>
              <p
                className={`menu-availability ${
                  item.isAvailable ? "available" : "unavailable"
                }`}
              >
                {item.isAvailable ? "Available" : "Not Available"}
              </p>
            </div>
            <div className="menu-footer">
              <button
                onClick={() => addToCartHandler(item)}
                className={`add-to-cart-btn ${
                  !item.isAvailable
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={!item.isAvailable}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RestaurantMenu;


// so when manager create a restaurant from the form he have he enter all those informations so i want now to use those info in the front in my home page i want a cards of restau and whe click on one take the user to the template that take a fullscreen to make him see all informations about the restau so the manager can enter max 5 images for the restau and he can enter menu items and each item have max 3 images i send u the restau model to be more clear then in my mind i think the template it will be like this the headr i think about the adrees and alitttle of talk the images of restau that i think the image in a block and like unstagram can change to see other images or i dont know how and then the menu utems each item have images too and his price ... then we can add a feedback for the users so i will send u the model and u will create the cards component to just i will call it in the home page and restau template thats all and try to match the colors of my home page i will send u pic too //const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Simplified Menu Item schema that matches form data
// const MenuItemSchema = new Schema({
//   name: {
//     type: String,
//     required: [true, 'Menu item name is required'],
//     trim: true
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: [0, 'Price cannot be negative']
//   },
//   images: [{
//     type: String // URL to the image
//   }]
// });

// // Restaurant Schema
// const RestaurantSchema = new Schema({
//   name: {
//     type: String,
//     required: [true, 'Restaurant name is required'],
//     trim: true
//   },
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Restaurant owner is required']
//   },
//   // Define location as an object with address
//   location: {
//     address: {
//       type: String,
//       required: true
//     }
//   },
//   cuisine: {
//     type: String,
//     required: [true, 'Cuisine type is required'],
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   capacity: {
//     type: Number,
//     required: [true, 'Capacity is required'],
//     min: [1, 'Capacity must be at least 1']
//   },
//   openingHours: {
//     type: String,
//     required: [true, 'Opening hours are required'],
//     trim: true
//   },
//   contact: {
//     type: String,
//     required: [true, 'Contact information is required'],
//     trim: true
//   },
//   images: [{
//     type: String // URL to the image
//   }],
//   menuItems: [MenuItemSchema]
// }, { timestamps: true });

// // Index for text-based search
// RestaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

// module.exports = mongoose.model('Restaurant', RestaurantSchema);