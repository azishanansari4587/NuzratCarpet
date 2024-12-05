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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-50">
            <div className="flex justify-between items-center">
                <p>
                    We use cookies to enhance your experience. Do you accept the use of cookies?
                </p>
                <div>
                    <button onClick={handleAccept} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Accept
                    </button>
                    <button onClick={handleDeny} className="bg-red-500 text-white px-4 py-2 rounded">
                        Deny
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
