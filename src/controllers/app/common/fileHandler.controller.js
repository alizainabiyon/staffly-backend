// @Dependencies
const { v4: uuid } = require('uuid');
const { PassThrough } = require('stream');
const _ = require('lodash');
const AWS = require("aws-sdk");


// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_BUCKET_NAME;

// @Models
// const Attorney = require('../../../models/mongodb/common/Attorney.model');
// const UserModel = require('../../../models/mongodb/auth/User.model');

// @Helper Functions
const {
  successResponse,
  errorResponse,
  uploadFile,
  deleteFile
} = require('../../../utils/helperFunctions');

// hello
const fileHandler = {};

fileHandler.uploadSingleFile = async (req, res, next) => {
  try {
    let { file } = req.files;

    if (!file || file.length === 0) {
      return res.status(400).json({ message: "No file provided." });
    }

    const uniqueFileName = `${uuid()}_${file[0].originalname}`;

    // Create a stream to prevent memory overload
    const stream = new PassThrough();
    stream.end(file[0].buffer);

    const params = {
      Bucket: bucketName,
      Key: uniqueFileName, // File name in S3
      Body: stream, // Stream instead of buffer
      ContentType: file[0].mimetype, // Preserve file type
      // ACL: 'public-read', // Optional, adjust as needed
    };

    const result = await s3.upload(params).promise();

    return successResponse({
      res,
      code: 200,
      message: 'File uploaded successfully.',
      data: result.Location,
    });
  } catch (e) {
    next(e);
  }
};
fileHandler.uploadMultipleFiles = async (req, res, next) => {
  try {
    let { files } = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided." });
    }

    const uploadPromises = files.map((file) => {
      const uniqueFileName = `${uuid()}_${file.originalname}`;
      
      // Create a readable stream
      const stream = new PassThrough();
      stream.end(file.buffer);

      const params = {
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: stream, // Stream for large files
        ContentType: file.mimetype, // Maintain file type
        // ACL: 'public-read', // Optional, adjust permissions as needed
      };

      return s3.upload(params).promise();
    });

    const results = await Promise.all(uploadPromises);

    return successResponse({
      res,
      code: 200,
      message: 'Files uploaded successfully.',
      data: results.map(result => result.Location),
    });
  } catch (e) {
    next(e);
  }
};
fileHandler.deleteSingleFile = async (req, res, next) => {
  let { fileUrl } = req.body;
  const { userID } = res.auth;

  try {

    const params = {
      Bucket: bucketName, // Replace with your bucket name
      Key: fileUrl, // Name of the file to delete in S3
    };

    await s3.deleteObject(params).promise();

    return successResponse({
      res,
      code: 200,
      message: 'File deleted succeed.',
      data: {},
    });
  } catch (e) {
    next(e);
  }
};
fileHandler.deleteMultipleFiles = async (req, res, next) => {
  let { fileUrls } = req.body;
  const { userID } = res.auth;

  try {
    const uploadPromises = fileUrls.map(async (file) => {
      const params = {
        Bucket: bucketName, // Replace with your bucket name
        Key: file, // Name of the file to delete in S3
      };
  
      await s3.deleteObject(params).promise();
    });

    return successResponse({
      res,
      code: 200,
      message: 'Delete multiple files succeed.',
      data:{}
    });
  } catch (e) {
    next(e);
  }
};

module.exports = fileHandler;