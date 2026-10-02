const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.dailyEntry;
const {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  saveTodayEntries,
  getEntriesByDateOrBetweenDates,
} = require('../../../../controllers/app/dailyEntry/dailyEntry.controller');

// Daily Entry CRUD operations
router.post(subPaths.createEntry, createEntry);
router.get(subPaths.getAllEntries, getAllEntries);
router.get(subPaths.getEntryById, getEntryById);
router.put(subPaths.updateEntry, updateEntry);
router.delete(subPaths.deleteEntry, deleteEntry);
router.post(subPaths.saveTodayEntries, saveTodayEntries);
router.get(subPaths.getEntriesByDateOrBetweenDates, getEntriesByDateOrBetweenDates);

module.exports = router; 