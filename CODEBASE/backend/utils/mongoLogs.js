const mongoose = require("mongoose");

function getDb() {
  return mongoose.connection && mongoose.connection.db ? mongoose.connection.db : null;
}

async function insertOne(collectionName, doc) {
  try {
    const db = getDb();
    if (!db) return { ok: false, reason: "MongoDB not connected" };

    const payload = {
      ...doc,
      timestamp: doc.timestamp ? doc.timestamp : new Date(),
    };

    await db.collection(collectionName).insertOne(payload);
    return { ok: true };
  } catch (err) {
    // Never break the main request path because logging failed.
    console.warn(`[mongoLogs] Failed to insert into ${collectionName}:`, err.message);
    return { ok: false, reason: err.message };
  }
}

async function writeOrderLog({ order_id, status, message, timestamp }) {
  return insertOne("order_logs", { order_id, status, message, timestamp });
}

async function writeActivityLog({ user_id, action, module, metadata, timestamp }) {
  return insertOne("activity_logs", { user_id, action, module, metadata, timestamp });
}

async function writeAuthLog({ user_id, provider, status, timestamp }) {
  return insertOne("auth_logs", { user_id, provider, status, timestamp });
}

module.exports = {
  writeOrderLog,
  writeActivityLog,
  writeAuthLog,
};
