const express = require("express");
const mongoose = require("mongoose");

const authenticate = require("../middleware/authenticate_middlewere");
const authorize = require("../middleware/authorize");
const { successResponse } = require("../utils/apiResponce");
const AppError = require("../utils/AppError");

const router = express.Router();

const COLLECTIONS_BY_TYPE = {
  order: "order_logs",
  activity: "activity_logs",
  auth: "auth_logs",
};

function getDb() {
  return mongoose.connection && mongoose.connection.db ? mongoose.connection.db : null;
}

function parseLimit(value, fallback = 20, max = 200) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

router.get(
  "/:type",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { type } = req.params;
      const collectionName = COLLECTIONS_BY_TYPE[type];
      if (!collectionName) {
        return next(new AppError("Invalid log type", 400));
      }

      const db = getDb();
      if (!db) {
        return successResponse(res, "MongoDB not connected", { results: [] }, 200);
      }

      const limit = parseLimit(req.query.limit);
      const results = await db
        .collection(collectionName)
        .find({})
        .sort({ timestamp: -1, _id: -1 })
        .limit(limit)
        .toArray();

      return successResponse(res, "Logs fetched", { results }, 200);
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = router;
