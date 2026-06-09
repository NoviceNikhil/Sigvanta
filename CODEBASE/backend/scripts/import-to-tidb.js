/**
 * Import MySQL dump to TiDB Cloud
 * 
 * Usage:
 *   1. Create a TiDB Cloud Serverless cluster at https://tidbcloud.com
 *   2. Get your connection credentials from the cluster dashboard
 *   3. Fill in the credentials below
 *   4. Run: node scripts/import-to-tidb.js
 * 
 * NOTE: Run this from the backend/ directory (needs mysql2 from node_modules)
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// ─── TiDB Cloud Credentials (fill these in) ────────────────────────────────────
const TIDB_HOST = process.env.TIDB_HOST || "gateway01.us-east-1.prod.aws.tidbcloud.com";
const TIDB_PORT = process.env.TIDB_PORT || 4000;
const TIDB_USER = process.env.TIDB_USER || "REPLACE_WITH_YOUR_TIDB_USER";
const TIDB_PASSWORD = process.env.TIDB_PASSWORD || "REPLACE_WITH_YOUR_TIDB_PASSWORD";
const TIDB_DATABASE = "projectdata";

// ─── Path to the SQL dump ───────────────────────────────────────────────────────
const DUMP_FILE = "/tmp/projectdata_clean.sql";

async function main() {
  console.log("🔗 Connecting to TiDB Cloud...");

  const conn = await mysql.createConnection({
    host: TIDB_HOST,
    port: TIDB_PORT,
    user: TIDB_USER,
    password: TIDB_PASSWORD,
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    multipleStatements: true, // KEY — allows full dump import
    connectTimeout: 30000,
  });

  console.log("✅ Connected to TiDB Cloud");

  // Create database if not exists
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${TIDB_DATABASE}\``);
  await conn.query(`USE \`${TIDB_DATABASE}\``);
  console.log(`✅ Using database: ${TIDB_DATABASE}`);

  // Read and execute the dump
  console.log(`📄 Reading dump file: ${DUMP_FILE}`);
  const sql = fs.readFileSync(DUMP_FILE, "utf8");

  console.log(`⏳ Importing data (${(sql.length / 1024 / 1024).toFixed(2)} MB)...`);
  console.log("   This may take 30-60 seconds...");

  await conn.query(sql);

  console.log("✅ Import complete!");

  // Verify
  const [rows] = await conn.query(`
    SELECT 'users' as tbl, COUNT(*) as cnt FROM users
    UNION ALL SELECT 'products', COUNT(*) FROM products
    UNION ALL SELECT 'categories', COUNT(*) FROM categories
    UNION ALL SELECT 'orders', COUNT(*) FROM orders
  `);

  console.log("\n📊 Verification:");
  rows.forEach((r) => console.log(`   ${r.tbl}: ${r.cnt} rows`));

  await conn.end();
  console.log("\n🎉 Done! Your TiDB Cloud database is ready.");
}

main().catch((err) => {
  console.error("❌ Import failed:", err.message);
  process.exit(1);
});
