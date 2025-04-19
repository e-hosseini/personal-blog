import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';

interface DebugTemplateProps {
  data: {
    allMdx: {
      nodes: Array<{
        id: string;
        frontmatter: {
          title: string;
          publishedAt: string;
          tags: string[];
        };
        fields: {
          slug: string;
        };
      }>;
    };
    allFile: {
      nodes: Array<{
        id: string;
        relativePath: string;
        prettySize: string;
        birthTime: string;
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

const DebugTemplate: React.FC<DebugTemplateProps> = ({ data, pageContext }) => {
  const { currentPage, numPages } = pageContext;
  const mdxFiles = data.allMdx.nodes;
  const allFiles = data.allFile.nodes;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/debug' : `/debug/page/${currentPage - 1}`;
  const nextPage = `/debug/page/${currentPage + 1}`;

  return (
    <Layout
      title={`Debug Info - Page ${currentPage}`}
      description="Debug information showing all files and MDX posts"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Debug Information</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">MDX Files</h2>
          <div className="space-y-4">
            {mdxFiles.map((file) => (
              <div key={file.id} className="bg-white p-4 rounded-lg shadow-sm">
                <Link to={`/${file.fields.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  {file.frontmatter.title}
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  <span>Published: {file.frontmatter.publishedAt}</span>
                  <span className="mx-2">•</span>
                  <span>Tags: {file.frontmatter.tags.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">All Files</h2>
          <div className="space-y-4">
            {allFiles.map((file) => (
              <div key={file.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-mono text-sm">{file.relativePath}</div>
                <div className="text-sm text-gray-600 mt-1">
                  <span>Size: {file.prettySize}</span>
                  <span className="mx-2">•</span>
                  <span>Created: {file.birthTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                to={i === 0 ? '/debug' : `/debug/page/${i + 1}`}
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
      </div>
    </Layout>
  );
};

export const query = graphql`
  query DebugTemplateQuery($skip: Int!, $limit: Int!) {
    allMdx(
      sort: { frontmatter: { publishedAt: DESC } }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        id
        frontmatter {
          title
          publishedAt(formatString: "MMMM DD, YYYY")
          tags
        }
        fields {
          slug
        }
      }
    }
    allFile(
      sort: { birthTime: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        id
        relativePath
        prettySize
        birthTime(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;

export default DebugTemplate; 