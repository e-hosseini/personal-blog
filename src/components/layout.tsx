import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <html lang="en" />
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="author" content="Ehsan Hosseini" />
        
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
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            {data.site.siteMetadata.title}
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/tags" className="text-gray-600 hover:text-gray-900">
              Tags
            </Link>
            <a
              href="/rss.xml"
              className="text-gray-600 hover:text-gray-900 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
              </svg>
              RSS
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      {isHomePage ? (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-gray-500 text-center">© {new Date().getFullYear()} Ehsan Hosseini. All rights reserved.</p>
          </div>
        </div>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default Layout; 