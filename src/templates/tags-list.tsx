import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

interface TagsListTemplateProps {
  data: {
    allMdx: {
      group: Array<{
        fieldValue: string;
        totalCount: number;
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

const TagsListTemplate: React.FC<TagsListTemplateProps> = ({ data, pageContext }) => {
  const { group: tags } = data.allMdx;
  const { currentPage, numPages } = pageContext;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/tags' : `/tags/page/${currentPage - 1}`;
  const nextPage = `/tags/page/${currentPage + 1}`;

  // Function to normalize tag for URL
  const normalizeTag = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  return (
    <Layout
      title={`Tags${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
      description="Browse all tags and categories"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Tags</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.fieldValue}
              to={`/tags/${normalizeTag(tag.fieldValue)}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {tag.fieldValue}
              </h2>
              <p className="text-gray-600 mt-2">
                {tag.totalCount} {tag.totalCount === 1 ? 'post' : 'posts'}
              </p>
            </Link>
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
                  to={i === 0 ? '/tags' : `/tags/page/${i + 1}`}
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
  query TagsListQuery($skip: Int!, $limit: Int!) {
    allMdx {
      group(field: { frontmatter: { tags: SELECT } }, limit: $limit, skip: $skip) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default TagsListTemplate; 