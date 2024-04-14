import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate , Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
import { Select } from "antd";
const { Option } = Select;

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => total = total + item.product.price * item.count);
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //total items
  const totalItems = () => {
    try {
      let count = 0;
      cart?.map((item) => count = count + item.count);
      return count;
    } catch (error) {
      console.log(error);
    }
  };

  //change quantity
  const handleChange = (pid, value) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item.product._id === pid);
      myCart[index].count = value;
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item.product._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
  
  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="body">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {/* card */} 
              {cart?.map((item) => (
                <div className="row card" key={item.product._id}>
                  
                  <div className="col-md-4 card-left">
                    <Link
                      key={item.product._id}
                      to={`/product/${item.product.slug}`}
                      className="product-link"
                    >
                      <img
                        src={`/api/v1/product/product-photo/${item.product._id}`}
                        className="img-fluid rounded-start"
                        alt={item.product.name}
                        style={{ height: '150px' }}
                      />
                    </Link>
                  </div>

                  <div className="col-md-4 card-mid">
                    <Link
                      key={item.product._id}
                      to={`/product/${item.product.slug}`}
                      className="product-link"
                    >
                      <p className="p-name">{item.product.name}</p>
                      <p className="p-category"><strong>Category :</strong> {item.product.category.name}</p>
                      <p className="card-text">{item.product.description.substring(0, 60)}...</p>
                    </Link>
                  </div>

                  <div className="col-md-4 card-right">
                    <p className="card-price">Price : ₹{item.product.price}</p>
                    <p>Quantity : {" "} 
                      <Select
                        className="select-quantity"
                        onChange={(value) => handleChange(item.product._id, value)}
                        defaultValue={item.count}
                      >
                        {[...Array(10)].map((_,i) => (
                          <Option key={i+1} value={i+1}>
                            {i+1}
                          </Option>
                        ))}
                      </Select>
                    </p>
                    <p>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCartItem(item.product._id)}
                      >
                        Remove
                      </button>
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Subotal ({totalItems()} items) : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                  <div className="m-4">
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                    </div>
                  </>
                  
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
