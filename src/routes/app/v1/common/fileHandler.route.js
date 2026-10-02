const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.fileHandler;
const {
    uploadSingleFile,
uploadMultipleFiles,
deleteSingleFile,
deleteMultipleFiles
} = require('../../../../controllers/app/common/fileHandler.controller');
// router.route(subPaths.root).post(create).put(update).get(get).delete(remove);
router.post(subPaths.uploadSingleFile, uploadSingleFile);
router.post(subPaths.uploadMultipleFiles, uploadMultipleFiles);
router.post(subPaths.deleteSingleFile, deleteSingleFile);
router.post(subPaths.deleteMultipleFiles, deleteMultipleFiles);

module.exports = router;
