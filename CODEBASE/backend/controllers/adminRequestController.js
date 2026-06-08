const AdminRequest = require("../models/adminRequestModel");
const User = require("../models/userSchema");

const { successResponse, errorResponse } = require("../utils/apiResponce");


// 🔹 USER → Request Admin
exports.requestAdmin = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reason } = req.body;

        if (!reason) {
            return errorResponse(res, "Reason is required", null, 400);
        }

        // check already pending request
        const existing = await AdminRequest.findOne({
            where: { userId, status: "pending" },
        });

        if (existing) {
            return errorResponse(res, "Admin request already pending", null, 400);
        }

        const request = await AdminRequest.create({
            userId,
            reason,
        });

        return successResponse(res, "Admin request sent successfully", request, 201);

    } catch (err) {
        return errorResponse(
            res,
            err.message || "Failed to request admin",
            null,
            err.statusCode || 500
        );
    }
};


// 🔹 ADMIN → Get All Requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await AdminRequest.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        return successResponse(res, "Admin requests fetched", requests);

    } catch (err) {
        return errorResponse(
            res,
            err.message || "Failed to fetch requests",
            null,
            err.statusCode || 500
        );
    }
};


// 🔹 ADMIN → Approve / Reject Request
exports.handleRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // approve | reject

        if (!action) {
            return errorResponse(res, "Action is required", null, 400);
        }

        const request = await AdminRequest.findByPk(id);

        if (!request) {
            return errorResponse(res, "Request not found", null, 404);
        }

        if (request.status !== "pending") {
            return errorResponse(res, "Request already processed", null, 400);
        }

        if (action === "approve") {
            await User.update(
                { role: "admin" },
                { where: { id: request.userId } }
            );

            request.status = "approved";

        } else if (action === "reject") {
            request.status = "rejected";

        } else {
            return errorResponse(res, "Invalid action", null, 400);
        }

        await request.save();

        return successResponse(res, `Request ${action}ed successfully`, request);

    } catch (err) {
        return errorResponse(
            res,
            err.message || "Failed to update request",
            null,
            err.statusCode || 500
        );
    }
};