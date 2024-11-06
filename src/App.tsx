import { useEffect } from "react";
import ocbcimg from "./assets/OCBC-Logo.png";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {
  // Callback function for successful QR code scan
  const onScanSuccess = (decodedText: string): void => {
    console.log(`Scanned code: ${decodedText}`);
    // Redirect or send request to the ATM server here
    window.location.href = decodedText;
  };

  // Initialize QR scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false // Disable verbose logging
    );

    // Render the scanner and handle errors
    scanner.render(
      onScanSuccess,
      (errorMessage) => {
        console.error(`QR Code scan error: ${errorMessage}`);
      }
    );

    // Clean up scanner when component unmounts
    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, []); // Only run on mount

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full p-0 flex justify-between items-center">
        <img src={ocbcimg} alt="OCBC Logo" className="h-22" />
        <button className="text-sm font-medium text-gray-500">Exit</button>
      </header>

      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold text-gray-700">QR Code Login</h1>
        <p className="text-gray-500 mt-2">Scan the QR code to continue</p>
      </div>

      <div
        id="qr-reader"
        className="mt-8 bg-white p-6 rounded-lg shadow-lg"
        style={{ width: "300px" }}
      ></div>
    </div>
  );
}
