import React, { useState } from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface FirminiaConfig {
  ssid: string;
  password: string;
  token: string;
  user: string;
  interval: string;
}

interface ConfigurationScreenProps {
  onBack?: () => void;
  onSaveConfig?: (config: FirminiaConfig) => Promise<void>;
  onRefresh?: () => void;
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({
  onBack,
  onSaveConfig,
  onRefresh,
}) => {
  // Current configuration (in a real app this would be loaded from device)
  const originalConfig: FirminiaConfig = {
    ssid: "TP-Link 912390",
    password: "your_wifi_password",
    token: "your_api_token",
    user: "your_user_identifier",
    interval: "3",
  };

  const [config, setConfig] = useState<FirminiaConfig>(originalConfig);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FirminiaConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
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

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (onSaveConfig) {
        await onSaveConfig(config);
      }

      // Success
      setIsLoading(false);
      toast.success("Configuration saved", {
        description: "Parameters have been sent to FirminIA V3 device",
        icon: <CheckCircle size={20} style={{ color: "#007556" }} />,
      });

      // Return to previous screen after short delay
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (error) {
      console.error("Error during save:", error);
      setIsLoading(false);

      // Error
      toast.error("Error during save", {
        description:
          "Unable to send configuration to device. Please try again.",
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

  const configFields = [
    {
      key: "ssid" as keyof FirminiaConfig,
      label: "Your WiFi network name",
      type: "text",
    },
    {
      key: "password" as keyof FirminiaConfig,
      label: "Your WiFi network password",
      type: "password",
    },
    {
      key: "token" as keyof FirminiaConfig,
      label: "Your AskMeSign token",
      type: "password",
    },
    {
      key: "user" as keyof FirminiaConfig,
      label: "Username you use to access AskMeSign",
      type: "text",
    },
    {
      key: "interval" as keyof FirminiaConfig,
      label: "How often to check for documents to sign (minutes)",
      type: "number",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-6 py-4 z-10">
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
              <Input
                id={field.key}
                type={field.type}
                value={config[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={originalConfig[field.key]}
                disabled={isLoading}
                className="w-full h-12 rounded-lg border border-border bg-background px-4"
                style={{
                  minHeight: "48px",
                  fontFamily:
                    "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "16px", // Prevent zoom on iOS
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed footer with buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-6">
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
            disabled={isLoading}
            className="flex-1 h-12 rounded-lg"
            style={{
              minHeight: "48px",
              backgroundColor: "#007556",
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
    </div>
  );
};

export default ConfigurationScreen;
