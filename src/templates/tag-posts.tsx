import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Topic from '../components/Topic';

interface TagPostsTemplateProps {
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
    tag: string;
  };
}

const TagPostsTemplate: React.FC<TagPostsTemplateProps> = ({ data, pageContext }) => {
  const { nodes: posts } = data.allMdx;
  const currentTag = pageContext.tag;

  return (
    <Layout
      title={`Articles tagged with "${currentTag}"`}
      description={`Browse all articles tagged with ${currentTag}`}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-montserrat font-medium text-gray-900 dark:text-gray-100 mb-8">
          Articles tagged with "{currentTag}"
        </h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link to={post.fields.slug} className="block hover:bg-gray-50/50 dark:hover:bg-gray-700/50 p-4 rounded-lg transition-colors duration-200">
                <h2 className="text-xl font-montserrat font-medium text-gray-900 dark:text-gray-100 mb-2">{post.frontmatter.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="mr-3">{post.frontmatter.publishedAt}</span>
                  <div className="flex flex-wrap gap-1">
                    {post.frontmatter.tags.map((tag) => (
                      <Topic
                        key={tag}
                        tag={tag}
                        isActive={tag.toLowerCase() === currentTag}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{post.frontmatter.summary}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($tag: String!) {
    allMdx(
      sort: { frontmatter: { publishedAt: DESC } }
      filter: { 
        frontmatter: { tags: { in: [$tag] } }
        internal: { contentFilePath: { regex: "/src/posts/" } }
      }
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

export default TagPostsTemplate; 