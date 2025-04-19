const siteMetadata = {
  title: `Ehsan Hosseini`,
  siteUrl: `https://ehosseini.info/`,
  description: `Tech Lead & Staff Software Engineer`,
  author: `Ehsan`,
};

module.exports = {
  siteMetadata,
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                author
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map(node => {
                return Object.assign({}, {
                  title: node.frontmatter.title,
                  description: node.frontmatter.summary,
                  date: node.frontmatter.publishedAt,
                  url: site.siteMetadata.siteUrl + '/' + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + '/' + node.fields.slug,
                  author: site.siteMetadata.author,
                  custom_elements: [
                    { "content:encoded": node.frontmatter.summary },
                    { "tags": node.frontmatter.tags?.join(',') || '' }
                  ]
                });
              });
            },
            query: `
              {
                allMdx(
                  sort: { frontmatter: { publishedAt: DESC } }
                  filter: { internal: { contentFilePath: { regex: "/src/posts/" } } }
                ) {
                  nodes {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      publishedAt
                      summary
                      tags
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Ehsan Hosseini's Blog",
            match: "^/blog/",
            link: "https://ehosseini.info/blog",
          },
          // Tag-specific feeds
          ...['frontend', 'backend', 'architecture', 'devops', 'accessibility', 'security', 'seo'].map(tag => ({
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map(node => {
                return Object.assign({}, {
                  title: node.frontmatter.title,
                  description: node.frontmatter.summary,
                  date: node.frontmatter.publishedAt,
                  url: site.siteMetadata.siteUrl + '/' + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + '/' + node.fields.slug,
                  author: site.siteMetadata.author,
                  custom_elements: [
                    { "content:encoded": node.frontmatter.summary },
                    { "tags": node.frontmatter.tags?.join(',') || '' }
                  ]
                });
              });
            },
            query: `
              {
                allMdx(
                  sort: { frontmatter: { publishedAt: DESC } }
                  filter: { 
                    frontmatter: { tags: { in: ["${tag}"] } }
                    internal: { contentFilePath: { regex: "/src/posts/" } }
                  }
                ) {
                  nodes {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      publishedAt
                      summary
                      tags
                    }
                  }
                }
              }
            `,
            output: `/rss/${tag}.xml`,
            title: `Ehsan Hosseini's Blog - ${tag}`,
            match: `^/blog/${tag}/`,
            link: `https://ehosseini.info/blog/${tag}`,
          })),
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-XXXXXXXXXX", // Replace with your Google Analytics tracking ID
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Ehsan Hosseini',
        short_name: 'Ehsan',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        display: 'standalone',
        icon: 'src/images/ehsan-hosseini.png',
        icons: [
          {
            src: 'src/images/ehsan-hosseini.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'src/images/ehsan-hosseini.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
  ],
} 