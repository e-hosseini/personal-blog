const path = require('path');
const fs = require('fs');

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

// Posts per page
const POSTS_PER_PAGE = 10;

// Create slug field for MDX files
exports.onCreateNode = ({ node, getNode, actions, reporter }) => {
  const { createNodeField } = actions;
  
  // We only want to operate on MDX nodes
  if (node.internal.type === 'Mdx') {
    reporter.info(`Processing MDX node: ${node.id}`);
    
    // For debugging
    reporter.info(`Node internal type: ${node.internal.type}`);
    reporter.info(`Node contentFilePath: ${node.internal.contentFilePath || 'undefined'}`);
    
    // Get the parent node (file node)
    const parent = getNode(node.parent);
    
    if (!parent) {
      reporter.warn(`No parent found for MDX node: ${node.id}`);
      return;
    }
    
    reporter.info(`Parent node: ${parent.id}, type: ${parent.internal.type}`);
    
    // Create slug from filename
    let slug;
    
    if (parent.internal.type === 'File') {
      slug = parent.name;
      reporter.info(`Creating slug '${slug}' from file name`);
    } else {
      slug = path.basename(node.internal.contentFilePath || '', path.extname(node.internal.contentFilePath || ''));
      reporter.info(`Creating slug '${slug}' from content file path`);
    }
    
    createNodeField({
      node,
      name: 'slug',
      value: slug
    });
    
    reporter.info(`Created slug field for node ${node.id}: ${slug}`);
  }
};

// Create pages for each MDX file and tag
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  reporter.info('Creating pages for MDX files and tags');

  const result = await graphql(`
    query {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/src/posts/" } } }
      ) {
        totalCount
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
      allFile {
        totalCount
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error loading MDX files', result.errors);
    return;
  }

  const posts = result.data.allMdx.nodes;
  const totalPosts = result.data.allMdx.totalCount;
  const tags = result.data.allMdx.group;
  const totalFiles = result.data.allFile.totalCount;

  // Create blog post pages
  posts.forEach((post) => {
    createPage({
      path: post.fields.slug,
      component: `${path.resolve('./src/templates/post.tsx')}?__contentFilePath=${post.internal.contentFilePath}`,
      context: {
        id: post.id,
      },
    });
  });

  // Create paginated blog list pages
  const numPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  reporter.info(`Creating ${numPages} paginated pages for articles`);
  
  // Create redirect from /article to /articles
  createPage({
    path: '/article',
    component: require.resolve('./src/templates/blog-list.tsx'),
    context: {
      limit: POSTS_PER_PAGE,
      skip: 0,
      numPages,
      currentPage: 1,
    },
  });
  
  Array.from({ length: numPages }).forEach((_, i) => {
    const path = i === 0 ? '/articles' : `/articles/page/${i + 1}`;
    reporter.info(`Creating page: ${path}`);
    
    createPage({
      path,
      component: require.resolve('./src/templates/blog-list.tsx'),
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