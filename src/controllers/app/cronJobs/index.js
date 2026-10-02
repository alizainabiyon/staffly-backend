const cron = require('node-cron');

const { scheduleSalaryGeneration } = require('./salaryGenerationCronJob');

cron.schedule('1 0 1 * *', scheduleSalaryGeneration);
