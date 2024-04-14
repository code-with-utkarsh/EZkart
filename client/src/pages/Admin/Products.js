import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../../styles/AdminAllProductsStyle.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Product"}>
      <div className="container-fluid m-3 p-3 dashboard allproduct-page">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products List</h1>

          {/* card  */}
          <div className="container">
            { products?.map((p) => 
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="card mb-3" >
                  <div className="row g-0">
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="img-fluid rounded-start"
                        alt={p.name}
                        style={{ height: '200px' }}
                      />
                    </div>

                    <div className="col-md-8 card-content">
                      <div className="card-body">
                        <div className="card-up">
                        <div className="card-name-price">
                          <h5 className="card-title">{p.name}</h5>
                          <h5 className="card-title card-price">
                            {p.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </h5>
                        </div>
                        <p><strong> Category :</strong> {p.category.name}</p>
                        <p className="card-text">{p.description}</p>
                        </div>
                        <div className="card-bottom">
                          <p><small >{p.shipping ? "" : "Not"} Available for Shipping. </small></p>
                          <p><small >{p.quantity} items left</small></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Products;