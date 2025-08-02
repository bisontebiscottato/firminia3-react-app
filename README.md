# FirminIA V3 Bluetooth Configurator

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC.svg)](https://tailwindcss.com/)
[![Web Bluetooth](https://img.shields.io/badge/Web_Bluetooth-API-4A90E2.svg)](https://web.dev/bluetooth/)
[![License](https://img.shields.io/badge/License-AGPL_3.0-blue)](LICENSE)

A modern React-based web application for configuring FirminIA V3 devices via Web Bluetooth API. This application provides an intuitive interface for discovering, connecting to, and sending configuration parameters to FirminIA V3 Bluetooth devices with real-time validation and connection monitoring.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#️-installation)
- [Usage](#-usage)
- [Configuration Format](#-configuration-format)
- [Technical Architecture](#️-technical-architecture)
- [UI/UX Features](#-uiux-features)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Dependencies](#-dependencies)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)
- [Version History](#-version-history)

## 🚀 Features

- **🔍 Web Bluetooth Integration**: Real-time Bluetooth device discovery and connection with automatic filtering for FirminIA devices
- **⚙️ Device Configuration**: Send JSON configuration data to FirminIA V3 devices with comprehensive validation
- **✅ Input Validation**: Real-time validation based on C++ device-side validation rules with instant feedback
- **📡 Real-time Connection Status**: Live connection status monitoring with automatic reconnection and disconnection detection
- **📱 Responsive UI**: Modern, mobile-first interface with Tailwind CSS and accessibility features
- **🌐 Cross-platform**: Works on Chrome/Edge desktop and Android devices with Web Bluetooth API support
- **🔒 Secure Communication**: HTTPS-required Web Bluetooth API with encrypted data transmission
- **🎯 User Experience**: Intuitive workflow with clear visual feedback and error handling

## 📋 Prerequisites

### System Requirements
- **Browser**: Chrome 56+ or Edge 79+ (Web Bluetooth API support required)
- **Device**: FirminIA V3 Bluetooth device in pairing mode
- **HTTPS**: Web Bluetooth API requires HTTPS (development server configured for localhost)
- **Bluetooth**: Enabled Bluetooth adapter on your device

### Browser Compatibility
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 56+ | ✅ Supported |
| Edge | 79+ | ✅ Supported |
| Firefox | Any | ❌ Not Supported |
| Safari | Any | ❌ Not Supported |

## 🛠️ Installation

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/firminia3-react-app.git
   cd firminia3-react-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `https://localhost:3000`
   - Accept any SSL certificate warnings (development only)
   - Ensure Bluetooth is enabled on your device

### Production Build

```bash
npm run build
npm run preview
```

## 📱 Usage

### 1. Device Discovery
- Click **"Search for devices"** to scan for Bluetooth devices
- The app automatically filters for devices containing "firminia" in their name
- Select your FirminIA V3 device from the filtered list
- **Note**: Ensure your device is in pairing mode and within range

### 2. Device Connection
- Click on the device box to select it (visual feedback provided)
- Press **"Select"** to establish connection
- The app automatically connects to the device's GATT service
- Connection status is displayed in real-time

### 3. Configuration Setup
Fill in the required configuration fields with real-time validation:

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| **SSID** | Required | Min 1 character | WiFi network name |
| **Password** | Optional | Any length | WiFi password (can be empty) |
| **Server** | Required | Must contain a dot | Server domain (e.g., sign.askme.it) |
| **Port** | Required | 1-65535 | Server port number |
| **Token** | Required | Alphanumeric only | Authentication token |
| **User** | Required | Any format | Username for authentication |
| **Interval** | Required | 3,5,10,15,30,60 min | Update interval in minutes |

### 4. Send Configuration
- Click **"Send to device"** to transmit the configuration
- The app automatically converts interval to milliseconds
- URL is constructed automatically based on server and port
- Success/error messages displayed via toast notifications
- Configuration is sent as UTF-8 encoded JSON

## 🔧 Configuration Format

The application sends JSON configuration data to the device with the following structure:

```json
{
  "ssid": "your-wifi-network",
  "password": "your-wifi-password",
  "server": "sign.askme.it",
  "port": "443",
  "url": "https://sign.askme.it/api/v2/files/pending?page=0&size=1",
  "token": "your-auth-token",
  "user": "your-username",
  "interval": "300000"
}
```

### Data Flow
1. **Input Validation** → Real-time field validation
2. **Data Processing** → Interval conversion to milliseconds
3. **URL Construction** → Automatic URL generation
4. **JSON Serialization** → UTF-8 encoding
5. **Bluetooth Transmission** → GATT characteristic write

## 🏗️ Technical Architecture

### Core Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **`useBluetooth.ts`** | Web Bluetooth API integration | Device discovery, connection management, data transmission |
| **`ConfigurationScreen.tsx`** | Main configuration interface | Real-time validation, form handling, error display |
| **`BluetoothPairingScreen.tsx`** | Device discovery UI | Device filtering, selection, connection status |
| **`App.tsx`** | Application flow management | State coordination, screen transitions |

### Bluetooth Implementation

```typescript
// Service and Characteristic UUIDs
const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000ff01-0000-1000-8000-00805f9b34fb';

// Data transmission format
const encoder = new TextEncoder();
const data = encoder.encode(JSON.stringify(config));
await characteristic.writeValue(data);
```

### Connection Management
- **Automatic Discovery**: Filters devices by name containing "firminia"
- **Connection Monitoring**: Real-time connection status with visual indicators
- **Disconnection Handling**: Automatic detection and cleanup
- **Reconnection Logic**: Graceful handling of connection drops

### Validation Rules

Based on C++ device-side validation:

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| **SSID** | `length > 0` | "SSID is required" |
| **Password** | `optional` | No validation required |
| **Server** | `contains('.')` | "Server must contain a domain" |
| **Port** | `1 <= port <= 65535` | "Port must be between 1-65535" |
| **Token** | `alphanumeric only` | "Token must be alphanumeric" |
| **User** | `length > 0` | "User is required" |
| **Interval** | `[3,5,10,15,30,60]` | "Select a valid interval" |

## 🎨 UI/UX Features

### Design System
- **Fixed Header**: Consistent "FirminIA V3 configurator" header across all screens
- **Real-time Validation**: Instant feedback with color-coded input states
- **Connection Status**: Live status indicators with appropriate icons
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Pointer cursors and hover effects
- **Input Styling**: Custom background colors (#E4F2FF default, #FEFCED on focus)

### Accessibility Features
- **WCAG 2.1 AA Compliance**: Screen reader support and keyboard navigation
- **Color Contrast**: High contrast ratios for better readability
- **Focus Indicators**: Clear focus states for keyboard users
- **Error Messaging**: Descriptive error messages for form validation

### User Experience
- **Progressive Disclosure**: Information revealed as needed
- **Error Prevention**: Real-time validation prevents invalid submissions
- **Success Feedback**: Clear confirmation of successful operations
- **Loading States**: Visual feedback during async operations


### Main Screens
- **Device Discovery**: Bluetooth device scanning interface
- **Configuration Form**: Input fields with validation feedback
- **Connection Status**: Real-time connection monitoring
- **Success/Error States**: Toast notifications and status messages

## 🚨 Troubleshooting

### Common Issues

#### 1. "Web Bluetooth not supported"
**Symptoms**: Error message when trying to scan for devices
**Solutions**:
- Use Chrome 56+ or Edge 79+
- Ensure HTTPS is enabled (required for Web Bluetooth)
- Check browser permissions for Bluetooth access

#### 2. "No 'firminia' device found"
**Symptoms**: No devices appear in the scan results
**Solutions**:
- Ensure your FirminIA V3 device is in pairing mode
- Check that the device name contains "firminia"
- Verify device is within Bluetooth range
- Try refreshing the page and scanning again

#### 3. "Device not connected"
**Symptoms**: Connection fails or drops unexpectedly
**Solutions**:
- Try reconnecting by clicking "Send to device" again
- Ensure the device is within range and powered on
- Check for interference from other Bluetooth devices
- Restart the device if necessary

#### 4. "Validation failed"
**Symptoms**: Form submission fails with validation errors
**Solutions**:
- Check all required fields are filled
- Ensure input formats match validation rules
- Verify server domain contains a dot
- Confirm port number is within valid range

### Development Issues

#### 1. HTTPS Certificate Warnings
**Symptoms**: Browser shows security warnings
**Solutions**:
- Accept the development certificate in your browser
- This is normal for local development
- Production deployments should use proper SSL certificates

#### 2. Bluetooth Permission Denied
**Symptoms**: Browser blocks Bluetooth access
**Solutions**:
- Clear browser permissions and try again
- Ensure Bluetooth is enabled on your device
- Check browser settings for site permissions

### Debug Information

Enable browser developer tools to see detailed error messages:
```javascript
// Check Web Bluetooth support
console.log('Web Bluetooth supported:', !!navigator.bluetooth);

// Monitor connection status
console.log('Device connected:', isConnected);
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Development Dependencies
```json
{
  "vite": "^4.0.0",
  "@types/react": "^18.0.0",
  "eslint": "^8.0.0"
}
```

### UI Libraries
- **Lucide React**: Modern icon library
- **Sonner**: Toast notification system
- **Tailwind CSS**: Utility-first CSS framework

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/firminia3-react-app.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Include screenshots if UI changes
   - Reference any related issues

### Development Guidelines
- **Code Style**: Follow TypeScript best practices
- **Testing**: Add unit tests for new functionality
- **Documentation**: Update README for new features
- **Accessibility**: Ensure WCAG compliance for UI changes

## 📄 License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.


## 📞 Support

### Contact Information
- **Email**: biso@biso.it
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/firminia3-react-app/issues)
- **Documentation**: [FirminIA V3 Docs](https://docs.firminia.com)

### Getting Help
1. **Check Troubleshooting**: Review the troubleshooting section above
2. **Search Issues**: Look for similar problems in GitHub issues
3. **Create Issue**: Provide detailed information about your problem
4. **Email Support**: For urgent or private matters

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| **v1.3.0** | 2024-01-15 | Added real-time connection status and automatic reconnection |
| **v1.2.0** | 2024-01-10 | Improved UI/UX and connection management |
| **v1.1.0** | 2024-01-05 | Added comprehensive input validation |
| **v1.0.0** | 2024-01-01 | Initial release with Web Bluetooth integration |

---

**Note**: This application requires a FirminIA V3 device and a browser with Web Bluetooth API support. For best results, use Chrome or Edge on desktop or Android devices.

---

**Made with ❤️ by Andrea Mancini**