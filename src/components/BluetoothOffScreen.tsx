import React from 'react';
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
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
            Bluetooth off
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
            Turn on Bluetooth on your smartphone to continue
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
            Open Settings
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
              Check now
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
    </div>
  );
};

export default BluetoothOffScreen;