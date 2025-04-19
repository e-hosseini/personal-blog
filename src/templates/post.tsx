import React from 'react';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet';
import Layout from '../components/layout';
import Topic from '../components/Topic';
import { StaticImage } from 'gatsby-plugin-image';

// Define components for MDX
const components = {
  pre: (props: any) => <div {...props} className="overflow-auto" />,
  iframe: (props: any) => (
    <div className="aspect-video">
      <iframe {...props} className="w-full h-full rounded-lg" />
    </div>
  ),
};

interface PostTemplateProps {
  data: {
    mdx: {
      frontmatter: {
        title: string;
        publishedAt: string;
        summary: string;
        label: string;
        tags: string[];
      };
      fields: {
        slug: string;
      };
    };
    relatedPosts: {
      nodes: Array<{
        id: string;
        frontmatter: {
          title: string;
          publishedAt: string;
          summary: string;
          tags: string[];
        };
        fields: {
          slug: string;
        };
      }>;
    };
    site: {
      siteMetadata: {
        title: string;
        siteUrl: string;
      };
    };
  };
  children: React.ReactNode;
}

const PostTemplate = ({ data, children }: PostTemplateProps) => {
  if (!data || !data.mdx) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Post not found</h1>
          <p>Sorry, the post you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  const { frontmatter, fields } = data.mdx;
  const { title, publishedAt, summary, label, tags } = frontmatter;
  const { siteUrl } = data.site.siteMetadata;
  const canonicalUrl = `${siteUrl}${fields.slug}`;

  // Get related posts
  const relatedPosts = data.relatedPosts.nodes.filter(
    (post: { fields: { slug: string } }) => post.fields.slug !== fields.slug
  ).slice(0, 3); // Show up to 3 related posts

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: publishedAt,
    description: summary,
    url: canonicalUrl,
    keywords: tags,
  };

  return (
    <Layout>
      <Helmet>
        <title>{title} | {data.site.siteMetadata.title}</title>
        <meta name="description" content={summary} />
        <meta name="keywords" content={tags.join(', ')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={summary} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={summary} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-playfair font-medium text-gray-900 leading-tight mb-4">
              {title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600 mb-4">
              <time className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {publishedAt}
              </time>
              {label && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {label}
                </span>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag: string) => (
                <Topic
                  key={tag}
                  tag={tag}
                  className="text-sm"
                />
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex space-x-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Share
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(canonicalUrl);
                    // You could add a toast notification here
                  }}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-medium prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 prose-img:rounded-lg prose-img:shadow-md">
          <MDXProvider components={components}>
            {children}
          </MDXProvider>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-playfair font-medium mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post: { id: string; frontmatter: { title: string; publishedAt: string; summary: string; tags: string[] }; fields: { slug: string } }) => (
                <Link
                  key={post.id}
                  to={post.fields.slug}
                  className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-playfair font-medium text-gray-900 mb-2">
                    {post.frontmatter.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.frontmatter.publishedAt}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.frontmatter.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.frontmatter.tags.map((tag: string) => (
                      <Topic
                        key={tag}
                        tag={tag}
                        className="text-xs"
                      />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
};

export const query = graphql`
  query PostQuery($id: String!, $tags: [String!]!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        publishedAt(formatString: "MMMM DD, YYYY")
        summary
        label
        tags
      }
      fields {
        slug
      }
    }
    relatedPosts: allMdx(
      filter: {
        frontmatter: { tags: { in: $tags } }
        id: { ne: $id }
      }
      sort: { frontmatter: { publishedAt: DESC } }
      limit: 4
    ) {
      nodes {
        id
        frontmatter {
          title
          publishedAt(formatString: "MMMM DD, YYYY")
          summary
          tags
        }
        fields {
          slug
        }
      }
    }
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;

export default PostTemplate; 