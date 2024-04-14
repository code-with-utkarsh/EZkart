import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import ProductCard from "../components/ProductCard"; 

const Search = () => {
  const [values] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="mt-4 search-page">
        <h3 className="text-center">Search Results</h3>
        <h6 className="text-center">
          {
            values?.results.length < 1
            ? "No Product Found"
            : `${values?.results.length} Product found for "${values?.keyword}"`
          }
        </h6>

        <div className="d-flex flex-wrap justify-content-evenly">
          {values?.results.map((p) => (<ProductCard p={p} />))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;