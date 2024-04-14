import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  return (
    <Layout>
      <div className=" mt-3 category-page">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="d-flex flex-wrap justify-content-evenly">
          {products?.map((p) => (<ProductCard p={p} />))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
