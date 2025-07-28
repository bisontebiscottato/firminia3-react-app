import React, { useState } from "react";
import { RefreshCw, CheckCircle, XCircle, Bluetooth } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { BluetoothDeviceInfo } from "./hooks/useBluetooth";

interface FirminiaConfig {
  ssid: string;
  password: string;
  token: string;
  user: string;
  interval: string;
  server: string;
  port: string;
}

interface ValidationErrors {
  ssid?: string;
  password?: string;
  token?: string;
  user?: string;
  interval?: string;
  server?: string;
  port?: string;
}

interface ConfigurationScreenProps {
  onBack?: () => void;
  onSaveConfig?: (config: FirminiaConfig) => Promise<void>;
  onRefresh?: () => void;
  isConnected: boolean;
  connectedDevice: BluetoothDeviceInfo | null;
  connectToDevice: (device: BluetoothDeviceInfo) => Promise<any>;
  sendConfiguration: (config: object) => Promise<void>;
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
  onBack,
  onSaveConfig,
  onRefresh,
  isConnected,
  connectedDevice,
  connectToDevice,
  sendConfiguration,
}) => {
  // Current configuration (in a real app this would be loaded from device)
  const originalConfig: FirminiaConfig = {
    ssid: "",
    password: "",
    token: "",
    user: "",
    interval: "5", // Default to 5 minutes
    server: "askmesign.askmesuite.com",
    port: "443",
  };

  const [config, setConfig] = useState<FirminiaConfig>(originalConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Funzioni di validazione basate sui controlli C++
  const validateField = (field: keyof FirminiaConfig, value: string): string | undefined => {
    switch (field) {
      case 'ssid':
        if (!value || value.trim().length === 0) {
          return 'SSID is required';
        }
        if (value.trim().length < 1) {
          return 'SSID must be at least 1 character';
        }
        break;
      
      case 'password':
        // Password può essere vuota come nel C++ originale
        if (value === undefined || value === null) {
          return 'Password is required';
        }
        break;
      
      case 'token':
        if (!value) {
          return 'Token is required';
        }
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          return 'Token must contain only letters and numbers';
        }
        break;
      
      case 'user':
        if (!value) {
          return 'Username is required';
        }
        break;
      
      case 'interval':
        if (!value || value.trim().length === 0) {
          return 'Interval is required';
        }
        // Validazione per minuti (3, 5, 10, 15, 30, 60)
        const validMinutes = ['3', '5', '10', '15', '30', '60'];
        if (!validMinutes.includes(value)) {
          return 'Please select a valid interval';
        }
        break;
      
      case 'server':
        if (!value || value.trim().length === 0) {
          return 'Server is required';
        }
        if (!value.includes('.')) {
          return 'Server must contain at least one dot';
        }
        break;
      
      case 'port':
        if (!value || value.trim().length === 0) {
          return 'Port is required';
        }
        if (!/^\d+$/.test(value)) {
          return 'Port must contain only digits';
        }
        const port = parseInt(value);
        if (port < 1 || port > 65535) {
          return 'Port must be between 1 and 65535';
        }
        break;
    }
    return undefined;
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(config).forEach((key) => {
      const field = key as keyof FirminiaConfig;
      const error = validateField(field, config[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FirminiaConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Validazione in tempo reale
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      // Simulates configuration refresh
      setTimeout(() => {
        setIsLoading(false);
        setConfig(originalConfig); // Reset to original values
        toast.success("Configuration updated", {
          description: "Parameters have been reloaded from device",
          icon: <CheckCircle size={20} style={{ color: "#007556" }} />,
        });
      }, 1000);
    } catch (error) {
      console.error("Error during refresh:", error);
      setIsLoading(false);
      toast.error("Error during refresh", {
        description: "Unable to load configuration from device",
        icon: <XCircle size={20} style={{ color: "#ef4444" }} />,
      });
    }
  };

  // Mostra stato connessione in tempo reale
  const renderConnectionStatus = () => (
    <div className="flex items-center gap-2 mb-4">
      <Bluetooth size={18} className={isConnected ? "text-success" : "text-orange-500"} />
      <span style={{ color: isConnected ? "#007556" : "#ef4444", fontWeight: 500 }}>
        {isConnected ? `Connected to ${connectedDevice?.name || "device"}` : "Not connected"}
      </span>
    </div>
  );

  // Invio con tentativo di riconnessione se non connesso
  const handleSave = async () => {
    // Validazione prima dell'invio
    if (!validateAllFields()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form before sending",
        icon: <XCircle size={20} style={{ color: "#ef4444" }} />,
      });
      return;
    }

    setIsLoading(true);
    try {
      let connected = isConnected;
      // Se non connesso, prova a riconnetterti
      if (!connected) {
        if (connectedDevice) {
          toast("Trying to reconnect to device...");
          await connectToDevice(connectedDevice);
          connected = true;
        } else {
          throw new Error("Device not connected");
        }
      }
      if (!connected) throw new Error("Device not connected");
      // Convert minutes to milliseconds
      const intervalMinutes = parseInt(config.interval);
      const intervalMilliseconds = intervalMinutes * 60 * 1000;
      
      await sendConfiguration({
        ssid: config.ssid,
        password: config.password,
        server: config.server,
        port: config.port,
        url: `https://${config.server}/api/v2/files/pending?page=0&size=1`,
        token: config.token,
        user: config.user,
        interval: intervalMilliseconds.toString(),
      });
      if (onSaveConfig) {
        await onSaveConfig(config);
      }
      setIsLoading(false);
      toast.success("Configuration saved", {
        description: "Parameters have been sent to FirminIA V3 device",
        icon: <CheckCircle size={20} style={{ color: "#007556" }} />,
      });
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (error: any) {
      setIsLoading(false);
      toast.error("Error during save", {
        description:
          error?.message || "Unable to send configuration to device. Please try again.",
        icon: <XCircle size={20} style={{ color: "#ef4444" }} />,
      });
    }
  };

  const handleCancel = () => {
    setConfig(originalConfig); // Reset to original values
    if (onBack) {
      onBack();
    }
  };

  const configFields: Array<{
    key: keyof FirminiaConfig;
    label: string;
    type: "text" | "number" | "select";
    options?: Array<{ value: string; label: string }>;
  }> = [
    {
      key: "ssid",
      label: "Your WiFi network name",
      type: "text",
    },
    {
      key: "password",
      label: "Your WiFi network password",
      type: "text",
    },
    {
      key: "server",
      label: "AskMeSign server address",
      type: "text",
    },
    {
      key: "port",
      label: "Server port",
      type: "number",
    },
    {
      key: "token",
      label: "Your AskMeSign token",
      type: "text",
    },
    {
      key: "user",
      label: "Username you use to access AskMeSign",
      type: "text",
    },
    {
      key: "interval",
      label: "How often to check for documents to sign",
      type: "select",
      options: [
        { value: "3", label: "3 minutes" },
        { value: "5", label: "5 minutes" },
        { value: "10", label: "10 minutes" },
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes" },
        { value: "60", label: "60 minutes" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-6 py-4 z-10" style={{ top: "50px" }}>
        <div className="flex items-center justify-between">
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#111111",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: "1.2",
            }}
          >
            Current Configuration
          </h1>
          <Button
            variant="ghost"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-11 px-4 flex items-center gap-2"
            style={{ minHeight: "44px" }}
          >
            <RefreshCw
              size={20}
              className={`${isLoading ? "animate-spin" : ""}`}
              style={{ color: "#007556" }}
            />
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#007556",
                fontFamily:
                  "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Load again
            </span>
          </Button>
        </div>
        {/* Stato connessione realtime */}
        {renderConnectionStatus()}
      </div>

      {/* Form */}
      <div className="p-6 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          {configFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label
                htmlFor={field.key}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#111111",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  lineHeight: "1.4",
                }}
              >
                {field.label}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={config[field.key]}
                  onValueChange={(value) => handleInputChange(field.key, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={`w-full h-12 rounded-lg border bg-background px-4 ${
                      errors[field.key] ? 'border-red-500' : 'border-border'
                    }`}
                    style={{
                      minHeight: "48px",
                      fontFamily:
                        "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={config[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={originalConfig[field.key]}
                  disabled={isLoading}
                  className={`w-full h-12 rounded-lg border bg-background px-4 ${
                    errors[field.key] ? 'border-red-500' : 'border-border'
                  }`}
                  style={{
                    minHeight: "48px",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "16px", // Prevent zoom on iOS
                  }}
                />
              )}
              {errors[field.key] && (
                <div className="text-red-500 text-sm mt-1" style={{
                  fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                }}>
                  {errors[field.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed footer with buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-6" style={{ zIndex: 999 }}>
        <div className="max-w-md mx-auto flex gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 h-12 rounded-lg border-2"
            style={{
              minHeight: "48px",
              borderColor: "#007556",
              color: "#007556",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !isConnected || Object.values(errors).some(error => error !== undefined)}
            className="flex-1 h-12 rounded-lg"
            style={{
              minHeight: "48px",
              backgroundColor: isConnected && !Object.values(errors).some(error => error !== undefined) ? "#007556" : "#cccccc",
              color: "#ffffff",
              fontFamily:
                "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "1rem",
              fontWeight: "500",
            }}

          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span style={{ fontSize: "1rem" }}>Sending...</span>
              </div>
            ) : (
              "Send to device"
            )}
          </Button>
        </div>
      </div>
      
      {/* Version info */}
      <div className="mt-8 mb-6">
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

export default ConfigurationScreen;
