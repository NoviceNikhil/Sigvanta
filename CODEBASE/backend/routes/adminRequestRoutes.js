const express = require("express");
const router = express.Router();

const {
  requestAdmin,
  getAllRequests,
  handleRequest,
} = require("../controllers/adminRequestController");

const authenticate = require("../middleware/authenticate_middlewere");
const authorizeRoles = require("../middleware/roleVerifyMiddlewere");


// 🔹 User → Request Admin
router.post(
  "/request-admin",
  authenticate,
  authorizeRoles("user"),   // only normal user can request
  requestAdmin
);


// 🔹 Admin → Get all requests
router.get(
  "/admin/requests",
  authenticate,
  authorizeRoles("admin"),
  getAllRequests
);

// 🔹 Admin → Approve / Reject
router.patch(
  "/admin/request/:id",
  authenticate,
  authorizeRoles("admin"),
  handleRequest
);

module.exports = router;