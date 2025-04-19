const path = require('path');
const fs = require('fs');
const { createFilePath } = require('gatsby-source-filesystem');

// Log MDX files for debugging
exports.onPreInit = ({ reporter }) => {
  reporter.info('Checking for MDX files in src/posts directory');
  
  const postsDir = path.join(__dirname, 'src', 'posts');
  
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    reporter.info(`Found ${files.length} files in src/posts:`);
    files.forEach(file => {
      reporter.info(` - ${file}`);
    });
  } else {
    reporter.warn('src/posts directory does not exist');
  }
};

// Define the number of posts per page
const POSTS_PER_PAGE = 10;

// Create slugs for MDX files
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value: `/articles${value}`,
    });
  }
};

// Create pages for each MDX file and tag
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/src/posts/" } } }
        sort: { frontmatter: { publishedAt: DESC } }
      ) {
        nodes {
          id
          internal {
            contentFilePath
          }
          fields {
            slug
          }
          frontmatter {
            tags
            publishedAt
          }
        }
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error loading MDX files', result.errors);
    return;
  }

  const posts = result.data.allMdx.nodes;
  const tags = result.data.allMdx.group;

  // Create blog post pages
  posts.forEach((post, index) => {
    createPage({
      path: post.fields.slug,
      component: `${path.resolve(`./src/templates/post.tsx`)}?__contentFilePath=${post.internal.contentFilePath}`,
      context: {
        id: post.id,
        tags: post.frontmatter.tags,
        previous: index === posts.length - 1 ? null : posts[index + 1],
        next: index === 0 ? null : posts[index - 1],
      },
    });
  });

  // Create paginated blog list pages
  const numPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? '/articles' : `/articles/page/${i + 1}`,
      component: path.resolve('./src/templates/blog-list.tsx'),
      context: {
        limit: POSTS_PER_PAGE,
        skip: i * POSTS_PER_PAGE,
        numPages,
        currentPage: i + 1,
      },
    });
  });

  // Create tag pages with pagination
  tags.forEach(tag => {
    const tagPosts = posts.filter(post => 
      post.frontmatter.tags.includes(tag.fieldValue)
    );
    const tagNumPages = Math.ceil(tagPosts.length / POSTS_PER_PAGE);
    
    Array.from({ length: tagNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 
          ? `/tags/${tag.fieldValue.toLowerCase().replace(/\s+/g, '-')}` 
          : `/tags/${tag.fieldValue.toLowerCase().replace(/\s+/g, '-')}/page/${i + 1}`,
        component: path.resolve('./src/templates/tag.tsx'),
        context: {
          originalTag: tag.fieldValue,
          limit: POSTS_PER_PAGE,
          skip: i * POSTS_PER_PAGE,
          numPages: tagNumPages,
          currentPage: i + 1,
        },
      });
    });
  });

  // Create paginated tags list page
  const tagsPerPage = 24;
  const tagsNumPages = Math.ceil(tags.length / tagsPerPage);
  Array.from({ length: tagsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? '/tags' : `/tags/page/${i + 1}`,
      component: path.resolve('./src/templates/tags-list.tsx'),
      context: {
        limit: tagsPerPage,
        skip: i * tagsPerPage,
        numPages: tagsNumPages,
        currentPage: i + 1,
      },
    });
  });
};

// Schema customization to ensure GraphQL fields are properly defined
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
      fields: MdxFields!
    }
    
    type MdxFields {
      slug: String!
    }
    
    type MdxFrontmatter {
      title: String!
      publishedAt: Date! @dateformat
      summary: String!
      label: String
      tags: [String!]!
    }
  `);
}; 