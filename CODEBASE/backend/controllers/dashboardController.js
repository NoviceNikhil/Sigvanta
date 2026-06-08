const dashboardService = require("../services/dashboardService");
const apiResponse = require("../utils/apiResponce");

/**
 * GET /api/admin/dashboard
 * Returns aggregated stats for the admin dashboard.
 */
const getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return apiResponse.successResponse(
      res,
      "Dashboard data fetched successfully",
      stats,
      200,
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
