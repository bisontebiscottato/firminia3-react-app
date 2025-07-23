import React from "react";
import SplashScreen from "./components/SplashScreen";
import IntroductionScreen from "./components/IntroductionScreen";
import BluetoothOffScreen from "./components/BluetoothOffScreen";
import BluetoothPairingScreen from "./components/BluetoothPairingScreen";
import ConfigurationScreen from "./components/ConfigurationScreen";
import { useSplashScreen } from "./components/hooks/useSplashScreen";
import { useBluetooth } from "./components/hooks/useBluetooth";
import { Button } from "./components/ui/button";
import {
  Bluetooth,
  Settings,
  Wifi,
  ArrowRight,
  Signal,
  SignalLow,
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";

interface FirminiaConfig {
  ssid: string;
  password: string;
  token: string;
  user: string;
  interval: string;
}

// Main app component (when everything is connected)
const MainApp: React.FC<{
  connectedDevice: any;
  onDisconnect: () => void;
  onOpenConfiguration: () => void;
}> = ({ connectedDevice, onDisconnect, onOpenConfiguration }) => {
  const [signalStrength, setSignalStrength] = React.useState<"strong" | "weak">(
    "strong"
  );

  // Simulate signal strength changes every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength((prev) => (prev === "strong" ? "weak" : "strong"));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleSignalStrength = () => {
    setSignalStrength((prev) => (prev === "strong" ? "weak" : "strong"));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bluetooth size={32} className="text-primary" />
          </div>
          <h1 className="mb-2">FirminIA V3</h1>
          <p className="text-muted-foreground">
            Connected device - Active session
          </p>
        </div>

        <div className="space-y-4">
          {/* Connection status */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2>Connected device</h2>
              <div className="flex items-center gap-2 text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Connected</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bluetooth size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{connectedDevice?.name}</div>
                <div
                  className={`text-sm flex items-center gap-1 ${
                    signalStrength === "strong"
                      ? "text-success"
                      : "text-orange-500"
                  }`}
                >
                  {signalStrength === "strong" ? (
                    <Signal size={14} />
                  ) : (
                    <SignalLow size={14} />
                  )}
                  <span>
                    {signalStrength === "strong"
                      ? "Strong signal"
                      : "Weak signal"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main action */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="mb-4">Configuration management</h3>

            <Button
              onClick={onOpenConfiguration}
              className="w-full h-12"
              style={{
                minHeight: "48px",
                backgroundColor: "#007556",
                color: "#ffffff",
                fontFamily:
                  "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              <Settings size={20} className="mr-3" />
              Configure parameters
            </Button>
          </div>

          {/* Other options */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="mb-4">Other options</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={onDisconnect}
                className="w-full justify-between h-12"
                style={{ minHeight: "48px" }}
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-primary" />
                  <span>Disconnect device</span>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* App info */}
          <div className="bg-[rgba(255,255,255,1)] p-4 rounded-lg">
            <p
              className="text-center"
              style={{
                color: "#111111",
                fontFamily:
                  "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              <strong>FirminIA V3</strong> - Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to manage app flow
const AppFlow: React.FC = () => {
  const {
    isEnabled: isBluetoothEnabled,
    isChecking: isCheckingBluetooth,
    isPairing,
    isConnected,
    connectedDevice,
    openBluetoothSettings,
    startPairing,
    connectToDevice,
    disconnectDevice,
    refreshStatus,
    resetPairing,
  } = useBluetooth();

  const [showConfiguration, setShowConfiguration] = React.useState(false);

  // Automatically start pairing when Bluetooth is active
  React.useEffect(() => {
    if (isBluetoothEnabled && !isPairing && !isConnected) {
      startPairing();
    }
  }, [isBluetoothEnabled, isPairing, isConnected, startPairing]);

  const handleSaveConfiguration = async (config: FirminiaConfig) => {
    console.log("Saving configuration:", config);

    try {
      // Simulates sending configuration to FirminIA V3 device
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send data via Bluetooth to the device
      // Example: await bluetoothService.sendConfiguration(config);

      console.log("Configuration saved successfully:", config);
    } catch (error) {
      console.error("Error during save:", error);
      // Re-throw error to handle it in configuration component
      throw new Error("Unable to communicate with FirminIA V3 device");
    }
  };

  const handleRefreshConfiguration = async () => {
    console.log("Refresh configuration from device");

    try {
      // Simulates retrieving configuration from device
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would retrieve data from device via Bluetooth
      // Example: const currentConfig = await bluetoothService.getConfiguration();

      console.log("Configuration updated from device");
    } catch (error) {
      console.error("Error during refresh:", error);
      throw new Error("Unable to retrieve configuration from device");
    }
  };

  // If Bluetooth is being checked, show loading
  if (isCheckingBluetooth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking Bluetooth status....</p>
        </div>
      </div>
    );
  }

  // If Bluetooth is off, show error screen
  if (!isBluetoothEnabled) {
    return (
      <BluetoothOffScreen
        onOpenSettings={openBluetoothSettings}
        onBack={refreshStatus}
      />
    );
  }

  // If device is connected and wants to configure
  if (isConnected && connectedDevice && showConfiguration) {
    return (
      <ConfigurationScreen
        onBack={() => setShowConfiguration(false)}
        onSaveConfig={handleSaveConfiguration}
        onRefresh={handleRefreshConfiguration}
      />
    );
  }

  // If device is connected, show main app
  if (isConnected && connectedDevice) {
    return (
      <MainApp
        connectedDevice={connectedDevice}
        onDisconnect={() => {
          disconnectDevice();
          resetPairing();
        }}
        onOpenConfiguration={() => setShowConfiguration(true)}
      />
    );
  }

  // If Bluetooth is active but not connected, show pairing
  return (
    <BluetoothPairingScreen
      onDeviceConnect={connectToDevice}
      onBack={() => {
        resetPairing();
        refreshStatus();
      }}
    />
  );
};

const App: React.FC = () => {
  const { isVisible: showSplashScreen, hideSplashScreen } = useSplashScreen({
    duration: 3000,
    autoHide: true,
  });

  const [showIntroduction, setShowIntroduction] = React.useState(true);

  // Show splash screen first
  if (showSplashScreen) {
    return <SplashScreen onLoadComplete={hideSplashScreen} />;
  }

  // Show introduction screen after splash
  if (showIntroduction) {
    return <IntroductionScreen onContinue={() => setShowIntroduction(false)} />;
  }

  // Then handle main app flow
  return (
    <>
      <AppFlow />
      <Toaster
        position="top-center"
        expand={true}
        richColors={true}
        closeButton={false}
        duration={4000}
      />
    </>
  );
};

export default App;
