import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  // console.log('Current i18n language:', i18n.language);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    console.log('Current language before change:', i18n.language);
    
    try {
      await i18n.changeLanguage(languageCode);
      console.log('Language changed successfully to:', i18n.language);
      
      // Salva esplicitamente nel localStorage
      localStorage.setItem('i18nextLng', languageCode);
      
      // Forza il re-render di tutti i componenti
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
          style={{
            fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '0.75rem',
            color: '#111111',
            border: '1px solid #ddd',
            backgroundColor: 'transparent',
          }}
        >
          <Globe size={14} />
          <span>{currentLanguage.flag} {currentLanguage.name}</span>
          <ChevronDown size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
              i18n.language === language.code ? 'bg-primary/10' : ''
            }`}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
