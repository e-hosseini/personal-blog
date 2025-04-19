import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import { StaticImage } from 'gatsby-plugin-image';

// Import the constant from gatsby-node.js
const POSTS_PER_PAGE = 10;

interface BlogListTemplateProps {
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
      totalCount: number;
    };
  };
  pageContext: {
    currentPage: number;
    numPages: number;
    limit: number;
    skip: number;
  };
}

const BlogListTemplate: React.FC<BlogListTemplateProps> = ({ data, pageContext }) => {
  const posts = data.allMdx.nodes;
  const { currentPage, numPages, limit, skip } = pageContext;

  // Debug logging
  console.log('Pagination Debug:', {
    currentPage,
    numPages,
    limit,
    skip,
    totalPosts: data.allMdx.totalCount,
    currentPosts: posts.length,
    shouldShowPagination: numPages > 1
  });

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/articles' : `/articles/page/${currentPage - 1}`;
  const nextPage = `/articles/page/${currentPage + 1}`;

  // Always show pagination if there are multiple pages
  const showPagination = numPages > 1;

  return (
    <Layout
      title={`Articles${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
      description="Articles about software engineering, web development, and technology."
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
  
        <h2 className="text-4xl font-bold mb-8">Articles</h2>
        
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
                        className="mr-2 hover:text-blue-600"
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

        {showPagination && (
          <nav className="mt-12 flex justify-between items-center">
            {!isFirst && (
              <Link
                to={prevPage}
                rel="prev"
                className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600 hover:text-gray-900 hover:shadow-md transition-all"
              >
                ← Previous Page
              </Link>
            )}
            <div className="flex-1 text-center">
              {Array.from({ length: numPages }, (_, i) => (
                <Link
                  key={`pagination-number${i + 1}`}
                  to={i === 0 ? '/articles' : `/articles/page/${i + 1}`}
                  className={`mx-1 px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600 hover:text-gray-900 hover:shadow-md transition-all"
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
  query BlogListQuery($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { frontmatter: { publishedAt: DESC } }
      filter: { internal: { contentFilePath: { regex: "/src/posts/" } } }
      limit: $limit
      skip: $skip
    ) {
      totalCount
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

export default BlogListTemplate; 