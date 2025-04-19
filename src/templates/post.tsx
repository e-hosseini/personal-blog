import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet';
import Layout from '../components/layout';
import { Link } from 'gatsby';

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: summary,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: 'Ehsan',
    },
    publisher: {
      '@type': 'Organization',
      name: data.site.siteMetadata.title,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
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

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4">{publishedAt}</span>
            <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">
              {tags?.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="mr-2 hover:text-blue-600"
                >
                  {tag}
                </Link>
              ))}
            </span>
          </div>
          <p className="text-xl text-gray-700">{summary}</p>
        </header>
        <div className="prose prose-lg max-w-none">
          <MDXProvider components={components}>{children}</MDXProvider>
        </div>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query PostQuery($id: String!) {
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
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;

export default PostTemplate; 