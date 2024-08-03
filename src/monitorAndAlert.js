const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { sendAlert } = require('./emailService');

let lastProcessedLine = 0;

function fetchDataFromFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8').trim().split('\n');
  return data;
}

function calculateLowPercentage(data) {
  const lowCount = data.filter(line => {
    try {
      const panel = JSON.parse(line);
      return panel.grade === 'low';
    } catch (err) {
      console.error('Error parsing line:', err);
      return false;
    }
  }).length;

  const totalCount = data.length;
  return (lowCount / totalCount) * 100 || 0;
}

async function monitor() {
  const filePath = path.join(__dirname, '../data/panel_quality_data.txt');
  const threshold = 10; // Set your threshold percentage

  const data = fetchDataFromFile(filePath);
  const newData = data.slice(lastProcessedLine);
  lastProcessedLine = data.length; // Update last processed line index

  if (newData.length > 0) {
    const lowPercentage = calculateLowPercentage(newData);

    if (lowPercentage > threshold) {
      await sendAlert(lowPercentage);
      console.log(`Alert sent! Low-grade panel percentage: ${lowPercentage.toFixed(2)}%`);
    } else {
      console.log(`No alert needed. Low-grade panel percentage: ${lowPercentage.toFixed(2)}%`);
    }
  } else {
    console.log('No new data to process.');
  }
}

function scheduleMonitoring() {
  cron.schedule('* * * * *', () => {  // Every minute
    console.log('Running monitoring task');
    monitor();
  });
}

scheduleMonitoring();