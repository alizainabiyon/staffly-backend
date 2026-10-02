const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const libre = require('libreoffice-convert');
const axios = require('axios');

const { Expense: ExpenseSchema } = require("../../../schemas/mongoDB/App/expense.schema");
const { Employee: EmployeeSchema } = require("../../../schemas/mongoDB/App/employee.schema");
const { Vendor: VendorSchema } = require("../../../schemas/mongoDB/App/vendor.schema");
const { Customer: CustomerSchema } = require("../../../schemas/mongoDB/App/customer.schema");
const { Salary: SalarySchema } = require("../../../schemas/mongoDB/App/salary.schema");
const LedgerModel = require("../../../models/mongodb/app/Ledger.model");

const { successResponse, errorResponse } = require("../../../utils/helperFunctions");
const { NO_DATA_FOUND } = require("../../../constants/error.constant");


libre.convertAsync = require('util').promisify(libre.convert);


const reports = {};

reports.createReportTemplateForAllUsers = async (req, res, next) => {
  const { templateData, templateType } = req.body;

  try {
    // Define template URLs based on templateType
    const templateUrls = {
      'checktemplate': 'https://res.cloudinary.com/djawhbyv1/raw/upload/v1757796612/templateCheck_wrw1kn.docx',
    };

    // Use templateType to select template URL if needed in future
    const templateUrl = 'https://res.cloudinary.com/djawhbyv1/raw/upload/v1757796612/templateCheck_wrw1kn.docx';

    // Download template as arraybuffer
    const { data: templateBuffer } = await axios.get(templateUrl, { responseType: 'arraybuffer' });

    // Fill docx template
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render(templateData);
    const docxBuffer = doc.toBuffer();

    // Generate docx as Buffer
    // const docxBuffer = Buffer.from(
    //   doc.getZip().generate({
    //     type: 'nodebuffer',
    //     mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //   })
    // );

    // Convert docx Buffer to PDF Buffer
    // const pdfBuffer = await libre.convertAsync(docxBuffer, 'pdf', undefined);


    // // Send PDF directly in response
    // const filename = `${templateType}_${Date.now()}.pdf`;
    
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // res.setHeader('Content-Length', pdfBuffer.length);
    
    // return res.send(pdfBuffer);

    return successResponse({
      res,
      code: 200,
      message: 'converted file.',
      data: docxBuffer,
    });
    
  } catch (e) {
    next(e);
  }
};
reports.docxToPdfConvert = async (req, res, next) => {
  const { templateData, templateType } = req.body;

  try {
    // Define template URLs based on templateType
    const templateUrls = {
      'checktemplate': 'https://res.cloudinary.com/djawhbyv1/raw/upload/v1757796612/templateCheck_wrw1kn.docx',
    };

    // Use templateType to select template URL if needed in future
    const templateUrl = 'https://res.cloudinary.com/djawhbyv1/raw/upload/v1757796612/templateCheck_wrw1kn.docx';

    // Download template as arraybuffer
    const { data: templateBuffer } = await axios.get(templateUrl, { responseType: 'arraybuffer' });

    // Fill docx template
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render(templateData);
    const docxBuffer = doc.toBuffer();

    // Generate docx as Buffer
    // const docxBuffer = Buffer.from(
    //   doc.getZip().generate({
    //     type: 'nodebuffer',
    //     mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //   })
    // );

    // Convert docx Buffer to PDF Buffer
    // const pdfBuffer = await libre.convertAsync(docxBuffer, 'pdf', undefined);


    // // Send PDF directly in response
    // const filename = `${templateType}_${Date.now()}.pdf`;
    
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // res.setHeader('Content-Length', pdfBuffer.length);
    
    // return res.send(pdfBuffer);

    return successResponse({
      res,
      code: 200,
      message: 'converted file.',
      data: docxBuffer,
    });
    
  } catch (e) {
    next(e);
  }
};
reports.expenseReport = async (req, res, next) => {
  const { catagory, directorId, employeeId, fromDate, toDate } = req.query;
  const { userID } = res.auth;
  try {
    const query = {
      userID: userID,
    }
    if(catagory){
      query.catagory = catagory;
    }
    if(directorId){
      query.directorId = directorId;
    }
    if(employeeId){
      query.employeeId = employeeId;
    }
    if(fromDate){
      query.expenseDate = { $gte: fromDate };
    }
    if(toDate){
      query.expenseDate = { $lte: toDate };
    }
    const expenseReport = await ExpenseSchema.find(query);
    if(!expenseReport) throw errorResponse(NO_DATA_FOUND);

    const totalAmount = expenseReport.reduce((sum, item) => sum + (item.amount || 0), 0);
    return successResponse({
      res,
      code: 200,
      message: 'Expense report created successfully',
      data: {
        expenseReport,
        totalAmount,
      },
    });
  } catch (e) {
    next(e);
  }
};
reports.getTotalEmployeeVendorCustomer = async (req, res, next) => {
  const { userID } = res.auth;
  try {
    const totalEmployee = await EmployeeSchema.countDocuments({ userID });
    const totalVendor = await VendorSchema.countDocuments({ userID });
    const totalCustomer = await CustomerSchema.countDocuments({ userID });
    return successResponse({
      res,
      code: 200,
      message: 'Total employee, vendor, customer',
      data: {
        totalEmployee,
        totalVendor,
        totalCustomer,
      },
    });
  } catch (e) {
    next(e);
  }
}
reports.getMonthlySalaryReport = async (req, res, next) => {
  const { userID, month, year } = req.query;
  try {
    const query = {
      userID: userID,
    }
    if(month){
      query.month = month;
    }
    if(year){
      query.year = year;
    }
    const monthlySalaryReport = await SalarySchema.find(query);
    if(!monthlySalaryReport) throw errorResponse(NO_DATA_FOUND);

    const totalAmount = monthlySalaryReport.reduce((sum, item) => sum + (item.netSalary || 0), 0);

    return successResponse({
      res,
      code: 200,
      message: 'Monthly salary report',
      data: totalAmount,
    });
  } catch (e) {
    next(e);
  }
}
reports.getRemainingBalanceReport = async (req, res, next) => {
  const { userID } = res.auth;
  try {
  const customersLedger = await LedgerModel.find({ userID, ledgerType: 'customer' });

  const totalAmountIncommingFromCustomers = customersLedger.reduce((sum, item) => sum + (item.calculation.closingBalance || 0), 0);
  const vendorsLedger = await LedgerModel.find({ userID, ledgerType: 'vendor' });
  const totalAmountOutgoingToVendors = vendorsLedger.reduce((sum, item) => sum + (item.calculation.closingBalance || 0), 0);

  const tillLedger = await LedgerModel.find({ userID, ledgerType: { $in: ['till', 'director'] } });
  const totalAmountInTill = tillLedger.reduce((sum, item) => sum + (item.calculation.closingBalance || 0), 0);
  const totalCashInTill = tillLedger.reduce((sum, item) => sum + (item.calculation.totalCash || 0), 0);
  const totalBankInTill = tillLedger.reduce((sum, item) => sum + (item.calculation.totalBank || 0), 0);

  return successResponse({
    res,
    code: 200,
    message: 'Remaining balance report',
    data: {
      totalAmountIncommingFromCustomers,
      totalAmountOutgoingToVendors,
      totalAmountInTill,
      totalCashInTill,
      totalBankInTill,
    },
  });
  } catch (e) {
    next(e);
  }
}
module.exports = reports;