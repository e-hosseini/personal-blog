import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import Footer from './Footer';
import { StaticImage } from 'gatsby-plugin-image';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description, hideFooter = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const data = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  const metaTitle = title 
    ? `${title} | ${data.site.siteMetadata.title}`
    : data.site.siteMetadata.title;
  
  const metaDescription = description || data.site.siteMetadata.description;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Helmet>
          <html lang="en" />
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <meta name="author" content="Ehsan Hosseini" />
          
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
          
          {/* Favicon */}
          <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#000000" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={data.site.siteMetadata.siteUrl} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={`${data.site.siteMetadata.siteUrl}/ehsan-hosseini.jpeg`} />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:image" content={`${data.site.siteMetadata.siteUrl}/ehsan-hosseini.jpeg`} />
          
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`${data.site.siteMetadata.title} - RSS Feed`}
            href="/rss.xml"
          />
          <link rel="canonical" href={data.site.siteMetadata.siteUrl} />
        </Helmet>
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-xl font-bold">
                Ehsan Hosseini
              </Link>
              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex space-x-6">
                  <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Home
                  </Link>
                  <Link to="/articles" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Articles
                  </Link>
                  <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
                    About
                  </Link>
                  <a
                    href="/rss.xml"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="RSS Feed"
                  >
                    RSS
                  </a>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
        {!hideFooter && <Footer />}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Ehsan Hosseini. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Twitter
                </a>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Layout; 