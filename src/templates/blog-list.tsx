import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Topic from '../components/Topic';

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
  const { nodes: posts } = data.allMdx;
  const { currentPage, numPages } = pageContext;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/articles' : `/articles/page/${currentPage - 1}`;
  const nextPage = `/articles/page/${currentPage + 1}`;

  return (
    <Layout
      title={`Articles${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
      description="Browse all articles"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-montserrat font-medium mb-8">Articles</h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-gray-100 pb-6">
              <Link to={post.fields.slug} className="block">
                <h2 className="text-xl font-montserrat font-medium text-gray-900 mb-2">{post.frontmatter.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="mr-3">{post.frontmatter.publishedAt}</span>
                  <div className="flex flex-wrap gap-1">
                    {post.frontmatter.tags.map((tag) => (
                      <Topic
                        key={tag}
                        tag={tag}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{post.frontmatter.summary}</p>
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
                  to={i === 0 ? '/articles' : `/articles/page/${i + 1}`}
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
  query($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { frontmatter: { publishedAt: DESC } }
      limit: $limit
      skip: $skip
      filter: { internal: { contentFilePath: { regex: "/src/posts/" } } }
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

export default BlogListTemplate; 