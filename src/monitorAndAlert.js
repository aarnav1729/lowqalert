const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { sendAlert } = require('./emailService');

function fetchDataFromFile(filePath, timeWindowMinutes = 60) {
  const data = fs.readFileSync(filePath, 'utf8').trim().split('\n').map(line => JSON.parse(line));
  const currentTime = new Date();
  const timeThreshold = new Date(currentTime.getTime() - timeWindowMinutes * 60000);

  return data.filter(entry => new Date(entry.timestamp) > timeThreshold);
}

function calculateLowPercentage(data) {
  const lowCount = data.filter(panel => panel.grade === 'low').length;
  const totalCount = data.length;
  return (lowCount / totalCount) * 100 || 0;
}

async function monitor() {
  const filePath = path.join(__dirname, '../data/panel_quality_data.txt');
  const threshold = 10; 

  const data = fetchDataFromFile(filePath);
  const lowPercentage = calculateLowPercentage(data);

  if (lowPercentage > threshold) {
    await sendAlert(lowPercentage);
    console.log(`Alert sent! Low-grade panel percentage: ${lowPercentage.toFixed(2)}%`);
  } else {
    console.log(`No alert needed. Low-grade panel percentage: ${lowPercentage.toFixed(2)}%`);
  }
}

function scheduleMonitoring() {
    cron.schedule('* * * * *', () => {  // Every minute
        console.log('Running monitoring task');
        monitor();
      });
      
}

scheduleMonitoring();