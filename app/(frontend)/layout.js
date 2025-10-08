import {Playfair_Display, Lora, Inter, Barlow } from "next/font/google";
import "../globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// const inter = Inter({ subsets: ["latin"] });
const playfair = Barlow({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular & Bold
  display: "swap",
  variable: "--font-playfair", // Define CSS variable
});

// Load Lora for Body Text
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular & Bold
  display: "swap",
  variable: "--font-lora", // Define CSS variable
});

export const metadata = {
  title: "Nuzrat Carpet Emporium",
  description: "Discover premium quality carpets at Nuzrat Carpet Emporium. Explore a wide range of stylish, durable, and affordable carpets for every space. Shop now for the perfect blend of comfort and elegance!",
  metadataBase: new URL('https://nuzratcarpet.com'),
  metadataRoot: new URL('https://nuzratcarpet.com'),
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      <title>Premium Quality Carpets | Your Website Name</title>
        <meta name="description" content="Explore a wide range of stylish, durable, and affordable carpets for every space. Shop now for the perfect blend of comfort and elegance!" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Premium Quality Carpets | Nuzrat Carpet Emporium" />
        <meta property="og:description" content="Explore a wide range of stylish, durable, and affordable carpets for every space. Shop now for the perfect blend of comfort and elegance!" />
        <meta property="og:image" content="https://nuzratcarpet.com/48.jpg" />
        <meta property="og:url" content="https://nuzratcarpet.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Your Website Name" />

        {/* Twitter Card for better social sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Quality Carpets | Nuzrat Carpet Emporium" />
        <meta name="twitter:description" content="Explore a wide range of stylish, durable, and affordable carpets for every space. Shop now for the perfect blend of comfort and elegance!" />
        <meta name="twitter:image" content="https://nuzratcarpet.com/48.jpg" />
          <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=YOUR_GA_TRACKING_ID`}
          ></script>
          <script
              dangerouslySetInnerHTML={{
                  __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'YOUR_GA_TRACKING_ID', {
                          page_path: window.location.pathname,
                      });
                  `,
              }}
          ></script>
        </head>
      <body className={`${playfair.variable} ${lora.variable}`.className} data-cjcrx="addYes">
      <GoogleAnalytics trackingId="YOUR_GA_TRACKING_ID" />
        <div className="min-h-screen bg-[#f8f8f6]">
          <Header/>
            <main>
              {children}
            </main> 
            <ToastContainer position="top-right" autoClose={3000} theme="light" />
          <Footer/>
        </div>
      </body>
    </html>
  );
}

