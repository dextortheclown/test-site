import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import ocbcimg from "./assets/OCBC-Logo.png";
import CryptoJS from "crypto-js";
import { db } from "./firebase"; // Import Firestore instance

// Function to generate token based on userID and timestamp
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const generateToken = (userID: string, timestamp: number) => {
  const message = `${userID}:${timestamp}`;
  return CryptoJS.HmacSHA256(message, SECRET_KEY).toString(CryptoJS.enc.Hex);
};

export default function QRScanner() {
  const navigate = useNavigate();

  const onScanSuccess = async (decodedText: string) => {
    try {
      const { userID, token, timestamp } = JSON.parse(decodedText);

      // Validate the token and timestamp
      const currentTimestamp = Math.floor(Date.now() / 10000); // 10-second intervals
      const expectedToken = generateToken(userID, timestamp);

      if (expectedToken === token && Math.abs(currentTimestamp - timestamp) <= 1) {
        // Check if the userID exists in Firestore
        const userRef = doc(db, "users", userID);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User verified successfully.");

          // Pass user data as state to the SuccessPage
          navigate("/SuccessPage", { state: { userID, email: userData.email } });
        } else {
          console.error("User not found in Firestore");
        }
      } else {
        console.error("Invalid or expired QR code");
      }
    } catch (error) {
      console.error("Failed to verify user:", error);
    }
  };

  // Initialize the QR scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 350, height: 350 } },
      false
    );

    scanner.render(onScanSuccess, (errorMessage) => {
      console.error(`QR Code scan error: ${errorMessage}`);
    });

    return () => {
      scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full p-0 flex justify-between items-center">
        <img src={ocbcimg} alt="Bank Logo" className="h-22 ml-12 mt-12" />
      </header>
      <div className="text-center mt-8">
        <h1 className="text-2xl mt-24 font-bold text-gray-700">QR Code Login</h1>
        <p className="text-gray-500 mt-8">Scan the QR code to continue</p>
      </div>
      <div id="qr-reader" className="mt-8 bg-white p-6 rounded-lg shadow-lg" style={{ width: "550px" }}></div>
    </div>
  );
}
