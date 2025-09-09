import React from 'react';
import { useTranslation } from 'react-i18next';
import { BluetoothOff, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface BluetoothOffScreenProps {
  onOpenSettings?: () => void;
  onBack?: () => void;
}

const BluetoothOffScreen: React.FC<BluetoothOffScreenProps> = ({ 
  onOpenSettings, 
  onBack 
}) => {
  const { t } = useTranslation();
  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      // Fallback to open device settings
      // In a real app, this would use native APIs
      alert('Opening Bluetooth settings...');
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center px-6 py-12 overflow-hidden" style={{ paddingTop: "50px" }}>
      <div className="max-w-sm w-full text-center space-y-8">
        
        {/* Bluetooth off icon */}
        <div className="flex justify-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 117, 86, 0.1)' }}
          >
            <BluetoothOff 
              size={48} 
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-4">
          <h1 
            className="text-center"
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111111',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
              lineHeight: '1.4'
            }}
          >
            {t('bluetooth.bluetoothOff.title')}
          </h1>
          
          <p 
            className="text-center leading-relaxed"
            style={{
              fontSize: '1rem',
              fontWeight: '400',
              color: '#666666',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
              lineHeight: '1.6'
            }}
          >
            {t('bluetooth.bluetoothOff.subtitle')}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 w-full">
          <Button
            onClick={handleOpenSettings}
            className="w-full h-12 text-base font-medium rounded-lg"
            style={{
              backgroundColor: '#007556',
              color: '#ffffff',
              minHeight: '48px',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            <Settings size={20} className="mr-2" />
            {t('bluetooth.bluetoothOff.openSettings')}
          </Button>
          
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-lg"
              style={{
                borderColor: 'rgba(17, 17, 17, 0.2)',
                color: '#111111',
                minHeight: '48px',
                fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {t('bluetooth.bluetoothOff.tryAgain')}
            </Button>
          )}
        </div>

        {/* Additional tip */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'rgba(0, 117, 86, 0.05)' }}
        >
          <p 
            className="text-center"
            style={{
              fontSize: '0.875rem',
              fontWeight: '400',
              color: '#111111',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
              lineHeight: '1.5'
            }}
          >
            💡 Make sure Bluetooth is enabled in your device settings
          </p>
        </div>
      </div>
      
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
          Version 1.2.0 - Andrea Mancini | <a href="mailto:biso@biso.it">biso@biso.it</a>
        </p>
      </div>
    </div>
  );
};

export default BluetoothOffScreen;