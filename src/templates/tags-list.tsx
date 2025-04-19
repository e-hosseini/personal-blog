import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Topic from '../components/Topic';

interface TopicsListTemplateProps {
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

const TopicsListTemplate: React.FC<TopicsListTemplateProps> = ({ data, pageContext }) => {
  const { group: topics } = data.allMdx;
  const { currentPage, numPages } = pageContext;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/tags' : `/tags/page/${currentPage - 1}`;
  const nextPage = `/tags/page/${currentPage + 1}`;

  // Function to normalize topic for URL
  const normalizeTopic = (topic: string) => topic.toLowerCase().replace(/\s+/g, '-');

  return (
    <Layout
      title={`Topics${currentPage > 1 ? ` - Page ${currentPage}` : ''}`}
      description="Browse all topics"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-montserrat font-medium mb-8">Topics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.fieldValue}
              to={`/tags/${normalizeTopic(topic.fieldValue)}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">{topic.fieldValue}</span>
                <span className="text-sm text-gray-500">
                  {topic.totalCount} {topic.totalCount === 1 ? 'post' : 'posts'}
                </span>
              </div>
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
  query TopicsListQuery($skip: Int!, $limit: Int!) {
    allMdx {
      group(field: { frontmatter: { tags: SELECT } }, limit: $limit, skip: $skip) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default TopicsListTemplate; 