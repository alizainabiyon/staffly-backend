const {
  ReportTemplate: ReportTemplateSchema,
} = require('../../../schemas/mongoDB/App/reportTemplate.schema');

// @Helper Functions
const {
  returnSuccess,
  returnError,
} = require('../../../utils/helperFunctions');

class ReportTemplate extends ReportTemplateSchema {

  static async createTemplate(userID) {
    try {
      const templateDto = [
        { templateId: `template-${uuidv4()}`, templateType: 'checktemplate', defaultUrl: 'https://res.cloudinary.com/djawhbyv1/raw/upload/v1757796612/templateCheck_wrw1kn.docx', userID },

      ]
      const template = await ReportTemplateSchema.insertMany(templateDto);
      return returnSuccess({
        success: true,
        message: 'Template created successfully',
        data: template,
      });
    } catch (error) {
      return returnError(errorDB('Failed to create template'));
    }
  }

}

module.exports = ReportTemplate;
