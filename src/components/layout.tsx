import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import Footer from './Footer';
import { StaticImage } from 'gatsby-plugin-image';

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-lato">
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
      <header className="bg-white border-b border-gray-100">
        <nav className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-montserrat font-medium text-gray-900">
            {data.site.siteMetadata.title}
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/tags" className="text-gray-600 hover:text-gray-900 text-sm">
              Topics
            </Link>
            <a
              href="/rss.xml"
              className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout; 