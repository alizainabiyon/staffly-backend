const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.director;
const {
  createDirector,
  getAllDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} = require('../../../../controllers/app/director/director.controller');

// Director CRUD operations
router.post(subPaths.createDirector, createDirector);
router.get(subPaths.getAllDirectors, getAllDirectors);
router.get(subPaths.getDirectorById, getDirectorById);
router.put(subPaths.updateDirector, updateDirector);
router.delete(subPaths.deleteDirector, deleteDirector);

module.exports = router; 