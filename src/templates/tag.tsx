import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

interface TagTemplateProps {
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

const TagTemplate: React.FC<TagTemplateProps> = ({ data, pageContext }) => {
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
              ← Back to all tags
            </Link>
            <h1 className="text-4xl font-bold">No posts found for tag "{originalTag}"</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Posts tagged with "${originalTag}"${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
      description={`Browse all posts tagged with ${originalTag}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/tags" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to all tags
          </Link>
          <h1 className="text-4xl font-bold">Posts tagged with "{originalTag}"</h1>
        </div>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white p-6 rounded-lg shadow-sm">
              <Link to={`/${post.fields.slug}`} className="block">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.frontmatter.title}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="mr-4">{post.frontmatter.publishedAt}</span>
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                    {post.frontmatter.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`mr-2 hover:text-blue-600 ${
                          tag === originalTag ? 'text-blue-600' : ''
                        }`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </span>
                </div>
                <p className="text-gray-700">{post.frontmatter.summary}</p>
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
  query TagPostsQuery($originalTag: String!, $skip: Int!, $limit: Int!) {
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

export default TagTemplate; 