import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import axios from "axios";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/TestStyle.css";
import useCategory from "../hooks/useCategory";
import ImageSlider from "../components/ImageSlider";
import ProductCard from "../components/ProductCard";
import PriceRangeSlider from "../components/RangeSlider";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [ichecked, setiChecked] = useState([]);  //for input checkbox store
  const [radio, setRadio] = useState([]);
  const [iradio, setiRadio] = useState([]);      //for input radio store
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  //get all category
  const categories = useCategory(); //custom hook
  const loadMoreRef = useRef(null); // Ref to the "Load More" button

  // filter by category
  const handleFilterByCategory = (value, id) => {
    let all = [...ichecked];
    if (value) {
      /* if we select the checkbox */
      all.push(id);
    } else {
      /* if we deselect the checkbox */
      all = all.filter((c) => c !== id);
    }
    setiChecked(all);
  };

  //loadmore product
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/v1/product/product-filters/${page}`,
        {
          checked,
          radio,
        }
      );
      setLoading(false);
      // if (page === 1) {
      //   setProducts([...data?.products]);
      // } else {
        setProducts((prevProducts) => [...prevProducts, ...data?.products]);
      // }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/product/product-filters-count",
        { checked, radio }
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const areArraysEqual = (array1, array2) => {
    if (array1.length !== array2.length) return false;
    array1.sort();
    array2.sort();
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  };
    
  const handleApplyFilter = () => {
    if(areArraysEqual(checked, ichecked) && radio.length===iradio.length) {
      if(radio.length===0) return;
      else if(radio[0]===iradio[0] && radio[1]===iradio[1]) return;
    }
    setChecked([...ichecked]);
    setRadio([...iradio]);
    setPage(0);
  };
  
  const handleReset = () => {
    setiRadio([]); 
    setiChecked([]); 
    if(checked.length || radio.length){
      setChecked([]);
      setRadio([]);
      setPage(0);
    }
  };

  const handleIntersection = (entries) => {
    if (entries[0].isIntersecting && !loading && products.length < total) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px", // margin around the root. Values are similar to css property. Unitless values not allowed
      threshold: 1, // between 0 and 1.0
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [total]);

  useEffect(() => {
    if (page === 0) getTotal();
    else loadMore();
  }, [page, checked, radio]);

  // useEffect(() => {
  //   if (products.length === 0) return window.scrollTo({ top: 0, behavior: 'smooth' });
  // }, [products]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
  }, [checked, radio]);

  return (
    <Layout title={"ALL Products - Best offers "}>
      <div className="H_dash">
        <ImageSlider />

        <div className="container-fluid row mt-3 home-page">
          <div className="col-md-3 filters">
            {/* category filter  */}
            <div className="accordion my-3">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseOne"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseOne"
                  >
                    Filter By Category
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseOne"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body d-flex flex-column">
                    {categories?.map((c) => (
                      <Checkbox
                        key={c._id}
                        checked={ichecked.includes(c._id)}
                        onChange={(e) =>
                          handleFilterByCategory(e.target.checked, c._id)
                        }
                        className="filter-option-text"
                      >
                        {c.name}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* price filter */}
            <div className="accordion mb-3">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseTwo"
                  >
                    Filter By Price
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseTwo"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body d-flex flex-column">
                    <Radio.Group
                      value={iradio}
                      onChange={(e) => setiRadio(e.target.value)}
                    >
                      {Prices?.map((p) => (
                        <div key={p._id}>
                          <Radio value={p.array} className="filter-option-text">
                            {p.name}
                          </Radio>
                        </div>
                      ))}
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>

            {/* Range filter */}
            <div className="accordion mb-3">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseThree"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseThree"
                  >
                    Filter By Range
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseThree"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body d-flex flex-column">
                    <PriceRangeSlider range={iradio} setRange={setiRadio} />
                  </div>
                </div>
              </div>
            </div>

            {/* Apply filter */}
            <div className="d-flex flex-column">
              <button
                className="btn apply-button"
                onClick={() => handleApplyFilter()}
              >
                APPLY FILTERS
              </button>
            </div>

            {/* Reset filter */}
            <div className="d-flex flex-column">
              <button
                className="btn reset-button"
                onClick={() => handleReset()}
              >
                RESET FILTERS
              </button>
            </div>
         
            <h5>Showing {products.length} of {total} </h5>
            <h5> Page {page} of {Math.ceil(total / 8)}</h5>
          </div>

          <div className="col-md-9 my-2">
            <h1 className="text-center">All Products</h1>
            <div className="allProduct">
              {products?.map((p) => (
                <ProductCard p={p} key={p._id} />
              ))}
            </div>
              
            {products && products.length < total && (
              <h3 className="text-center m-5" ref={loadMoreRef}> 
                Loading...
              </h3>
            )} 
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

// ******************** Working Code Without Filter ********************************

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Layout from "./../components/Layout/Layout";
// import { AiOutlineReload } from "react-icons/ai";
// import "../styles/Homepage.css";
// import ImageSlider from "../components/ImageSlider";
// import ProductCard from "../components/ProductCard";

// const HomePage = () => {
//   const [products, setProducts] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const checked = [];
//   const radio = [];

//   const loadMoreRef = useRef(null); // Ref to the "Load More" button

//   const loadMore = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(`/api/v1/product/product-filters/${page}`, {
//         checked,
//         radio,
//       });
//       setLoading(false);
//       if (page === 1) {
//         setProducts([...data?.products]);
//       } else {
//         setProducts((prevProducts) => [...prevProducts, ...data?.products]);
//       }
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   const handleIntersection = (entries) => {
//     if (entries[0].isIntersecting && !loading && products.length < total) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleIntersection, {
//       root: null,
//       rootMargin: "0px",         // margin around the root. Values are similar to css property. Unitless values not allowed
//       threshold: 1,                   // between 0 and 1.0
//     });

//     if (loadMoreRef.current) {
//       observer.observe(loadMoreRef.current);
//     }

//     return () => {
//       if (loadMoreRef.current) {
//         observer.unobserve(loadMoreRef.current);
//       }
//     };
//   }, [ total]);

//   useEffect(() => {
//     const getTotal = async () => {
//       try {
//         const { data } = await axios.post("/api/v1/product/product-filters-count",{  checked,  radio,});
//         setTotal(data?.total);

//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (page === 0) {
//       getTotal();
//     } else {
//       loadMore();
//     }
//   }, [page]);

//   return (
//     <Layout title={"ALL Products - Best offers "}>
//       <div className="H_dash">
//         <ImageSlider />

//         <div className="container-fluid row mt-3 home-page">
//           <div className="col-md-3 filters">
//             <h2>ALL Filters here</h2>
//             <h5>Showing {products.length} of {total}</h5>
//             <h5>page {page}</h5>
//           </div>

//           <div className="col-md-9">
//             <h1 className="text-center">All Products</h1>
//             <div className="allProduct">
//               {products?.map((p) => (
//                 <ProductCard p={p} key={p._id} />
//               ))}
//             </div>

//             <div className="m-2 p-3">
//               {products && products.length < total && (
//                   <button
//                     className="btn loadmore"
//                     ref={loadMoreRef} // Ref to the "Load More" button
//                   >
//                     {loading ? "Loading ..." : "Loadmore"} <AiOutlineReload />
//                   </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;
