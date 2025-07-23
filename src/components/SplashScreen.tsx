import React from "react";
import { signit } from "../assets/assets";

interface SplashScreenProps {
  onLoadComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadComplete }) => {
  React.useEffect(() => {
    // Simulates app loading for 3 seconds
    const timer = setTimeout(() => {
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  // Wiggle animation keyframes
  const wiggleKeyframes = `
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(3deg); }
      75% { transform: rotate(-3deg); }
    }
  `;

  React.useEffect(() => {
    // Inject keyframes into the document head
    const style = document.createElement("style");
    style.textContent = wiggleKeyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center min-h-screen px-6">
      {/* Logo FirminIA V3 */}
      <div className="mb-12 flex flex-col items-center">
        <img
          src={signit}
          alt="SIGN IT! Logo"
          className="w-64 h-64 mb-4"
          style={{
            objectFit: "contain",
            animation: "wiggle 2s ease-in-out infinite",
            transformOrigin: "center center",
          }}
        />
        <h1
          className="text-center select-none"
          style={{
            fontSize: "2.5rem",
            fontWeight: "600",
            color: "#111111",
            fontFamily:
              "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
          }}
        >
          FirminIA V3
        </h1>
      </div>

      {/* Animated circular loader */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* Background circle */}
          <div
            className="w-12 h-12 rounded-full border-4 border-gray-200"
            style={{ borderColor: "rgba(17, 17, 17, 0.1)" }}
          />

          {/* Animated circle */}
          <div
            className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent animate-spin"
            style={{
              borderTopColor: "#007556",
              borderRightColor: "#007556",
              animationDuration: "1s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          />
        </div>

        {/* Optional loading text */}
        <p
          className="text-center select-none"
          style={{
            fontSize: "0.875rem",
            fontWeight: "400",
            color: "#666666",
            fontFamily:
              "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Loading...
        </p>
      </div>

      {/* Version at bottom */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <p
          className="text-center select-none"
          style={{
            fontSize: "0.75rem",
            fontWeight: "400",
            color: "#999999",
            fontFamily:
              "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
