// ---------------------------------------------------------------- //
// File Name: app/layout.js
// Function: This is the main layout for the entire website,
//           used to configure elements that appear
//           on all pages, such as the header, footer, and content width.
// ---------------------------------------------------------------- //

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdsterraLayoutWrapper from '../components/AdsterraLayoutWrapper';

export const metadata = {
  // Changing title and description to English
  title: '123movies | Watch Movies and TV Series Streaming Free',
  description: 'Your ultimate destination for high-quality Watch Movies and TV shows streaming.',
  // Menambahkan meta keywords untuk SEO
  keywords: ['123movies', 'watch free movies', 'watch free tv series', 'streaming', 'film gratis'],
  // Open Graph meta tags for Facebook
  openGraph: {
    title: '123movies | Watch Movies and TV Series Streaming Free',
    description: 'Your ultimate destination for high-quality Watch Movies and TV shows streaming.',
    url: 'https://123movies123.netlify.app/',
    siteName: '123movies',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/54749109544_bcd4a12179_b.jpg',
        width: 1200,
        height: 630,
        alt: '123movies',
      },
    ],
    // Changing locale to English
    locale: 'en_US',
    type: 'website',
    // Special property for Facebook, 'og:app_id'
    appId: 'cut.erna.984',
  },
  // Twitter Card meta tags
  twitter: {
    card: 'summary_large_image',
    site: '@WatchStream123', // Your Twitter user
    creator: '@WatchStream123',
    // Mengoreksi kesalahan ketik pada deskripsi
    title: '123movies | Watch Movies and TV Series Streaming Free',
    description: 'Your ultimate destination for high-quality Watch Movies and TV shows streaming.',
    images: ['https://live.staticflickr.com/65535/54749109544_bcd4a12179_b.jpg'], // Replace with the appropriate image URL
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AdsterraLayoutWrapper>
          <div className="mx-auto max-w-7xl">
            <Header />
            {children}
            {/* Native Banner diletakkan di sini, sebelum Footer */}
            <div id="container-a9dce3a8ac7a8f548d4f4ea5ed12df3a"></div>
            {/* Anda juga perlu menambahkan skrip Native Banner di sini */}
            <script async="async" data-cfasync="false" src="//discreetisabella.com/a9dce3a8ac7a8f548d4f4ea5ed12df3a/invoke.js"></script>
            <Footer />
          </div>
        </AdsterraLayoutWrapper>
      </body>
    </html>
  );
}
