import express from "express";

import { validate } from "express-validation";

import * as apiController from "../controllers/api.controller";
import * as apiValidator from "../controllers/api.validator";

const router = express.Router();

// api/register
router.post(
  "/register",
  validate(apiValidator.register, { keyByField: true }),
  apiController.register
);

// api/commonstudents
router.get(
  "/commonstudents",
  validate(apiValidator.commonstudents, { keyByField: true }),
  apiController.commonstudentslist
);

// api/suspend
router.post(
  "/suspend",
  validate(apiValidator.suspend, { keyByField: true }),
  apiController.suspendStudent
);

// api/retrievenotifications
router.post(
  "/retrievenotifications",
  validate(apiValidator.retrievenotifications, { keyByField: true }),
  apiController.retrieveNotifications
);

module.exports = router;
