import React from "react";
import "./LazyLoad.css";

const LazyLoad = () => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/30 flex items-center justify-center">
      <div className="loader">
        <div className="react-star">
          <div className="nucleus"></div>
          <div className="electron electron1"></div>
          <div className="electron electron2"></div>
          <div className="electron electron3"></div>
        </div>
      </div>
    </div>
  );
};

export default LazyLoad;
