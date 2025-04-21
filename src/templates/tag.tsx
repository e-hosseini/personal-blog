import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Topic from '../components/Topic';

interface TopicTemplateProps {
  data: {
    allMdx: {
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
  };
  pageContext: {
    originalTag: string;
    currentPage: number;
    numPages: number;
    limit: number;
    skip: number;
  };
}

const TopicTemplate: React.FC<TopicTemplateProps> = ({ data, pageContext }) => {
  const { originalTag, currentPage, numPages } = pageContext;
  const posts = data.allMdx.nodes;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const normalizedTag = originalTag.toLowerCase().replace(/\s+/g, '-');
  const prevPage = currentPage - 1 === 1 
    ? `/tags/${normalizedTag}` 
    : `/tags/${normalizedTag}/page/${currentPage - 1}`;
  const nextPage = `/tags/${normalizedTag}/page/${currentPage + 1}`;

  if (posts.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/tags" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to all topics
            </Link>
            <h1 className="text-4xl font-bold">No posts found for topic "{originalTag}"</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Posts about "${originalTag}"${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
      description={`Browse all posts about ${originalTag}`}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/tags" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to all topics
          </Link>
          <h1 className="text-3xl font-montserrat font-medium mb-4">Posts about "{originalTag}"</h1>
        </div>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-gray-100 dark:border-gray-800 pb-6">
            <Link to={post.fields.slug} className="block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
              <h2 className="text-xl font-montserrat font-medium text-gray-900 dark:text-gray-100 mb-2">{post.frontmatter.title}</h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="mr-3">{post.frontmatter.publishedAt}</span>
                <div className="flex flex-wrap gap-1">
                  {post.frontmatter.tags.map((tag) => (
                    <Topic
                      key={tag}
                      tag={tag}
                      isActive={tag === originalTag}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{post.frontmatter.summary}</p>
            </Link>
          </article>
          ))}
        </div>

        {numPages > 1 && (
          <nav className="mt-12 flex justify-between items-center">
            {!isFirst && (
              <Link
                to={prevPage}
                rel="prev"
                className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600 hover:text-gray-900"
              >
                ← Previous Page
              </Link>
            )}
            <div className="flex-1 text-center">
              {Array.from({ length: numPages }, (_, i) => (
                <Link
                  key={`pagination-number${i + 1}`}
                  to={i === 0 ? `/tags/${normalizedTag}` : `/tags/${normalizedTag}/page/${i + 1}`}
                  className={`mx-1 px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
            {!isLast && (
              <Link
                to={nextPage}
                rel="next"
                className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600 hover:text-gray-900"
              >
                Next Page →
              </Link>
            )}
          </nav>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query TopicPostsQuery($originalTag: String!, $skip: Int!, $limit: Int!) {
    allMdx(
      sort: { frontmatter: { publishedAt: DESC } }
      filter: { frontmatter: { tags: { in: [$originalTag] } } }
      limit: $limit
      skip: $skip
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
  }
`;

export default TopicTemplate; 