import React, { useState } from 'react';
import { Bluetooth, RotateCcw, CheckCircle, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { BluetoothDeviceInfo } from './hooks/useBluetooth';

interface BluetoothPairingScreenProps {
  onDeviceConnect?: (device: BluetoothDeviceInfo) => void;
  onBack?: () => void;
  isPairing: boolean;
  isChecking: boolean;
  availableDevices: BluetoothDeviceInfo[];
  startPairing: () => Promise<any>;
  connectToDevice: (device: BluetoothDeviceInfo) => Promise<any>;
}

const isBluetoothSupported = typeof navigator !== 'undefined' && !!navigator.bluetooth;

const BluetoothPairingScreen: React.FC<BluetoothPairingScreenProps> = ({ 
  onDeviceConnect, 
  onBack,
  isPairing,
  isChecking,
  availableDevices,
  startPairing,
  connectToDevice,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = async () => {
    console.log('Bottone premuto!');
    setError(null);
    setSelectedDevice(null);
    if (!isBluetoothSupported) {
      setError('Web Bluetooth API non supportata dal browser. Usa Chrome/Edge su desktop o Android.');
      return;
    }
    try {
      console.log('Chiamo startPairing...');
      await startPairing();
      console.log('startPairing chiamata!');
    } catch (err: any) {
      setError(err?.message || 'Errore scansione Bluetooth');
      console.error('Errore in startPairing:', err);
    }
  };

  const handleDeviceSelect = (device: BluetoothDeviceInfo) => {
    setSelectedDevice(selectedDevice?.id === device.id ? null : device);
  };

  const handleConnect = async () => {
    if (selectedDevice && onDeviceConnect) {
      try {
        await connectToDevice(selectedDevice);
        onDeviceConnect(selectedDevice);
      } catch (err: any) {
        setError(err?.message || 'Errore connessione Bluetooth');
      }
    }
  };

  // Mostra errore se la Web Bluetooth non è supportata
  if (!isBluetoothSupported) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-32 h-20 rounded-xl border-2 flex items-center justify-center relative" style={{ borderColor: '#007556', backgroundColor: 'rgba(0, 117, 86, 0.05)' }}>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Bluetooth size={16} className="text-primary" />
                </div>
                <div className="text-xs font-medium" style={{ color: '#007556', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>FirminIA V3</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ef4444', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.4' }}>Web Bluetooth non supportato</h1>
            <p className="text-center leading-relaxed" style={{ fontSize: '1rem', fontWeight: '400', color: '#ef4444', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.6' }}>Il tuo browser non supporta la Web Bluetooth API. Usa Google Chrome o Microsoft Edge su desktop o Android.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12" style={{ paddingTop: "70px" }}>
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Device illustration */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className="w-32 h-20 rounded-xl border-2 flex items-center justify-center relative animate-pulse"
              style={{ 
                borderColor: '#007556',
                backgroundColor: 'rgba(0, 117, 86, 0.05)'
              }}
            >
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
              {isPairing && (
                <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-ping"></div>
              )}
            </div>
            {isPairing && (
              <div className="absolute -inset-8 flex items-center justify-center">
                <div className="w-16 h-16 border border-primary/20 rounded-full animate-ping"></div>
                <div className="absolute w-24 h-24 border border-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Stato e messaggi */}
        {isPairing || isChecking ? (
          <div className="space-y-4">
            <h1 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111111', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.4' }}>Searching device</h1>
            <p className="text-center leading-relaxed" style={{ fontSize: '1rem', fontWeight: '400', color: '#666666', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.6' }}>To activate pairing, start the device and press the button during Waking Up...</p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Radio size={16} className="animate-pulse" />
              <span className="text-sm" style={{ fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>Searching...</span>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h1 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ef4444', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.4' }}>Bluetooth error</h1>
            <p className="text-center leading-relaxed" style={{ fontSize: '1rem', fontWeight: '400', color: '#ef4444', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.6' }}>{error}</p>
          </div>
        ) : availableDevices.length > 0 ? (
          <div className="space-y-4">
            <h1 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111111', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.4' }}>Devices found</h1>
            <p className="text-center leading-relaxed" style={{ fontSize: '1rem', fontWeight: '400', color: '#666666', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.6' }}>Select your device to connect</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111111', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.4' }}>No devices found</h1>
            <p className="text-center leading-relaxed" style={{ fontSize: '1rem', fontWeight: '400', color: '#666666', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: '1.6' }}>Premi il bottone qui sotto per cercare dispositivi Bluetooth.</p>
            <Button
              onClick={handleRetry}
              className="w-full h-12 mt-4"
              style={{
                minHeight: '48px',
                backgroundColor: '#007556',
                color: '#ffffff',
                fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isPairing || isChecking ? 'not-allowed' : 'pointer'
              }}
              disabled={isPairing || isChecking}
            >
              Search for devices
            </Button>
          </div>
        )}

        {/* Device list */}
        {availableDevices.length > 0 && (
          <div className="w-full space-y-3">
            {availableDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedDevice?.id === device.id
                    ? 'border-primary bg-primary/10 cursor-pointer'
                    : 'border-primary bg-primary/5 cursor-pointer hover:bg-primary/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bluetooth size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium" style={{ color: '#111111', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>{device.name}</div>
                      <div className="text-sm" style={{ color: '#666666', fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>Click this box, then press "Select"</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedDevice?.id === device.id && (
                      <CheckCircle size={20} className="text-success" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Select button */}
        {availableDevices.length > 0 && (
          <Button
            onClick={handleConnect}
            disabled={!selectedDevice || isPairing || isChecking}
            className="w-full h-12 rounded-lg"
            style={{
              minHeight: '48px',
              backgroundColor: selectedDevice ? '#007556' : 'rgba(0, 117, 86, 0.3)',
              color: '#ffffff',
              fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: selectedDevice && !isPairing && !isChecking ? 'pointer' : 'not-allowed'
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
            disabled={isPairing || isChecking}
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
            💡 Keep your Firminia close to your device during pairing!
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

export default BluetoothPairingScreen;