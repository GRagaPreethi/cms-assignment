import './globals.css';
import ReduxProvider from '../redux/provider';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

export const metadata = {
  title: { default: 'Knowledge Base', template: '%s | Knowledge Base' },
  description: 'A comprehensive knowledge base powered by Headless CMS.',
  openGraph: {
    title: 'Knowledge Base',
    description: 'A comprehensive knowledge base powered by Headless CMS.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <ReduxProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
