import './globals.css';

export const metadata = {
  title: 'Island Roots - Natural Juices & Pastries',
  description: 'Experience the vibrant flavors of Jamaica with our handcrafted juices and pastries from Newark, NJ.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 