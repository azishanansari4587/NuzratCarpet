"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GoogleAnalytics = ({ trackingId }) => {
    const pathname = usePathname();

    useEffect(() => {
        if (!trackingId) return;

        if (typeof window.gtag === "function") {
            window.gtag("config", trackingId, {
                page_path: pathname,
            });
        }
    }, [pathname, trackingId]);

    return null;
};

export default GoogleAnalytics;
