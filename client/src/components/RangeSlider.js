import React, { useState, useEffect, useRef } from "react";
import "../styles/RangeSliderStyle.css";

const PriceRangeSlider = ({ range, setRange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [userClicked, setUserClicked] = useState(false);
  const rangeRef = useRef(null);
  const priceGap = 1000;

  // Reset the slider when the range becomes empty
  useEffect(() => {
    if (range.length === 0) {
      setMinPrice(0);
      setMaxPrice(10000);
      setUserClicked(false);
    }
  }, [range]);

  useEffect(() => {
    updateRange();
    if (userClicked) setRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleMinInputChange = (event) => {
    let min = parseInt(event.target.value, 10);
    if (min > maxPrice - priceGap) {
      min = maxPrice - priceGap;
    } else if (min < 0) {
      min = 0;
    }
    setMinPrice(min);
    setUserClicked(true);
  };

  const handleMaxInputChange = (event) => {
    let max = parseInt(event.target.value, 10);
    if (max < minPrice + priceGap) {
      max = minPrice + priceGap;
    } else if (max > 10000) {
      max = 10000;
    }
    setMaxPrice(max);
    setUserClicked(true);
  };

  const updateRange = () => {
    const rangeInput = document.querySelectorAll(".range-input input");
    const range = document.querySelector(".slider .progress");

    rangeInput[0].value = parseInt(rangeInput[0].value, 10);
    rangeInput[1].value = parseInt(rangeInput[1].value, 10);

    const leftPercentage = (minPrice / rangeInput[0].max) * 100;
    const rightPercentage = 100 - (maxPrice / rangeInput[1].max) * 100;

    range.style.left = `${leftPercentage}%`;
    range.style.right = `${rightPercentage}%`;
  };

  const handlePointerClick = (event) => {
    if (!userClicked) setUserClicked(true);
    
    const rect = rangeRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const totalWidth = rect.right - rect.left;
    const minDistance = Math.abs(clickX - (minPrice / 10000) * totalWidth);
    const maxDistance = Math.abs(clickX - (maxPrice / 10000) * totalWidth);

    let val = Math.floor((clickX / totalWidth) * 10000);

    if (minDistance < maxDistance) {
      if (val > maxPrice - priceGap) {
        val = maxPrice - priceGap;
      } else if (val < 0) {
        val = 0;
      }
      setMinPrice(val);
    } else {
      if (val < minPrice + priceGap) {
        val = minPrice + priceGap;
      } else if (val > 10000) {
        val = 10000;
      }
      setMaxPrice(val);
    }
  };

  return (
    <div className="range-slider">
      <div className="wrapper">
        <div className="price-input">
          <div className="field">
            <span className="filter-option-text">Min</span>
            <div className="input-group-prepend">
              <span className="input-group-text">₹</span>
            </div>
            <input
              type="number"
              className="input-min"
              value={minPrice}
              // onChange={handleMinInputChange}
              disabled={true}
            />
          </div>
          <div className="field">
            <span className="filter-option-text">Max</span>
            <div className="input-group-prepend">
              <span className="input-group-text">₹</span>
            </div>
            <input
              type="number"
              className="input-max"
              value={maxPrice}
              // onChange={handleMaxInputChange}
              disabled={true}
            />
          </div>
        </div>

        <div className="slider-bottom">
          <div className="slider" onClick={handlePointerClick} ref={rangeRef}>
            <div className="progress"></div>
          </div>

          <div className="range-input">
            <input
              type="range"
              className="range-min"
              min="0"
              max="10000"
              value={minPrice}
              step="100"
              onChange={handleMinInputChange}
            />
            <input
              type="range"
              className="range-max"
              min="0"
              max="10000"
              value={maxPrice}
              step="100"
              onChange={handleMaxInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
