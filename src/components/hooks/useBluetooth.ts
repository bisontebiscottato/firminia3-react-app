import { useState } from 'react';

const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000ff01-0000-1000-8000-00805f9b34fb';

// Tipi Web Bluetooth nativi o fallback per TypeScript
// (solo se non già dichiarati)
declare global {
  interface Navigator {
    bluetooth?: any;
  }
  // Fallback per ambienti non browser
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface BluetoothDevice {
    id?: string;
    name?: string;
    gatt?: any;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface BluetoothRemoteGATTCharacteristic {
    writeValue(data: BufferSource): Promise<void>;
  }
}

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  device: BluetoothDevice;
}

export const useBluetooth = () => {
  const [isEnabled] = useState<boolean>(true); // Assume true, Web Bluetooth non espone stato
  const [isAvailable] = useState<boolean>(typeof navigator !== 'undefined' && !!navigator.bluetooth);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  // Scansione dispositivi: mostra solo quelli con 'firminia' nel nome
  const startPairing = async () => {
    setIsPairing(true);
    setIsChecking(true);
    setAvailableDevices([]);
    try {
      if (!navigator.bluetooth) throw new Error('Web Bluetooth not supported');
      const device: BluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID],
      });
      // Filtra per nome
      const name = (device.name || '').toLowerCase();
      if (name.includes('firminia')) {
        setAvailableDevices([{ id: device.id || 'unknown', name: device.name || 'Unknown', device }]);
      } else {
        setAvailableDevices([]);
        throw new Error('No "Firminia V3" device found.'); 
      }
      setIsChecking(false);
      setIsPairing(false);
      return device;
    } catch (error) {
      setIsChecking(false);
      setIsPairing(false);
      setAvailableDevices([]);
      throw error;
    }
  };

  // Connessione al device e salvataggio characteristic
  const connectToDevice = async (info: BluetoothDeviceInfo) => {
    try {
      setIsChecking(true);
      const server = await (info.device as any).gatt?.connect();
      if (!server) throw new Error('Unable to connect to device');
      const service = await server.getPrimaryService(SERVICE_UUID);
      const char = await service.getCharacteristic(CHARACTERISTIC_UUID);
      setCharacteristic(char);
      setConnectedDevice(info);
      setIsConnected(true);
      setIsChecking(false);

      // Add event listener for automatic disconnection
      (info.device as any).addEventListener('gattserverdisconnected', () => {
        console.log('Device automatically disconnected');
        setIsConnected(false);
        setConnectedDevice(null);
        setCharacteristic(null);
      });

      return true;
    } catch (error) {
      setIsChecking(false);
      setIsConnected(false);
      setConnectedDevice(null);
      setCharacteristic(null);
      throw error;
    }
  };

  // Disconnessione
  const disconnectDevice = () => {
    if (connectedDevice?.device && (connectedDevice.device as any).gatt?.connected) {
      (connectedDevice.device as any).gatt.disconnect();
    }
    setIsConnected(false);
    setConnectedDevice(null);
    setCharacteristic(null);
  };

  // Invio configurazione JSON
  const sendConfiguration = async (config: object) => {
    if (!characteristic) throw new Error('No device connected');
    const json = JSON.stringify(config);
    // Converti in Uint8Array (UTF-8)
    const encoder = new TextEncoder();
    const data = encoder.encode(json);
    await characteristic.writeValue(data);
  };

  // Mock: open Bluetooth settings
  const openBluetoothSettings = () => {
    alert('Open device Bluetooth settings manually.');
  };

  // Mock: refresh stato Bluetooth
  const refreshStatus = () => {
    window.location.reload();
  };

  // Mock: reset pairing
  const resetPairing = () => {
    setIsPairing(false);
    setIsConnected(false);
    setConnectedDevice(null);
    setAvailableDevices([]);
    setCharacteristic(null);
  };

  return {
    isEnabled,
    isAvailable,
    isChecking,
    isPairing,
    isConnected,
    connectedDevice,
    availableDevices,
    startPairing,
    connectToDevice,
    disconnectDevice,
    sendConfiguration,
    openBluetoothSettings,
    refreshStatus,
    resetPairing,
  };
};