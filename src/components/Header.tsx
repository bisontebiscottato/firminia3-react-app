import React from "react";

const Header: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "50px",
        backgroundColor: "#eeeeee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "1rem",
        fontWeight: "500",
        color: "#111111",
      }}
    >
      FirminIA V3 configurator
    </div>
  );
};

export default Header; 