import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import { StaticImage } from 'gatsby-plugin-image';

interface IndexPageProps {
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
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const posts = data.allMdx.nodes;

  return (
    <Layout
      title="Home"
      description="Senior Software Engineer and Technical Advisor with 15+ years of experience"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-8">About Me</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                Senior Software Engineer and Technical Advisor with 15+ years of experience in analysis, 
                design, development, testing, and implementation of internet-based applications. 
                As a team lead, consultant, and solution provider, I help businesses overcome technical 
                challenges and create innovative solutions.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/e-hosseini"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/ehsan-hosseini-a92a676b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full overflow-hidden">
                <StaticImage
                  src="../images/ehsan-hosseini.png"
                  alt="Ehsan Hosseini"
                  className="w-full h-full object-cover"
                  placeholder="blurred"
                  width={192}
                  height={192}
                  quality={95}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4">Latest Articles</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm">
                <Link to={`/${post.fields.slug}`} className="block">
                  <h3 className="text-xl font-bold text-gray-900">{post.frontmatter.title}</h3>
                  <div className="flex items-center text-gray-600 mt-2">
                    <span className="mr-4">{post.frontmatter.publishedAt}</span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                      {post.frontmatter.tags.map((tag) => (
                        <span key={tag} className="mr-2">{tag}</span>
                      ))}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/articles"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(
      sort: { frontmatter: { publishedAt: DESC } }
      limit: 10
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
  }
`;

export default IndexPage;
