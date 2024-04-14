import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Link } from "react-router-dom";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  //total price
  const totalPrice = (products) => {
    try {
      let total = 0;
      products?.map((item) => total = total + item?.product?.price * item?.count );
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
  
  //get all orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  //change order status
  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Layout title={"All Orders Data"}>
      <div className="container-fluid m-3 p-3 dashboard">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders?.map((o, i) => {
            return (
              <div className="border mb-3 shadow table-responsive" key={o._id}>
                <table className="table">
                  <thead>
                    <tr  className="table-dark">
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Items</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr  className="table-secondary">
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length} ({totalItems(o?.products)})</td>
                      <td>{totalPrice(o?.products)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="container">
                  {o?.products?.map((item) => (
                    <Link key={item.product._id} to={`/product/${item.product.slug}`} className="product-link">
                      <div className="row mb-2 p-3 card flex-row">
                        <div className="col-md-4">
                          { item?.product &&
                          <img
                            src={`/api/v1/product/product-photo/${item?.product?._id}`}
                            className="card-img-top"
                            alt={item.product.name}
                            width="100px"
                            height={"160px"}
                          />}
                        </div>
                        <div className="col-md-8">
                          <p>{item?.product?.name}</p>
                          <p>{item?.product?.description.substring(0, 30)}...</p>
                          <p>Price : ₹{item?.product?.price}</p>
                          <p>Quantity : {item?.count}</p>
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

export default AdminOrders;
