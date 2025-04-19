const fs = require('fs');
const path = require('path');

// Function to generate a random date between 2022 and now
function randomDate(start = new Date(2022, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Directory containing MDX files
const postsDir = path.join(__dirname, 'src', 'posts');

// Read all MDX files
fs.readdir(postsDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.filter(file => file.endsWith('.mdx')).forEach((file, index) => {
    const filePath = path.join(postsDir, file);
    
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error(`Error reading ${file}:`, err);
        return;
      }

      // Generate a date with some spacing between posts
      const date = new Date(2022, 0, 1);
      date.setDate(date.getDate() + (index * 7)); // Space posts 1 week apart
      
      // Replace the publishedAt date
      const newContent = content.replace(
        /publishedAt: .*"/,
        `publishedAt: "${formatDate(date)}"`
      );

      fs.writeFile(filePath, newContent, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing ${file}:`, err);
          return;
        }
        console.log(`Updated ${file} with date ${formatDate(date)}`);
      });
    });
  });
}); 