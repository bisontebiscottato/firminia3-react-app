import React, { useState, useEffect } from 'react';
import { Bluetooth, RotateCcw, CheckCircle, Radio } from 'lucide-react';
import { Button } from './ui/button';

interface BluetoothDevice {
  id: string;
  name: string;
  status: 'searching' | 'found' | 'connected' | 'ready';
  signalStrength?: number;
}

interface BluetoothPairingScreenProps {
  onDeviceConnect?: (device: BluetoothDevice) => void;
  onBack?: () => void;
}

const BluetoothPairingScreen: React.FC<BluetoothPairingScreenProps> = ({ 
  onDeviceConnect, 
  onBack 
}) => {
  const [isSearching, setIsSearching] = useState(true);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [searchAttempts, setSearchAttempts] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);

  // Simulates device search
  useEffect(() => {
    if (isSearching) {
      const searchTimer = setTimeout(() => {
        // Simulates discovery of FirminIA V3 device
        const newDevice: BluetoothDevice = {
          id: 'firminia-v3-001',
          name: 'FirminIA V3',
          status: 'found',
          signalStrength: 85
        };
        
        setDevices([newDevice]);
        setIsSearching(false);
        
        // Simulates automatic connection after 1 second
        setTimeout(() => {
          setDevices([{ ...newDevice, status: 'ready' }]);
        }, 1000);
      }, 3000); // Simulates 3 seconds of search

      return () => clearTimeout(searchTimer);
    }
  }, [isSearching, searchAttempts]);

  const handleRetry = () => {
    setIsSearching(true);
    setDevices([]);
    setSelectedDevice(null);
    setSearchAttempts(prev => prev + 1);
  };

  const handleDeviceSelect = (device: BluetoothDevice) => {
    if (device.status === 'ready') {
      setSelectedDevice(selectedDevice?.id === device.id ? null : device);
    }
  };

  const handleConnect = () => {
    if (selectedDevice && onDeviceConnect) {
      onDeviceConnect(selectedDevice);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full text-center space-y-8">
        
        {/* Device illustration */}
        <div className="flex justify-center">
          <div className="relative">
            {/* FirminIA V3 device */}
            <div 
              className="w-32 h-20 rounded-xl border-2 flex items-center justify-center relative"
              style={{ 
                borderColor: '#007556',
                backgroundColor: 'rgba(0, 117, 86, 0.05)'
              }}
            >
              {/* Device body */}
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Bluetooth size={16} className="text-primary" />
                </div>
                <div 
                  className="text-xs font-medium"
                  style={{ 
                    color: '#007556',
                    fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  FirminIA V3
                </div>
              </div>
              
              {/* Button on device */}
              <div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center"
                style={{ 
                  animation: isSearching ? 'pulse 2s infinite' : 'none'
                }}
              >
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              
              {/* Search animation */}
              {isSearching && (
                <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-ping"></div>
              )}
            </div>
            
            {/* Animated radio waves */}
            {isSearching && (
              <div className="absolute -inset-8 flex items-center justify-center">
                <div className="w-16 h-16 border border-primary/20 rounded-full animate-ping"></div>
                <div className="absolute w-24 h-24 border border-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic content */}
        {isSearching ? (
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
              Searching device
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
               To activate pairing, start the device and press the button during Waking Up...
            </p>
            
            <div className="flex items-center justify-center gap-2 text-primary">
              <Radio size={16} className="animate-pulse" />
              <span 
                className="text-sm"
                style={{
                  fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                Searching...
              </span>
            </div>
          </div>
        ) : (
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
              Devices found
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
              Select your device to connect
            </p>
          </div>
        )}

        {/* Device list */}
        {devices.length > 0 && (
          <div className="w-full space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedDevice?.id === device.id
                    ? 'border-primary bg-primary/10 cursor-pointer'
                    : device.status === 'ready' 
                      ? 'border-primary bg-primary/5 cursor-pointer hover:bg-primary/10' 
                      : 'border-border bg-card cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bluetooth size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <div 
                        className="font-medium"
                        style={{
                          color: '#111111',
                          fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
                        }}
                      >
                        {device.name}
                      </div>
                      <div 
                        className="text-sm"
                        style={{
                          color: '#666666',
                          fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
                        }}
                      >
                        {device.status === 'found' ? 'Connecting...' : 'Ready to connect'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedDevice?.id === device.id && (
                      <CheckCircle size={20} className="text-success" />
                    )}
                    {device.status === 'ready' && selectedDevice?.id !== device.id && (
                      <div className="w-4 h-4 border-2 border-primary rounded-full"></div>
                    )}
                    {device.status === 'found' && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Select button */}
        {devices.some(device => device.status === 'ready') && (
          <Button
            onClick={handleConnect}
            disabled={!selectedDevice}
            className="w-full h-12 rounded-lg"
            style={{
              minHeight: '48px',
              backgroundColor: selectedDevice ? '#007556' : 'rgba(0, 117, 86, 0.3)',
              color: '#ffffff',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: selectedDevice ? 'pointer' : 'not-allowed'
            }}
          >
            Select
          </Button>
        )}

        {/* Action buttons */}
        <div className="space-y-3 w-full">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-lg"
            style={{
              borderColor: 'rgba(17, 17, 17, 0.2)',
              color: '#111111',
              minHeight: '48px',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            <RotateCcw size={18} className="mr-2" />
            Try again
          </Button>
          
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full h-12 text-base font-medium rounded-lg"
              style={{
                color: '#666666',
                minHeight: '48px',
                fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              Back
            </Button>
          )}
        </div>

        {/* Tip */}
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
            💡 Keep the device close to your phone during pairing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BluetoothPairingScreen;