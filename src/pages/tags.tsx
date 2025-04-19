import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

interface TagsPageProps {
  data: {
    allMdx: {
      group: Array<{
        fieldValue: string;
        totalCount: number;
      }>;
    };
  };
}

const TagsPage: React.FC<TagsPageProps> = ({ data }) => {
  const tagGroups = data?.allMdx?.group || [];

  // Function to normalize tag for URL
  const normalizeTag = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  if (tagGroups.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Tags</h1>
          <p className="text-gray-600">No tags found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Tags</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tagGroups.map((tagGroup) => (
            <Link
              key={tagGroup.fieldValue}
              to={`/tags/${normalizeTag(tagGroup.fieldValue)}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {tagGroup.fieldValue}
              </h2>
              <p className="text-gray-600 mt-2">
                {tagGroup.totalCount} {tagGroup.totalCount === 1 ? 'post' : 'posts'}
              </p>
            </Link>
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

export default TagsPage; 