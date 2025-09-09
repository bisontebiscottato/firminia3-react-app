import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from "lucide-react";
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
  language: string;
}

interface ValidationErrors {
  ssid?: string;
  password?: string;
  token?: string;
  user?: string;
  interval?: string;
  server?: string;
  port?: string;
  language?: string;
}

interface ConfigurationScreenProps {
  onBack?: () => void;
  onSaveConfig?: (config: FirminiaConfig) => Promise<void>;
  isConnected: boolean;
  connectedDevice: BluetoothDeviceInfo | null;
  connectToDevice: (device: BluetoothDeviceInfo) => Promise<any>;
  sendConfiguration: (config: object) => Promise<void>;
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
  onBack,
  onSaveConfig,
  isConnected,
  connectedDevice,
  connectToDevice,
  sendConfiguration,
}) => {
  const { t } = useTranslation();
  // Current configuration (in a real app this would be loaded from device)
  const originalConfig: FirminiaConfig = {
    ssid: "",
    password: "",
    token: "",
    user: "",
    interval: "5", // Default to 5 minutes
    server: "sign.askme.it",
    port: "443",
    language: "0", // Default to English (0)
  };

  const [config, setConfig] = useState<FirminiaConfig>(originalConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation functions based on C++ checks
  const validateField = (field: keyof FirminiaConfig, value: string): string | undefined => {
    switch (field) {
      case 'ssid':
        if (!value || value.trim().length === 0) {
          return t('configuration.validation.ssidRequired');
        }
        if (value.trim().length < 1) {
          return t('configuration.validation.ssidMinLength');
        }
        break;
      
      case 'password':
        // Password can be empty as in original C++
        if (value === undefined || value === null) {
          return t('configuration.validation.passwordRequired');
        }
        break;
      
      case 'token':
        if (!value) {
          return t('configuration.validation.tokenRequired');
        }
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          return t('configuration.validation.tokenFormat');
        }
        break;
      
      case 'user':
        if (!value) {
          return t('configuration.validation.userRequired');
        }
        break;
      
      case 'interval':
        if (!value || value.trim().length === 0) {
          return t('configuration.validation.intervalRequired');
        }
        // Validation for minutes (3, 5, 10, 15, 30, 60)
        const validMinutes = ['3', '5', '10', '15', '30', '60'];
        if (!validMinutes.includes(value)) {
          return t('configuration.validation.intervalInvalid');
        }
        break;
      
      case 'server':
        if (!value || value.trim().length === 0) {
          return t('configuration.validation.serverRequired');
        }
        if (!value.includes('.')) {
          return t('configuration.validation.serverFormat');
        }
        break;
      
      case 'port':
        if (!value || value.trim().length === 0) {
          return t('configuration.validation.portRequired');
        }
        if (!/^\d+$/.test(value)) {
          return t('configuration.validation.portFormat');
        }
        const port = parseInt(value);
        if (port < 1 || port > 65535) {
          return t('configuration.validation.portRange');
        }
        break;
      
      case 'language':
        if (!value || value.trim().length === 0) {
          return t('configuration.validation.languageRequired');
        }
        // Validation for language values: "0" (English), "1" (Italian), "2" (French), "3" (Spanish)
        const validLanguages = ['0', '1', '2', '3'];
        if (!validLanguages.includes(value)) {
          return t('configuration.validation.languageInvalid');
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
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };




  // Send with reconnection attempt if not connected
  const handleSave = async () => {
    // Validation before sending
    if (!validateAllFields()) {
      toast.error(t('configuration.actions.error'), {
        description: t('configuration.actions.validationError'),
        icon: <XCircle size={20} style={{ color: "#ef4444" }} />,
      });
      return;
    }

    setIsLoading(true);
    try {
      let connected = isConnected;
      // If not connected, try to reconnect
      if (!connected) {
        if (connectedDevice) {
          toast(t('configuration.actions.reconnecting'));
          await connectToDevice(connectedDevice);
          connected = true;
        } else {
          throw new Error(t('configuration.validation.deviceNotConnected'));
        }
      }
      if (!connected) throw new Error(t('configuration.validation.deviceNotConnected'));
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
        language: config.language,
      });
      if (onSaveConfig) {
        await onSaveConfig(config);
      }
      setIsLoading(false);
      toast.success(t('configuration.actions.success'), {
        description: t('configuration.actions.successDescription'),
        icon: <CheckCircle size={20} style={{ color: "#007556" }} />,
      });
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(t('configuration.actions.error'), {
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

  const getSelectOptions = (optionsKey: string) => {
    if (optionsKey === "intervals") {
      return [
        { value: "3", label: t('configuration.intervals.3') },
        { value: "5", label: t('configuration.intervals.5') },
        { value: "10", label: t('configuration.intervals.10') },
        { value: "15", label: t('configuration.intervals.15') },
        { value: "30", label: t('configuration.intervals.30') },
        { value: "60", label: t('configuration.intervals.60') },
      ];
    } else if (optionsKey === "languages") {
      return [
        { value: "0", label: t('configuration.languages.0') },
        { value: "1", label: t('configuration.languages.1') },
        { value: "2", label: t('configuration.languages.2') },
        { value: "3", label: t('configuration.languages.3') },
      ];
    }
    return [];
  };

  const configFields: Array<{
    key: keyof FirminiaConfig;
    labelKey: string;
    type: "text" | "number" | "select";
    optionsKey?: string;
  }> = [
    {
      key: "ssid",
      labelKey: "configuration.fields.ssid",
      type: "text",
    },
    {
      key: "password",
      labelKey: "configuration.fields.password",
      type: "text",
    },
    {
      key: "server",
      labelKey: "configuration.fields.server",
      type: "text",
    },
    {
      key: "port",
      labelKey: "configuration.fields.port",
      type: "number",
    },
    {
      key: "token",
      labelKey: "configuration.fields.token",
      type: "text",
    },
    {
      key: "user",
      labelKey: "configuration.fields.user",
      type: "text",
    },
    {
      key: "interval",
      labelKey: "configuration.fields.interval",
      type: "select",
      optionsKey: "intervals",
    },
    {
      key: "language",
      labelKey: "configuration.fields.language",
      type: "select",
      optionsKey: "languages",
    },
  ];

  return (
    <div className="h-screen bg-background overflow-hidden" style={{ paddingBottom: "100px" }}>
      {/* Form */}
      <div className="p-6 pb-32 overflow-y-auto h-full" style={{ paddingTop: "50px" }}>
        <h1 className="text-center" style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111111", fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif", lineHeight: "1.4", paddingBottom: "20px"}}>
          {t('configuration.title')} {connectedDevice?.name || "Unknown Device"}
        </h1>
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
                {t(field.labelKey)}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={config[field.key]}
                  onValueChange={(value) => handleInputChange(field.key, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                                      className={`w-full h-12 rounded-lg border px-4 ${
                    errors[field.key] ? 'border-red-500' : 'border-border'
                  }`}
                  style={{
                    minHeight: "48px",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "16px",
                    backgroundColor: "#E4F2FF",
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = "#FEFCED";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "#E4F2FF";
                  }}
                  >
                    <SelectValue placeholder={t('configuration.actions.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.optionsKey && getSelectOptions(field.optionsKey).map((option) => (
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
                  className={`w-full h-12 rounded-lg border px-4 ${
                    errors[field.key] ? 'border-red-500' : 'border-border'
                  }`}
                  style={{
                    minHeight: "48px",
                    fontFamily:
                      "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "16px", // Prevent zoom on iOS
                    backgroundColor: "#E4F2FF",
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = "#FEFCED";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "#E4F2FF";
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
            {t('configuration.actions.discard')}
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
                <span style={{ fontSize: "1rem" }}>{t('configuration.actions.saving')}</span>
              </div>
            ) : (
              t('configuration.actions.save')
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
