import './globals.css';
import { AuthProvider } from '../context/AuthContext';

// Page metadata (title + description for browser tab and SEO)
export const metadata = {
  title: 'Wishlist App',
  description: 'Create and manage your wish list',
};

// Root layout — wraps ALL pages in the app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
