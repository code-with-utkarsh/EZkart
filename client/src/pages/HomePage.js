import React, {useState, useEffect} from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import Layout from "./../components/Layout/Layout";
import useCategory from "../hooks/useCategory";
import ImageSlider from "../components/ImageSlider";
import ProductCard from "../components/ProductCard";
import PriceRangeSlider from "../components/RangeSlider";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";
import { CgMoveLeft, CgMoveRight } from "react-icons/cg";
import "../styles/Homepage.css" ;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(window.innerWidth <= 768 ? true : false);
  const [checked, setChecked] = useState([]);
  const [ichecked, setiChecked] = useState([]);  //for input checkbox store
  const [radio, setRadio] = useState([]);
  const [iradio, setiRadio] = useState([]);      //for input radio store
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all category
  const categories = useCategory();          //custom hook
  
  // filter by category
  const handleFilterByCategory = (value, id) => {
    let all = [...ichecked];
    if (value) {     /* if we select the checkbox */
        all.push(id);
      } else {        /* if we deselect the checkbox */
          all = all.filter((c) => c !== id);
      }
      setiChecked(all);
  };

  // getFilterTOtal Count
  const getTotal = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters-count",{
        checked,
        radio,
      });
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  //loadmore filtered product
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/product/product-filters/${page}`, {
        checked,
        radio,
      });
      setLoading(false);
      if(page===1) setProducts([...data?.products]);
      else setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
    setPage(1);
  };
    
  const handleReset = () => {
    setiRadio([]); 
    setiChecked([]); 
    if(checked.length || radio.length){
      setChecked([]);
      setRadio([]);
      setPage(1);
    }
  };

  useEffect(() => {
    if(page===1) getTotal();
    loadMore();
  }, [page, radio, checked]);

  return (
    <Layout title={"ALL Products - Best offers "}>
      <div className="H_dash">
        <ImageSlider />
      
        <div className="container-fluid row mt-3 home-page">   
          <div className={`filters ${showFilters ? "" : "filter-collapsed"}`}>              
            <button className="toggle-filters-button" onClick={() => setShowFilters((prevState) => !prevState)}>
              {showFilters ? <CgMoveLeft /> : <CgMoveRight />}
            </button>
            
            {/* category filter  */}
            <div className="accordion my-3">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                    Filter By Category
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                  <div className="accordion-body d-flex flex-column">
                    {categories?.map((c) => (
                      <Checkbox
                        key={c._id}
                        checked={ichecked.includes(c._id)}
                        onChange={(e) => handleFilterByCategory(e.target.checked, c._id)}
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
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                    Filter By Price
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                  <div className="accordion-body d-flex flex-column">
                    <Radio.Group value={iradio} onChange={(e) => setiRadio(e.target.value)}>
                      {Prices?.map((p) => (
                        <div key={p._id}>
                          <Radio value={p.array} className="filter-option-text">{p.name}</Radio>
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
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                    Filter By Range
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                  <div className="accordion-body d-flex flex-column">
                    <PriceRangeSlider range={iradio} setRange={setiRadio} />
                  </div>
                </div>
              </div>
            </div>
                        
            {/* Apply filter */}
            <div className="button d-flex flex-column">
              <button
                className="btn apply-button"
                onClick={() => handleApplyFilter()}
              >
                APPLY FILTERS
              </button>
            </div>
                        
            {/* Reset filter */}
            <div className="button d-flex flex-column">
              <button
                className="btn reset-button"
                onClick={() => handleReset()}
              >
                RESET FILTERS
              </button>
            </div>
            { !showFilters && (
              <div className="verticalApplyFilters">
                <div className="verticalApply">
                  <h5>A</h5> <h5>P</h5> <h5>P</h5> <h5>L</h5> <h5>Y</h5>
                </div>
                <div className="verticalFilters">
                  <h5>F</h5> <h5>I</h5> <h5>L</h5> <h5>T</h5> <h5>E</h5> <h5>R</h5> <h5>S</h5>
                </div>
              </div>
            )}
          </div>
  
          <div className={`right-side ${showFilters ? "" : "filter-collapsed"}`}>
            <h1 className="text-center">All Products</h1>
            <div className="allProduct">
              {products?.map((p) => (<ProductCard p={p} key={p._id} />))}
            </div>
            <div className="m-2 p-3">
              {products?.length === 0 && total === 0 && (
                <div className="text-center">No Product Found</div>
              )}
              {total>0 && <h5> Page {page} of {Math.ceil(total / 8)}</h5>}
              {products && products.length < total && (
                <>
                  <button
                    className="btn loadmore"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? ("Loading ...") : (<> {" "} Loadmore <AiOutlineReload /> </>)}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;