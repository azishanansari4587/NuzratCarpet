"use client"
import React, { useEffect, useState } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted or denied cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true); // Show popup if no consent is found
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
        // Here you can set cookies or perform actions on consent acceptance
    };

    const handleDeny = () => {
        localStorage.setItem('cookieConsent', 'denied');
        setIsVisible(false);
        // Here you can perform actions on consent denial, if needed
    };

    if (!isVisible) return null; // Don't render if not visible

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-xl font-semibold mb-3">🍪 Cookie Consent</h2>
                <p className="text-gray-600">
                    We use cookies to enhance your experience. Do you accept the use of cookies?
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                    <button
                        onClick={handleAccept}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleDeny}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition"
                    >
                        Deny
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
