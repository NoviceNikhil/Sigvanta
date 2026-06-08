const mongoose = require("mongoose");

const COLLECTIONS = {
  order: "order_logs",
  activity: "activity_logs",
  auth: "auth_logs",
};

function toInt(value, fallback) {
  const numberValue = Number.parseInt(String(value), 10);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined && obj[key] !== "") acc[key] = obj[key];
    return acc;
  }, {});
}

async function getLogs(req, res) {
  const { type } = req.params;
  const collectionName = COLLECTIONS[type];

  if (!collectionName) {
    return res.status(400).json({
      success: false,
      message: "Invalid log type. Use one of: order, activity, auth",
    });
  }

  if (!mongoose.connection?.db) {
    return res.status(503).json({
      success: false,
      message: "MongoDB not connected",
    });
  }

  const page = Math.max(1, toInt(req.query.page, 1));
  const limit = Math.min(200, Math.max(1, toInt(req.query.limit, 50)));
  const skip = (page - 1) * limit;

  let filter = {};
  if (type === "order") {
    filter = pick(req.query, ["order_id", "status"]);
  } else if (type === "activity") {
    filter = pick(req.query, ["user_id", "action", "module"]);
  } else if (type === "auth") {
    filter = pick(req.query, ["user_id", "provider", "status"]);
  }

  const collection = mongoose.connection.db.collection(collectionName);

  const [results, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ timestamp: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: {
      type,
      collection: collectionName,
      page,
      limit,
      total,
      results,
    },
  });
}

module.exports = {
  getLogs,
};
