import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, LogOut, Trash2, User, Mail, Camera, Shield, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCurrentUser, logoutUser, updateAvatar, updateCurrentUserProfile } from "../api/auth";
import { logout, setUser } from "../store/authSlice";
// ✅ IMPORT API FUNCTIONS
import { requestAdminAccess, getAdminRequests, handleAdminRequest as handleAdminRequestAPI } from "../api/auth";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    const getAvatarUrl = (profileIcon) => {
        const avatar = profileIcon || "boy.png";
        return `http://localhost:3000/avatars/${avatar}`;
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        profilePicture: getAvatarUrl(),
    });

    const [initialData, setInitialData] = useState({
        name: "",
        email: "",
        role: "",
        profilePicture: getAvatarUrl(user?.ProfileIcon),
    });

    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [adminRequests, setAdminRequests] = useState([]);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestReason, setRequestReason] = useState("");
    const [requestLoading, setRequestLoading] = useState(false);
    const pendingRequests = adminRequests.filter((request) => request.status === "pending");
    const completedRequests = adminRequests.filter((request) => request.status !== "pending");


    useEffect(() => {
        if (user) {
            const userData = {
                name: user.name || "",
                email: user.email || "",
                role: user.role || "user",
                profilePicture: user.profilePicture || getAvatarUrl(user.ProfileIcon),
            };
            setFormData(userData);
            setInitialData(userData);
        }
    }, [user]);

    const isChanged = formData.name.trim() !== initialData.name;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleUpdate = async () => {
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            setErrorMessage("Name is required");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setLoading(true);
        try {
            const response = await updateCurrentUserProfile({ name: trimmedName });
            const updatedUser = response.data?.data;

            dispatch(setUser(updatedUser));
            setFormData((prev) => ({
                ...prev,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture || prev.profilePicture,
            }));
            setInitialData((prev) => ({
                ...prev,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture || prev.profilePicture,
            }));

            setLoading(false);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setLoading(false);
            setErrorMessage(err.response?.data?.message || "Failed to update profile");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    // Request Admin Access
    const handleRequestAdmin = async () => {
        if (!requestReason.trim()) {
            setErrorMessage("Please provide a reason");
            return;
        }

        setRequestLoading(true);
        try {
            const response = await requestAdminAccess({ reason: requestReason, });
            setSuccessMessage("Admin request sent successfully!");
            setShowRequestModal(false); setRequestReason("");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
        catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to send request");
            setTimeout(() => setErrorMessage(""), 3000);
        }
        finally {
            setRequestLoading(false);
        }
    };

    const handleAvatarChange = async (avatar) => {
        try {
            const response = await updateAvatar({ avatar });
            const avatarUrl =
                response.data?.data?.profilePicture ||
                response.data?.data?.avatarUrl ||
                getAvatarUrl(avatar);

            const updatedUser = {
                ...user,
                ProfileIcon: avatar,
                profilePicture: avatarUrl,
            };

            dispatch(setUser(updatedUser));
            setFormData((prev) => ({
                ...prev,
                profilePicture: avatarUrl,
            }));
            setInitialData((prev) => ({
                ...prev,
                profilePicture: avatarUrl,
            }));

            setSuccessMessage("Avatar updated!");
            setTimeout(() => setSuccessMessage(""), 2000);
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to update avatar");
            setTimeout(() => setErrorMessage(""), 2000);
        }
    };

    // Get All Admin Requests (for admin only)
    const fetchAdminRequests = async () => {
        try {
            const response = await getAdminRequests();
            setAdminRequests(response.data.data || []);
            setShowAdminModal(true);
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to fetch requests");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    // Handle Admin Request (approve/reject)
    const handleAdminRequest = async (requestId, action) => {
        try {
            await handleAdminRequestAPI(requestId, { action });
            const updatedStatus = action === "approve" ? "approved" : "rejected";

            setSuccessMessage(`Request ${action}ed successfully!`);
            setAdminRequests((prev) =>
                prev.map((request) =>
                    request.id === requestId
                        ? { ...request, status: updatedStatus }
                        : request
                )
            );
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to process request");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const getRoleBadgeColor = (role) => { const colors = { admin: "bg-red-100 text-red-700 border border-red-200", user: "bg-blue-100 text-blue-700 border border-blue-200", moderator: "bg-purple-100 text-purple-700 border border-purple-200", }; return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-700 border border-gray-200"; };
    const getRequestStatusClasses = (status) => { if (status === "approved") return "bg-green-100 text-green-700"; if (status === "rejected") return "bg-red-100 text-red-700"; return "bg-yellow-100 text-yellow-700"; };

    const formatDate = (dateString) => { if (!dateString) return "Not available"; const date = new Date(dateString); return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            dispatch(logout());
            navigate("/");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteCurrentUser();
            dispatch(logout());
            setShowDeleteConfirm(false);
            navigate("/");
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to delete account");
            setTimeout(() => setErrorMessage(""), 3000);
            setShowDeleteConfirm(false);
        }
    };

    if (!user) { return (<div className="min-h-screen flex items-center justify-center"> <p>Loading profile...</p> </div>); }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                <div className="fixed top-15 right-6 z-50 w-80">

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium flex items-center gap-2 shadow-lg">
                            <span>✓</span>
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium flex items-center gap-2 shadow-lg">
                            <AlertCircle size={18} />
                            {errorMessage}
                        </div>
                    )}

                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

                        {/* LEFT SIDE - Profile Picture & Info */}
                        <div className="lg:col-span-2 bg-gradient-to-b from-[#355872] to-[#2c4a60] p-6 sm:p-8 flex flex-col items-center justify-center text-white">

                            {/* Profile Picture */}
                            <div className="relative mb-6">
                                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                                    <img
                                        src={formData.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label htmlFor="profilePictureUpload" className="absolute bottom-2 right-2 bg-white hover:bg-slate-100 text-[#355872] p-3 rounded-full shadow-lg transition cursor-pointer hover:scale-110 duration-200">
                                    <Camera size={20} />
                                </label>
                                <input
                                    id="profilePictureUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {["boy.png", "cat.png", "dog.png", "grandfather.png", "man.png", "old-woman.png", "programmer.png", "woman.png"].map((avatar) => (
                                    <img
                                        key={avatar}
                                        src={`http://localhost:3000/avatars/${avatar}`}
                                        onClick={() => handleAvatarChange(avatar)}
                                        className="w-16 h-16 rounded-full cursor-pointer border-2 hover:scale-105 transition"
                                    />
                                ))}
                            </div>

                            {/* user ka naam idhar print ho raha hai*/}
                            <h2 className="text-3xl font-bold text-center mb-2 mt-3">
                                {formData.name}
                            </h2>

                            {/* Role Badge */}
                            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getRoleBadgeColor(formData.role)}`}>
                                {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                            </div>

                            {/* Account Info */}
                            <div className="mt-2 w-full space-y-4 border-t border-white/20 pt-6">
                                <div className="text-center">
                                    <p className="text-white/70 text-sm">Member Since</p>
                                    <p className="font-semibold text-white">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* RIGHT SIDE - Form & Actions */}
                        <div className="lg:col-span-3 p-6 sm:p-8">

                            {/* Form Section */}
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                                        Account Information
                                    </h3>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <User size={18} className="text-[#355872]" />
                                            Full Name
                                        </div>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-800 font-medium outline-none focus:border-[#355872] focus:ring-2 focus:ring-[#355872]/20 transition"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* email*/}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} className="text-[#355872]" />
                                            Email Address
                                        </div>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        aria-readonly="true"
                                        className="w-full px-4 py-3 bg-slate-100/80 border-2 border-slate-200 rounded-lg text-slate-500 font-medium outline-none cursor-not-allowed select-text"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* role display*/}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                                        Role
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-800 font-medium">
                                            {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                                        </div>

                                        {/* Request Admin Button (for users only) */}
                                        {formData.role === "user" && (
                                            <button
                                                type="button"
                                                onClick={() => setShowRequestModal(true)}
                                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <Shield size={18} />
                                                Request Admin
                                            </button>
                                        )}

                                        {/* View Requests Button (for admins only) */}
                                        {formData.role === "admin" && (
                                            <button
                                                type="button"
                                                onClick={fetchAdminRequests}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <Shield size={18} />
                                                View Requests
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Update Button */}
                                {isChanged && (
                                    <button
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-[#355872] to-[#2c4a60] hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-75 flex items-center justify-center gap-2"
                                    >
                                        <Save size={20} />
                                        {loading ? "Saving Changes..." : "Save Changes"}
                                    </button>
                                )}
                            </form>

                            {/* Divider */}
                            <div className="my-8 border-t border-slate-200"></div>

                            {/* Bottom Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full px-6 py-3 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Account
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-6 py-3 border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 no-underline"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in fade-in zoom-in duration-200">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <Trash2 className="text-red-600" size={24} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Delete Account?
                            </h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                This action cannot be undone. All your data, posts, and preferences will be permanently deleted.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Request Admin Modal */}
                {showRequestModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                                <Shield className="text-amber-600" size={24} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Request Admin Access
                            </h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Please provide a reason for your admin access request. An administrator will review your request.
                            </p>

                            <textarea
                                value={requestReason}
                                onChange={(e) => setRequestReason(e.target.value)}
                                placeholder="Tell us why you need admin access..."
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-800 font-medium outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition resize-none"
                                rows={4}
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowRequestModal(false);
                                        setRequestReason("");
                                    }}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRequestAdmin}
                                    disabled={requestLoading}
                                    className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition disabled:opacity-75"
                                >
                                    {requestLoading ? "Sending..." : "Send Request"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin Requests Modal */}
                {showAdminModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 my-8 animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Shield className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        Admin Requests
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {pendingRequests.length} pending and {completedRequests.length} completed
                                    </p>
                                </div>
                            </div>

                            {adminRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-600">No admin requests found</p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-1">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-lg font-bold text-slate-900">Pending</h4>
                                            <span className="text-sm text-slate-500">{pendingRequests.length} request(s)</span>
                                        </div>

                                        {pendingRequests.length === 0 ? (
                                            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 bg-slate-50">
                                                No pending requests right now.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {pendingRequests.map((request) => (
                                                    <div key={request.id} className="p-4 border-2 border-slate-200 rounded-lg">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-bold text-slate-900">{request.User?.name || "Unknown"}</h4>
                                                                <p className="text-sm text-slate-600">{request.User?.email}</p>
                                                            </div>
                                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRequestStatusClasses(request.status)}`}>
                                                                {request.status.toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <p className="text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg text-sm">
                                                            {request.reason}
                                                        </p>

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAdminRequest(request.id, "approve")}
                                                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleAdminRequest(request.id, "reject")}
                                                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-lg font-bold text-slate-900">Completed</h4>
                                            <span className="text-sm text-slate-500">{completedRequests.length} request(s)</span>
                                        </div>

                                        {completedRequests.length === 0 ? (
                                            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 bg-slate-50">
                                                No completed request history yet.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {completedRequests.map((request) => (
                                                    <div key={request.id} className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50/70">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-bold text-slate-900">{request.User?.name || "Unknown"}</h4>
                                                                <p className="text-sm text-slate-600">{request.User?.email}</p>
                                                            </div>
                                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRequestStatusClasses(request.status)}`}>
                                                                {request.status.toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <p className="text-slate-700 bg-white p-3 rounded-lg text-sm">
                                                            {request.reason}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowAdminModal(false)}
                                className="w-full mt-6 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
