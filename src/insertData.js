const fs = require('fs');
const path = require('path');

function generateSampleData() {
  const grades = ['high', 'medium', 'low'];
  const data = [];
  
  for (let i = 0; i < 10; i++) {
    data.push({
      timestamp: new Date().toISOString(),  
      grade: grades[Math.floor(Math.random() * grades.length)]  
    });
  }
  return data;
}

function writeDataToFile(filePath, data) {
  const dataString = data.map(entry => JSON.stringify(entry)).join('\n') + '\n';
  fs.appendFileSync(filePath, dataString, 'utf8'); 
}

function main() {
  const filePath = path.join(__dirname, '../data/panel_quality_data.txt');
  setInterval(() => {
    const data = generateSampleData();
    writeDataToFile(filePath, data);
    console.log(`Inserted ${data.length} records into ${filePath}.`);
  }, 60000);
}

main();