const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const nextDir = path.resolve(__dirname, '../.next');
const yalcDir = path.resolve(__dirname, '../.yalc');
const nodeModulesDir = path.resolve(__dirname, '../node_modules');
const packageName = '@wavemaker-ai/react-runtime'; // Replace with your actual package name

// Function to delete a directory recursively
const deleteDirectory = dirPath => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file);
      if (fs.statSync(curPath).isDirectory()) {
        deleteDirectory(curPath); // Recurse
      } else {
        fs.unlinkSync(curPath); // Delete file
      }
    });
    fs.rmdirSync(dirPath); // Remove directory
  }
};

// Function to execute shell commands
const execCommand = command => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

// Main function
const main = () => {
  try {
    // Step 1: Clean up old directories (node_modules, .next, .yalc)
    console.log('Cleaning up old directories...');
    deleteDirectory(nextDir); // Clean .next
    deleteDirectory(yalcDir); // Clean .yalc
    deleteDirectory(path.join(nodeModulesDir, packageName)); // Clean specific package from node_modules

    // Step 2: Run yalc update to sync the latest version
    console.log('Running yalc update...');
    execCommand(`yalc add ${packageName}`);
  } catch (error) {
    console.error('Failed to clean and update:', error);
    process.exit(1);
  }
};

main();
