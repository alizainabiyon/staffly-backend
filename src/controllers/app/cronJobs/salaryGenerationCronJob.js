const cron = require('node-cron');
const SalaryModel = require('../../../models/mongodb/app/Salary.model');

// Function to generate salary for all employees
const generateSalaryForAllEmployees = async () => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();
    
    // Calculate previous month
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    console.log(`Starting automatic salary generation for ${previousMonth}/${previousYear}`);
    
    // Get all active employees (we'll need to handle userID differently for cron jobs)
    // For now, we'll generate for all active employees across all users
    const { success, message, data } = await SalaryModel.generateSalaryOfAllEmployees({
      userID: 'system', // Special userID for system-generated salaries
      month: previousMonth,
      year: previousYear
    });
    
    if (success) {
      console.log(`Salary generation completed successfully: ${message}`);
      if (data && data.generatedSalaries) {
        console.log(`Generated ${data.generatedSalaries.length} salaries`);
      }
      if (data && data.errors && data.errors.length > 0) {
        console.log(`Errors encountered: ${data.errors.length}`);
        data.errors.forEach(error => console.log(`- ${error}`));
      }
    } else {
      console.error(`Salary generation failed: ${message}`);
    }
  } catch (error) {
    console.error('Error in salary generation cron job:', error);
  }
};

// Schedule the cron job to run at 00:01 on the 1st of every month
const scheduleSalaryGeneration = () => {
  cron.schedule('1 0 1 * *', () => {
    console.log('Running scheduled salary generation...');
    generateSalaryForAllEmployees();
  }, {
    scheduled: true,
    timezone: "UTC" // You can change this to your preferred timezone
  });
  
  console.log('Salary generation cron job scheduled for 1st of every month at 00:01 UTC');
};

module.exports = {
  scheduleSalaryGeneration,
  generateSalaryForAllEmployees
}; 