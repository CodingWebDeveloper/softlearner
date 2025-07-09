"use client";

import { HashLoader } from "react-spinners";

const LoadingFallback = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1a1b23",
      }}
    >
      <HashLoader color="#4ecdc4" size={50} />
    </div>
  );
};

export default LoadingFallback; 