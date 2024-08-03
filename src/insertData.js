const fs = require('fs');
const path = require('path');

function generateSampleData() {
  const grades = ['high', 'medium', 'low'];
  const data = [];
  
  // Generate a batch of 10 panels with random grades
  for (let i = 0; i < 10; i++) {
    data.push({
      timestamp: new Date().toISOString(),  // Current timestamp
      grade: grades[Math.floor(Math.random() * grades.length)]  // Randomly select a grade
    });
  }
  return data;
}

function writeDataToFile(filePath, data) {
  const dataString = data.map(entry => JSON.stringify(entry)).join('\n') + '\n';
  fs.appendFileSync(filePath, dataString, 'utf8');  // Append data to the file
}

function main() {
  const filePath = path.join(__dirname, '../data/panel_quality_data.txt');
  setInterval(() => {
    const data = generateSampleData();
    writeDataToFile(filePath, data);
    console.log(`Inserted ${data.length} records into ${filePath}.`);
  }, 60000); // Run every minute
}

main();