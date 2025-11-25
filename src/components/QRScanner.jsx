import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanResult }) => {
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        const onScanSuccess = (decodedText, decodedResult) => {
            // Handle the scanned code as you like, for example:
            console.log(`Code matched = ${decodedText}`, decodedResult);
            if (onScanResult) {
                onScanResult(decodedText);
            }
            // Optional: Stop scanning after success
            // scanner.clear(); 
        };

        const onScanFailure = (error) => {
            // handle scan failure, usually better to ignore and keep scanning.
            // for this example we just log it or ignore
            // console.warn(`Code scan error = ${error}`);
        };

        scanner.render(onScanSuccess, onScanFailure);

        // Cleanup function
        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, [onScanResult]);

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div id="reader"></div>
            {scanError && <p style={{ color: 'red' }}>{scanError}</p>}
        </div>
    );
};

export default QRScanner;
