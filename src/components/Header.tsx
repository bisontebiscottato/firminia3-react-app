import React from "react";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { t } = useTranslation();

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
        justifyContent: "space-between",
        paddingLeft: "20px",
        paddingRight: "20px",
        zIndex: 1000,
        fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "0.8rem",
        fontWeight: "500",
        color: "#111111",
      }}
    >
      <div style={{ flex: 1 }} />
      <div style={{ textAlign: "center", flex: 1 }}>
        {t('header.title')}
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Header; 