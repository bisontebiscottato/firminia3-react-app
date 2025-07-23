import { useState, useEffect } from 'react';

interface BluetoothDevice {
  id: string;
  name: string;
  status: 'searching' | 'found' | 'connected' | 'ready';
  signalStrength?: number;
}

interface BluetoothState {
  isEnabled: boolean;
  isAvailable: boolean;
  isChecking: boolean;
  isPairing: boolean;
  isConnected: boolean;
  connectedDevice: BluetoothDevice | null;
  availableDevices: BluetoothDevice[];
}

export const useBluetooth = () => {
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>({
    isEnabled: false,
    isAvailable: true,
    isChecking: true,
    isPairing: false,
    isConnected: false,
    connectedDevice: null,
    availableDevices: []
  });

  // Controlla lo stato iniziale del Bluetooth
  useEffect(() => {
    const checkBluetoothStatus = async () => {
      setBluetoothState(prev => ({ ...prev, isChecking: true }));
      
      // Simula una chiamata API per verificare lo stato del Bluetooth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Per il demo, impostiamo il Bluetooth come spento inizialmente
      setBluetoothState(prev => ({
        ...prev,
        isEnabled: false,
        isChecking: false
      }));
    };

    checkBluetoothStatus();
  }, []);

  const requestBluetoothEnable = async () => {
    try {
      console.log('Richiesta attivazione Bluetooth...');
      
      // Simula l'attivazione del Bluetooth
      setBluetoothState(prev => ({ 
        ...prev, 
        isEnabled: true 
      }));
      
      return true;
    } catch (error) {
      console.error('Errore nell\'attivazione del Bluetooth:', error);
      return false;
    }
  };

  const openBluetoothSettings = () => {
    if (typeof window !== 'undefined') {
      alert('Apertura impostazioni Bluetooth del dispositivo...');
    }
    
    // Simula l'apertura delle impostazioni e l'attivazione
    setTimeout(() => {
      requestBluetoothEnable();
    }, 1000);
  };

  const startPairing = () => {
    setBluetoothState(prev => ({
      ...prev,
      isPairing: true,
      availableDevices: []
    }));
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      // Simula la connessione al dispositivo
      setBluetoothState(prev => ({
        ...prev,
        isPairing: false,
        isConnected: true,
        connectedDevice: { ...device, status: 'connected' }
      }));
      
      console.log(`Connesso al dispositivo: ${device.name}`);
      return true;
    } catch (error) {
      console.error('Errore nella connessione:', error);
      return false;
    }
  };

  const disconnectDevice = () => {
    setBluetoothState(prev => ({
      ...prev,
      isConnected: false,
      connectedDevice: null
    }));
  };

  const refreshStatus = () => {
    setBluetoothState(prev => ({ 
      ...prev, 
      isChecking: true 
    }));
    
    // Riavvia il controllo dello stato
    setTimeout(() => {
      setBluetoothState(prev => ({ 
        ...prev, 
        isChecking: false,
        isEnabled: Math.random() > 0.3 // Maggiore probabilità di essere acceso
      }));
    }, 1000);
  };

  const resetPairing = () => {
    setBluetoothState(prev => ({
      ...prev,
      isPairing: false,
      isConnected: false,
      connectedDevice: null,
      availableDevices: []
    }));
  };

  return {
    ...bluetoothState,
    requestBluetoothEnable,
    openBluetoothSettings,
    startPairing,
    connectToDevice,
    disconnectDevice,
    refreshStatus,
    resetPairing
  };
};