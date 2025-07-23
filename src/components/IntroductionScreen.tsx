import React from "react";
import { Button } from "./ui/button";
import { Bluetooth, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
import { logo } from "../assets/assets";

interface IntroductionScreenProps {
  onContinue: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({
  onContinue,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-8">
      <div className="max-w-md mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <img
            src={logo}
            alt="FirminIA V3 Logo"
            className="w-16 h-16 mx-auto mb-4"
            style={{
              objectFit: "contain",
            }}
          />
          <h1
            className="mb-2"
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              color: "#111111",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: "1.2",
            }}
          >
            Welcome Signer!
          </h1>
          <p
            className="text-center"
            style={{
              fontSize: "1rem",
              fontWeight: "400",
              color: "#666666",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: "1.5",
            }}
          >
            Configure your Firminia V3 device easily via Bluetooth
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h3
            className="mb-4"
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: "#111111",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Before you start:
          </h3>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle
                size={20}
                className="text-primary shrink-0 mt-0.5"
              />
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  color: "#111111",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                Make sure your FirminIA V3 device is powered off
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={20}
                className="text-primary shrink-0 mt-0.5"
              />
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  color: "#111111",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                Enable Bluetooth on your phone
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={20}
                className="text-primary shrink-0 mt-0.5"
              />
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  color: "#111111",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                Keep both devices close together during setup
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={20}
                className="text-primary shrink-0 mt-0.5"
              />
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  color: "#111111",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                Have your WiFi network name and password ready
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className="w-full h-12 flex items-center justify-center gap-3"
          style={{
            minHeight: "48px",
            backgroundColor: "#007556",
            color: "#ffffff",
            fontFamily:
              "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: "500",
          }}
        >
          Get Started
          <ArrowRight size={20} />
        </Button>

        {/* Version info */}
        <div className="mt-8">
          <p
            className="text-center"
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
    </div>
  );
};

export default IntroductionScreen;
