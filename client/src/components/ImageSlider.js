import React from "react";

const ImageSlider = () => {
  return (
    <>
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[...Array(5)].map((_,i) => (
            <div className={`carousel-item ${i === 0 ? 'active' : ''}`} data-bs-interval="3000" key={i}>
              <img src={`/images/b_${i+1}.jpg`} height="300" className="d-block w-100"
              style={{objectFit: "cover"}} alt={`slider_img_${i}`} />
            </div>
          ))}    
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};

export default ImageSlider;