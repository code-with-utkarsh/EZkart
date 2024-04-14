import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import "./../../styles/orderPageStyle.css";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  //total price
  const totalPrice = (products) => {
    try {
      let total = 0;
      products?.map((item) => total = total + item.product.price * item.count );
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //total items
  const totalItems = (products) => {
    try {
      let count = 0;
      products?.map((item) => count = count + item.count);
      return count;
    } catch (error) {
      console.log(error);
    }
  };

  //get orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  //cancel order
  const handleCancel = async (orderId) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/cancel-order/${orderId}`);
      if(data?.status === "cancel") {
        toast.success("Order cancelled successfully");
        getOrders();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3 fixed-left">
            <UserMenu />
          </div>
          <div className="col-md-9 scroll-right">
            <h1 className="text-center">Your Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div className="border mb-3 shadow table-responsive" key={o._id}>
                  <table className="table">
                    <tbody>
                      <tr  className="table-dark">
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Items</th>
                        <th scope="col">Amount</th>
                        {o?.status !== "delivered" && o?.status !== "cancel" &&
                          <th scope="col" className="table-info text-center align-middle" rowSpan="2">
                            <button
                              className="btn btn-danger ms-2 order-cancel-btn"
                              onClick={() => {handleCancel(o._id);}}
                            >
                              Cancel Order
                            </button>
                          </th>
                        }
                      </tr>

                      <tr  className="table-secondary">
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length} ({totalItems(o?.products)})</td>
                        <td>{totalPrice(o?.products)}</td> 
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="container">
                    {o?.products?.map((item, i) => (
                      <Link key={item.product._id} to={`/product/${item.product.slug}`} className="product-link">
                        <div className="row mb-2 p-3 card flex-row">
                          <div className="col-md-4">
                            <img
                              src={`/api/v1/product/product-photo/${item.product._id}`}
                              className="card-img-top"
                              alt={item.product.name}
                              width="100px"
                              height={"160px"}
                            />
                          </div>
                          <div className="col-md-8">
                            <p>{item.product.name}</p>
                            <p>{item.product.description.substring(0, 30)}...</p>
                            <p>Price : ₹{item.product.price}</p>
                            <p>Quantity : {item.count}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;