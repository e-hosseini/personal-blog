const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `You are a PhD computer science expert specializing in JavaScript and frontend development, with extensive experience leading large-scale projects. Please review and enhance this article to make it read like a section from a technical book, providing deep insights and comprehensive understanding. The target audience consists of very experienced developers. Maintain the MDX format and ensure the content is technically accurate and thorough. Explain everything in detail. Explain all the examples in detail. Explain every bullet point in detail. Make sure to include all the code examples and code blocks. Explain the background of the code and the concepts in detail. the article should be 1000 words or more. The tone should be friendly and like a workshop talk.`;

async function enhanceMDX(filePath) {
  console.log('\n=== Starting MDX Enhancement Process ===');
  console.log(`Processing file: ${filePath}`);
  
  let originalContent = null;
  let draftFilePath = null;
  
  try {
    // Read the MDX file
    console.log('Reading file content...');
    originalContent = fs.readFileSync(filePath, 'utf8');
    console.log('File content read successfully');
    
    // Call OpenAI API
    console.log('Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: originalContent
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }).catch(error => {
      console.error('OpenAI API Error:', error.message);
      if (error.response) {
        console.error('API Response:', error.response.data);
      }
      throw new Error(`OpenAI API call failed: ${error.message}`);
    });
    
    console.log('OpenAI API call completed successfully');

    // Get the enhanced content
    const enhancedContent = completion.choices[0].message.content;
    if (!enhancedContent) {
      throw new Error('No content received from OpenAI API');
    }
    console.log('Received enhanced content from OpenAI');

    // Create new file name
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    
    // Rename original file to draft
    draftFilePath = path.join(dir, `${baseName}.draft${ext}`);
    console.log(`Renaming original file to draft: ${draftFilePath}`);
    fs.renameSync(filePath, draftFilePath);
    
    // Write the enhanced content to the original file path
    console.log(`Writing enhanced content to: ${filePath}`);
    fs.writeFileSync(filePath, enhancedContent);
    console.log('Enhanced content written successfully');
    console.log('=== MDX Enhancement Process Completed ===\n');

  } catch (error) {
    console.error('\n=== Error Occurred ===');
    console.error('Error details:', error.message);
    
    // If we have the original content and haven't renamed the file yet
    if (originalContent && !draftFilePath) {
      console.log('Restoring original file...');
      fs.writeFileSync(filePath, originalContent);
      console.log('Original file restored');
    }
    
    // If we renamed the file but failed to write the enhanced content
    if (draftFilePath && fs.existsSync(draftFilePath)) {
      console.log('Restoring from draft file...');
      fs.renameSync(draftFilePath, filePath);
      console.log('File restored from draft');
    }
    
    console.error('Stack trace:', error.stack);
    console.error('=== Process Terminated ===\n');
    process.exit(1);
  }
}

// Find MDX files that don't have draft versions
function findMDXFilesToProcess() {
  console.log('Scanning for MDX files...');
  const contentDir = path.join(process.cwd(), 'src', 'posts');
  
  try {
    const files = fs.readdirSync(contentDir);
    
    // Filter out files that already have draft versions
    const mdxFiles = files.filter(file => {
      if (!file.endsWith('.mdx') || file.includes('draft')) return false;
      const baseName = file.replace('.mdx', '');
      return !files.includes(`${baseName}.draft.mdx`);
    });
    
    if (mdxFiles.length === 0) {
      console.log('No new MDX files found to process');
      process.exit(0);
    }
    
    console.log(`Found ${mdxFiles.length} MDX files to process`);
    return mdxFiles.map(file => path.join(contentDir, file));
  } catch (error) {
    console.error('Error scanning directory:', error.message);
    process.exit(1);
  }
}

// Main execution
console.log('Starting MDX enhancement script...');
const filesToProcess = findMDXFilesToProcess();

// Process files sequentially to ensure proper error handling
async function processFiles() {
  for (const filePath of filesToProcess) {
    console.log(`\nProcessing file: ${filePath}`);
    await enhanceMDX(filePath);
  }
}

processFiles().catch(error => {
  console.error('Fatal error during file processing:', error.message);
  process.exit(1);
}); 