# FirminIA V3 Bluetooth Configurator

A React-based web application for configuring FirminIA V3 devices via Web Bluetooth API. This application allows users to discover, connect to, and send configuration parameters to FirminIA V3 Bluetooth devices.

## 🚀 Features

- **Web Bluetooth Integration**: Real-time Bluetooth device discovery and connection
- **Device Configuration**: Send JSON configuration data to FirminIA V3 devices
- **Input Validation**: Comprehensive validation based on C++ device-side validation rules
- **Real-time Connection Status**: Live connection status monitoring with automatic reconnection
- **Responsive UI**: Modern, mobile-friendly interface with Tailwind CSS
- **Cross-platform**: Works on Chrome/Edge desktop and Android devices

## 📋 Prerequisites

- **Browser**: Chrome 56+ or Edge 79+ (Web Bluetooth API support required)
- **Device**: FirminIA V3 Bluetooth device
- **HTTPS**: Web Bluetooth API requires HTTPS (development server configured for localhost)

## 🛠️ Installation

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

## 📱 Usage

### 1. Device Discovery
- Click "Search for devices" to scan for Bluetooth devices
- The app will filter for devices containing "firminia" in their name
- Select your FirminIA V3 device from the list

### 2. Device Connection
- Click on the device box to select it
- Press "Select" to establish connection
- The app will automatically connect to the device's GATT service

### 3. Configuration
- Fill in the required configuration fields:
  - **SSID**: WiFi network name (required, min 1 character)
  - **Password**: WiFi password (optional)
  - **Server**: Server domain (required, must contain a dot)
  - **Port**: Server port (required, 1-65535)
  - **Token**: Authentication token (required, alphanumeric only)
  - **User**: Username (required)
  - **Interval**: Update interval in minutes (3, 5, 10, 15, 30, 60)

### 4. Send Configuration
- Click "Send to device" to transmit the configuration
- The app will convert interval to milliseconds and construct the URL automatically
- Success/error messages will be displayed via toast notifications

## 🔧 Configuration Format

The application sends JSON configuration data to the device:

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

## 🏗️ Technical Architecture

### Core Components

- **`useBluetooth.ts`**: Custom React hook for Web Bluetooth API integration
- **`ConfigurationScreen.tsx`**: Main configuration interface with validation
- **`BluetoothPairingScreen.tsx`**: Device discovery and connection UI
- **`App.tsx`**: Application flow management and state coordination

### Bluetooth Implementation

- **Service UUID**: `0000fff0-0000-1000-8000-00805f9b34fb`
- **Characteristic UUID**: `0000ff01-0000-1000-8000-00805f9b34fb`
- **Data Format**: UTF-8 encoded JSON strings as `Uint8Array`
- **Connection Management**: Automatic disconnection detection and reconnection

### Validation Rules

Based on C++ device-side validation:

- **SSID**: Not empty, minimum 1 character
- **Password**: Optional (can be empty)
- **Server**: Must contain at least one dot
- **Port**: Numeric only, range 1-65535
- **Token**: Alphanumeric characters only
- **User**: Required (no specific format)
- **Interval**: Predefined values (3, 5, 10, 15, 30, 60 minutes)

## 🎨 UI/UX Features

- **Fixed Header**: Consistent "FirminIA V3 configurator" header across all screens
- **Real-time Validation**: Instant feedback on input field validation
- **Connection Status**: Live connection status with visual indicators
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Elements**: Pointer cursors on all clickable elements
- **Input Styling**: Custom background colors (#E4F2FF default, #FEFCED on focus)
- **Web Accessibility**: Compatible with WCAG 2.1 AA 

## 🚨 Troubleshooting

### Common Issues

1. **"Web Bluetooth not supported"**
   - Use Chrome 56+ or Edge 79+
   - Ensure HTTPS is enabled (required for Web Bluetooth)

2. **"No 'firminia' device found"**
   - Ensure your FirminIA V3 device is in pairing mode
   - Check that the device name contains "firminia"

3. **"Device not connected"**
   - Try reconnecting by clicking "Send to device" again
   - Ensure the device is within range and powered on

4. **"Validation failed"**
   - Check all required fields are filled
   - Ensure input formats match validation rules

### Development Issues

1. **HTTPS Certificate Warnings**
   - Accept the development certificate in your browser
   - This is normal for local development

2. **Bluetooth Permission Denied**
   - Clear browser permissions and try again
   - Ensure Bluetooth is enabled on your device

## 📦 Dependencies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Sonner**: Toast notifications
- **Vite**: Build tool and dev server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email**: biso@biso.it
- **Issues**: [GitHub Issues](https://github.com/yourusername/firminia3-react-app/issues)

## 🔄 Version History

- **v1.0.0**: Initial release with Web Bluetooth integration
- **v1.1.0**: Added comprehensive input validation
- **v1.2.0**: Improved UI/UX and connection management
- **v1.3.0**: Added real-time connection status and automatic reconnection

---

**Note**: This application requires a FirminIA V3 device and a browser with Web Bluetooth API support. For best results, use Chrome or Edge on desktop or Android devices. 