import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Topic from '../components/Topic';

interface TopicsPageProps {
  data: {
    allMdx: {
      group: Array<{
        fieldValue: string;
        totalCount: number;
      }>;
    };
  };
}

const TopicsPage: React.FC<TopicsPageProps> = ({ data }) => {
  const topicGroups = data?.allMdx?.group || [];

  if (topicGroups.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Topics</h1>
          <p className="text-gray-600">No topics found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Topics</h1>
        
        <div className="flex flex-wrap gap-3">
          {topicGroups.map((topicGroup) => (
            <Topic
              key={topicGroup.fieldValue}
              tag={topicGroup.fieldValue}
              count={topicGroup.totalCount}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default TopicsPage; 