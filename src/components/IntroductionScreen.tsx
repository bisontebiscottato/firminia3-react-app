import React from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import { Bluetooth, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
import { logo } from "../assets/assets";

interface IntroductionScreenProps {
  onContinue: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({
  onContinue,
}) => {
  const { t, i18n } = useTranslation();
  
  // console.log('IntroductionScreen - Current language:', i18n.language);

  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center px-6 py-8 overflow-hidden" style={{ paddingTop: "50px" }}>
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
            {t('introduction.title')}
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
            {t('introduction.subtitle')}
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
            {t('introduction.beforeStart')}
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
                {t('introduction.instructions.pairing')}
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
                {t('introduction.instructions.bluetooth')}
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
                {t('introduction.instructions.proximity')}
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
                {t('introduction.instructions.wifi')}
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
                {t('introduction.instructions.apiKey')}
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
          {t('introduction.getStarted')}
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
           {t('introduction.version')} | <a href="mailto:biso@biso.it">biso@biso.it</a> 
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionScreen;
