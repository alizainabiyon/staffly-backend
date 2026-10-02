const {
  Contractor: ContractorSchema,
} = require('../../../schemas/mongoDB/App/contractor.schema');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Contractor extends ContractorSchema {
  static async create(data) {
    const contractor = await ContractorSchema.create(data);
    if (!contractor) {
      return returnError(errorDB('Contractor not created'));
    }
    return returnSuccess({
      success: true,
      message: 'Contractor created successfully',
      data: contractor,
    });
  }

  static async createContractor(params) {
    try {

      const contractor = await ContractorSchema.create(params);
      return returnSuccess({
        success: true,
        message: 'Contractor created successfully',
        data: contractor,
      });
    } catch (error) {
      return returnError(errorDB('Failed to create contractor'));
    }
  }

  static async getAllContractors(params) {
    try {
      const {
        userID,
        name,
        email,
        type,
        category,
        status,
        priority,
        source,
        tags,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { userID };

      // Name filter (case-insensitive search)
      if (name) {
        query.$or = [
          { name: { $regex: name, $options: 'i' } },
          { companyName: { $regex: name, $options: 'i' } }
        ];
      }

      // Email filter
      if (email) {
        query.email = { $regex: email, $options: 'i' };
      }

      // Type filter
      if (type) {
        query.type = type;
      }

      // Category filter
      if (category) {
        query.category = category;
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Priority filter
      if (priority) {
        query.priority = priority;
      }

      // Source filter
      if (source) {
        query.source = source;
      }

      // Tags filter
      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const contractors = await ContractorSchema.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await ContractorSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Contractors retrieved successfully',
        data: {
          contractors,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve contractors'));
    }
  }

  static async getContractorById(params) {
    try {
      const { userID, contractorId } = params;

      const contractor = await ContractorSchema.findOne({ 
        contractorId: contractorId,
        userID: userID 
      });

      if (!contractor) {
        return returnError({
          success: false,
          message: 'Contractor not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Contractor details retrieved successfully',
        data: contractor,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve contractor details'));
    }
  }

  static async updateContractor(params) {
    try {
      const { userID, contractorId, updateData } = params;
      const contractor = await ContractorSchema.findOneAndUpdate(
        { contractorId: contractorId, userID: userID },
        updateData,
        { new: true }
      );

      if (!contractor) {
        return returnError({
          success: false,
          message: 'Contractor not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Contractor updated successfully',
        data: contractor,
      });
    } catch (error) {
      return returnError(errorDB('Failed to update contractor'));
    }
  }

  static async updateContractorStatus(params) {
    try {
      const { userID, contractorId, status, updatedBy } = params;

      const contractor = await ContractorSchema.findOneAndUpdate(
        { contractorId: contractorId, userID: userID },
        { 
          status: status,
          updatedBy: updatedBy
        },
        { new: true }
      );

      if (!contractor) {
        return returnError({
          success: false,
          message: 'Contractor not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Contractor status updated successfully',
        data: contractor,
      });
    } catch (error) {
      return returnError(errorDB('Failed to update contractor status'));
    }
  }

  static async deleteContractor(params) {
    try {
      const { userID, contractorId } = params;

      const contractor = await ContractorSchema.findOneAndDelete({ 
        contractorId: contractorId,
        userID: userID 
      });

      if (!contractor) {
        return returnError({
          success: false,
          message: 'Contractor not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Contractor deleted successfully',
        data: null,
      });
    } catch (error) {
      return returnError(errorDB('Failed to delete contractor'));
    }
  }

  static async searchContractors(params) {
    try {
      const {
        userID,
        searchTerm,
        category,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { userID };

      // Category filter
      if (category) {
        query.category = category;
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Search term filter (case-insensitive search across multiple fields)
      if (searchTerm) {
        query.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { companyName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } },
          { 'contactPerson.name': { $regex: searchTerm, $options: 'i' } },
          { 'contactPerson.email': { $regex: searchTerm, $options: 'i' } },
          { services: { $in: [new RegExp(searchTerm, 'i')] } },
          { specializations: { $in: [new RegExp(searchTerm, 'i')] } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ];
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const contractors = await ContractorSchema.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await ContractorSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Contractor search completed successfully',
        data: {
          contractors,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to search contractors'));
    }
  }

  static async getContractorStats(params) {
    try {
      const { userID } = params;

      // Build query object
      const query = { userID };

      // Get total contractors
      const totalContractors = await ContractorSchema.countDocuments(query);

      // Get contractors by status
      const statusStats = await ContractorSchema.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Get contractors by category
      const categoryStats = await ContractorSchema.aggregate([
        { $match: query },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      // Get contractors by type
      const typeStats = await ContractorSchema.aggregate([
        { $match: query },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);

      // Get contractors by source
      const sourceStats = await ContractorSchema.aggregate([
        { $match: query },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]);

      // Get recent contractors (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentContractors = await ContractorSchema.countDocuments({
        ...query,
        createdAt: { $gte: thirtyDaysAgo }
      });

      // Get average rating
      const avgRating = await ContractorSchema.aggregate([
        { $match: query },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);

      // Get total projects
      const totalProjects = await ContractorSchema.aggregate([
        { $match: query },
        { $group: { _id: null, totalProjects: { $sum: '$totalProjects' } } }
      ]);

      return returnSuccess({
        success: true,
        message: 'Contractor statistics retrieved successfully',
        data: {
          totalContractors,
          recentContractors,
          avgRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
          totalProjects: totalProjects.length > 0 ? totalProjects[0].totalProjects : 0,
          statusStats,
          categoryStats,
          typeStats,
          sourceStats
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve contractor statistics'));
    }
  }

}

module.exports = Contractor; 