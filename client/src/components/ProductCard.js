import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-hot-toast";
import "../styles/ProductCardStyle.css";
import { Select } from "antd";
const { Option } = Select;

const ProductCard = ({ p }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState(1);

  //add product to cart
  const handleAddCart = () => {
    const existingItem = cart.find((item) => item.product._id === p._id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>{
        if(item.product._id === p._id) {
          if(item.count + quantity <= 10) {
            toast.success(`${p.name} added to cart`);
            return {...item, count: item.count + quantity}
          }
          else {
            toast.error("Maximum 10 items can be added to cart");
            return {...item, count: 10}
          }
         } else {
          return item ;
         }
      });
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newItem = { product: p, count: quantity };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${p.name} added to cart`);
    }
    setQuantity(1);
  };

  return (
    <div className="card card-component my-2" key={p?._id}>
      <Link key={p?._id} to={`/product/${p?.slug}`} className="product-link">
        <img
          src={`/api/v1/product/product-photo/${p?._id}`}
          className="card-img-top"
          alt={p?.name}
        />
      </Link>
      <div className="card-body">
        <div className="card-name-price">
          <h5 className="card-title">{p?.name}</h5>
          <h5 className="card-title card-price">₹{p?.price}</h5>
        </div>
        <p className="card-text ">{p?.description.substring(0, 60)}...</p>
        <div className="card-bottom">
          <Select
            className="select-quantity"
            onChange={(value) => setQuantity(value)}
            defaultValue={1}
          >
            {[...Array(10)].map((_,i) => (
              <Option key={i+1} value={i+1}>
                {i+1}
              </Option>
            ))}
          </Select>
          <button className="btn add-to-cart-btn ms-1" onClick={handleAddCart}>
            ADD TO CART
          </button>
          <button
            className="btn more-details-btn ms-1"
            onClick={() => navigate(`/product/${p?.slug}`)}
            // disabled={2 > 1}
          >
            {/* BUY NOW */}
            MORE DETAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
