import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import "../styles/Star.css";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import { Select } from "antd";
import ReviewForm from "../components/Form/ReviewForm";
import moment from "moment";
const { Option } = Select;

const ProductDetails = () => {
  const [auth] = useAuth();                                    //custom hook
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);                 //for quantity of product to add in cart
  const [review, setReview] = useState({rating:0,body:""});    //for review form create first time or update review
  const [userReview, setUserReview] = useState({});            //for store user review (if exists)
  const [showReviewForm, setShowReviewForm] = useState(false); //for review form visibility
  
  // Check if the user has reviewed the product
  const checkUserReview = (product) => {
    const userReviewExists = product?.reviews?.find(r => r?.author?._id === auth?.user?._id);
    setUserReview(userReviewExists || {});
    setShowReviewForm(!userReviewExists);
    if (userReviewExists) {
      setReview({ rating: userReviewExists.rating, body: userReviewExists.body });
    } else {
      setReview({ rating: 0, body: "" });
    }
  };

  //handle create review
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/v1/product/product-review/${product._id}`, review);
      if(data?.success) {
        toast.success("Review added successfully");
        setShowReviewForm(false);
        setUserReview(data?.review);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in posting review");
    }
  };

  //handle update review
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if(!userReview) return;
      const { data } = await axios.put(`/api/v1/product/update-review/${userReview._id}`, review);
      if(data?.success) {
        toast.success("Review updated successfully");
        setUserReview(data?.review);
        setShowReviewForm(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in updating review");
    }
  };

  //handle delete review
  const handleDelete = async (rid) => {
    try {
      const { data } = await axios.delete(`/api/v1/product/delete-review/${product._id}/${rid}`);
      if(data?.success) {
        toast.success("Review deleted successfully");
        setUserReview({});
        setShowReviewForm(true);
        setReview({ rating: 0, body: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in deleting review");
    }
  };

  //inital product details
  useEffect(() => {
    if (params?.slug) getProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [params?.slug]); 
  
  useEffect(() => {
    if(product){
      setQuantity(1);
      checkUserReview(product);
      getSimilarProduct(product?._id, product?.category?._id); 
    }
  }, [product]);

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      if(!pid || !cid) return ;
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  //add product to cart
  const handleAddCart = () => {
    const existingItem = cart.find(item => item.product._id === product._id);
  
    if (existingItem) {
      const updatedCart = cart.map((item) =>{
        if(item.product._id === product._id) {
          if(item.count + quantity <= 10) {
            toast.success(`${product.name} added to cart`);
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
      const newItem = { product : product, count: quantity };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} added to cart`);
    }
    setQuantity(1);
  };

  return (
    <Layout>
      
      <div className="product-details">
        <div className="row container">
          <div className="col-md-6">
            {product?._id && <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product?.name}
              height="400"
              width={"300px"} 
              />}
          </div>
          <div className="col-md-6 product-details-info">
            <h1 className="text-center">Product Details</h1>
            <hr />
            <h6>Name : {product?.name}</h6>
            <h6>Description : {product?.description}</h6>
            <h6>
              Price :
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </h6>
            <h6>Category : {product?.category?.name}</h6>
            <h6>Shipping : {product?.shipping ? "Yes" : "No"}</h6>
            <div className="product-detail-bottom">
              <Select
                className="select-quantity"
                onChange={(value) => setQuantity(value)}
                value={quantity}
              >
                {[...Array(10)].map((_,i) => (
                  <Option key={i+1} value={i+1}>
                    {i+1}
                  </Option>
                ))}
              </Select>
              {auth?.user?.role === 1 && (
              <button className="btn btn-primary ms-1" onClick= {() => navigate(`/dashboard/admin/product/${product?.slug}`)}>
                Edit Product
              </button>
              )}
              <button className="btn btn-dark ms-1" onClick={handleAddCart}>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr/>
      
      {/* similar products */}
      <h3 className="text-center">Similar Products ➡️</h3>
      {relatedProducts?.length < 1 && (
        <p className="text-center">No Similar Products found</p>
      )}
      <div className="container-fluid similar-products">
        {relatedProducts?.map((p) => (<ProductCard p={p} />))}
      </div>

      <hr className="mb-0"/>

      {/* product reviews */}
      <div className="container-fluid row  product-review"> 
        {auth?.user && (
          <div className="col-md-4 my-3 user-review ">
            {showReviewForm ? (
              <div className="conatainer">
                <h4>Leave a Review</h4>
                <ReviewForm
                  handleCreate={handleCreate}
                  handleUpdate={handleUpdate}
                  const isUpdate = {Object.entries(userReview).length > 0}
                  value={review}
                  setValue={setReview}
                />
              </div>
            ) : (
              <div className="conatainer">
                <h4>Your Review</h4>
                <div className="card my-2 mx-1">
                  <h5 className="card-header">{auth?.user?.name}</h5>
                  <div className="card-body">
                    <p className="starability-result" data-rating={userReview?.rating}>
                      Rated: {userReview?.rating} stars
                    </p>
                    <p className="card-text mt-3">{userReview?.body}</p>
                    <div className="button-container">
                      <button className="btn btn-primary b1" onClick={() => {setShowReviewForm(true)}}>Edit</button>
                      <button className="btn btn-danger b2" onClick={() => handleDelete(userReview?._id)}>Delete</button>
                    </div>
                  </div>
                  <div className="card-footer text-muted">
                   {moment(userReview?.updatedAt).fromNow()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={auth?.user ? "col-md-8 border-left" : "col-md-12"}>
          <h3 className="text-center mt-3">Product Reviews</h3>
          {(!product?.reviews?.length || (product?.reviews?.length === 1 && Object.keys(userReview).length !== 0)) && (
            <p className="text-center">No other users Review found</p>
          )}

          <div className="my-3 other-review">
            {product?.reviews?.map(r => (r?.author?._id !== auth?.user?._id && (
              <div className="my-3 card" key={r._id}>
                <h5 className="card-header">{r?.author?.name}</h5>
                <div className="card-body">
                  <p className="starability-result" data-rating={r?.rating}>
                    Rated: {r?.rating} stars
                  </p>
                  <p className="card-text mt-3">{r?.body}</p>
                </div>
                <div className="card-footer text-muted">
                  {moment(r?.updatedAt).fromNow()}
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;