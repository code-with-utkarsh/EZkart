import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import "../../styles/GoToTopStyle.css";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenToScroll = () => {
    let heightToHidden = 20;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <div className="gototop-container">
      {isVisible && (
        <div className="gototop-btn" title="move to top" onClick={goToBtn}>
          <FaArrowUp className="go-to-top-icon" />
        </div>
      )}
    </div>
  );
};

export default GoToTop;
