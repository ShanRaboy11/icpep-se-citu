"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getUserStats = exports.deleteUser = exports.toggleUserStatus = exports.updateUser = exports.bulkUploadUsers = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all users with filtering and sorting
const getAllUsers = async (req, res) => {
    try {
        const { role, membershipType, isActive, sortBy = 'createdAt', sortOrder = 'desc', page = '1', limit = '50', } = req.query;
        // Build filter object
        const filter = {};
        if (role && role !== 'all') {
            filter.role = role;
        }
        if (membershipType && membershipType !== 'all') {
            if (membershipType === 'non-member') {
                filter['membershipStatus.isMember'] = false;
            }
            else {
                filter['membershipStatus.membershipType'] = membershipType;
            }
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Execute query
        const users = await user_1.default.find(filter)
            .populate('registeredBy', 'firstName lastName middleName')
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .lean();
        // Get total count for pagination
        const total = await user_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message,
        });
    }
};
exports.getAllUsers = getAllUsers;
// Get single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
            return;
        }
        const user = await user_1.default.findById(id).populate('registeredBy', 'firstName lastName middleName');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message,
        });
    }
};
exports.getUserById = getUserById;
// Create new user
const createUser = async (req, res) => {
    try {
        const { studentNumber, lastName, firstName, middleName, password = '123456', role = 'student', yearLevel, membershipStatus, } = req.body;
        console.log('📝 CREATE USER - req.user:', req.user);
        console.log('📝 CREATE USER - membershipStatus received:', membershipStatus);
        // Validation
        if (!studentNumber || !lastName || !firstName) {
            res.status(400).json({
                success: false,
                message: 'Student number, first name, and last name are required',
            });
            return;
        }
        // Check if user already exists
        const existingUser = await user_1.default.findOne({ studentNumber: studentNumber.toUpperCase() });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User with this student number already exists',
            });
            return;
        }
        // ✅ NEW: Handle membership status - supports both string and object formats
        let membershipStatusObj = {
            isMember: false,
            membershipType: null,
        };
        // Check if membershipStatus is already an object (from Excel upload)
        if (membershipStatus && typeof membershipStatus === 'object') {
            membershipStatusObj = {
                isMember: membershipStatus.isMember || false,
                membershipType: membershipStatus.membershipType || null,
            };
        }
        // Handle string format (from manual add form)
        else if (membershipStatus && typeof membershipStatus === 'string') {
            const statusLower = membershipStatus.toLowerCase();
            if (statusLower === 'local') {
                membershipStatusObj = {
                    isMember: true,
                    membershipType: 'local',
                };
            }
            else if (statusLower === 'regional') {
                membershipStatusObj = {
                    isMember: true,
                    membershipType: 'regional',
                };
            }
            else if (statusLower === 'both') {
                membershipStatusObj = {
                    isMember: true,
                    membershipType: 'both',
                };
            }
            else if (statusLower === 'member') {
                membershipStatusObj = {
                    isMember: true,
                    membershipType: null, // Generic member without specific type
                };
            }
            // 'non-member' or any other value defaults to the initial values
        }
        console.log('✅ Processed membershipStatus:', membershipStatusObj);
        // Create user
        const newUser = await user_1.default.create({
            studentNumber,
            lastName,
            firstName,
            middleName: middleName || null,
            password,
            role,
            yearLevel,
            membershipStatus: membershipStatusObj,
            registeredBy: req.user?.id || null,
        });
        // Populate registeredBy before sending response
        await newUser.populate('registeredBy', 'firstName lastName middleName');
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message,
        });
    }
};
exports.createUser = createUser;
// Bulk upload users
const bulkUploadUsers = async (req, res) => {
    try {
        const { users } = req.body;
        if (!Array.isArray(users) || users.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Users array is required',
            });
            return;
        }
        console.log(`📦 Processing bulk upload of ${users.length} users...`);
        console.log('📦 BULK UPLOAD - req.user:', req.user);
        const results = {
            success: [],
            failed: [],
        };
        for (const userData of users) {
            try {
                // Validate required fields
                if (!userData.studentNumber || !userData.firstName || !userData.lastName) {
                    results.failed.push({
                        studentNumber: userData.studentNumber || 'UNKNOWN',
                        reason: 'Missing required fields (studentNumber, firstName, lastName)',
                        data: userData,
                    });
                    continue;
                }
                // Check if user exists
                const existingUser = await user_1.default.findOne({
                    studentNumber: userData.studentNumber.toUpperCase(),
                });
                if (existingUser) {
                    results.failed.push({
                        studentNumber: userData.studentNumber,
                        reason: 'User with this student number already exists',
                        data: userData,
                    });
                    continue;
                }
                // ✅ NEW: Handle membership status - supports both string and object formats
                let membershipStatusObj = {
                    isMember: false,
                    membershipType: null,
                };
                // Check if membershipStatus is already an object (from frontend processing)
                if (userData.membershipStatus && typeof userData.membershipStatus === 'object') {
                    membershipStatusObj = {
                        isMember: userData.membershipStatus.isMember || false,
                        membershipType: userData.membershipStatus.membershipType || null,
                    };
                }
                // Handle string format (from Excel file)
                else if (userData.membershipStatus && typeof userData.membershipStatus === 'string') {
                    const statusLower = userData.membershipStatus.toLowerCase().trim();
                    if (statusLower === 'local') {
                        membershipStatusObj = {
                            isMember: true,
                            membershipType: 'local',
                        };
                    }
                    else if (statusLower === 'regional') {
                        membershipStatusObj = {
                            isMember: true,
                            membershipType: 'regional',
                        };
                    }
                    else if (statusLower === 'both') {
                        membershipStatusObj = {
                            isMember: true,
                            membershipType: 'both',
                        };
                    }
                    else if (statusLower === 'member') {
                        membershipStatusObj = {
                            isMember: true,
                            membershipType: null, // Generic member
                        };
                    }
                    // 'non-member' or any other value defaults to initial values
                }
                // Create new user
                const newUser = await user_1.default.create({
                    studentNumber: userData.studentNumber,
                    lastName: userData.lastName,
                    firstName: userData.firstName,
                    middleName: userData.middleName || null,
                    password: userData.password || '123456',
                    role: userData.role || 'student',
                    yearLevel: userData.yearLevel || null,
                    membershipStatus: membershipStatusObj,
                    registeredBy: req.user?.id || null,
                });
                results.success.push({
                    studentNumber: userData.studentNumber,
                    fullName: newUser.fullName,
                    id: newUser._id.toString(),
                });
                console.log(`✅ Created user: ${newUser.fullName} (${newUser.studentNumber}) - Member: ${membershipStatusObj.isMember}, Type: ${membershipStatusObj.membershipType}`);
            }
            catch (error) {
                console.error(`❌ Failed to create user ${userData.studentNumber}:`, error.message);
                results.failed.push({
                    studentNumber: userData.studentNumber || 'UNKNOWN',
                    reason: error.message || 'Unknown error occurred',
                    data: userData,
                });
            }
        }
        console.log(`✅ Bulk upload complete: ${results.success.length} succeeded, ${results.failed.length} failed`);
        res.status(201).json({
            success: true,
            message: `Bulk upload completed. ${results.success.length} succeeded, ${results.failed.length} failed`,
            data: results,
        });
    }
    catch (error) {
        console.error('❌ Bulk upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during bulk upload',
            error: error.message,
        });
    }
};
exports.bulkUploadUsers = bulkUploadUsers;
// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
            return;
        }
        // Don't allow updating certain fields directly
        delete updates.createdAt;
        delete updates.registeredBy;
        // If updating password, it will be hashed by pre-save middleware
        const updatedUser = await user_1.default.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true, runValidators: true }).populate('registeredBy', 'firstName lastName middleName');
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message,
        });
    }
};
exports.updateUser = updateUser;
// Toggle user active status
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
            return;
        }
        const user = await user_1.default.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        user.isActive = !user.isActive;
        await user.save();
        await user.populate('registeredBy', 'firstName lastName middleName');
        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling user status',
            error: error.message,
        });
    }
};
exports.toggleUserStatus = toggleUserStatus;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
            return;
        }
        const deletedUser = await user_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: { id },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};
exports.deleteUser = deleteUser;
// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await user_1.default.countDocuments();
        const activeUsers = await user_1.default.countDocuments({ isActive: true });
        const members = await user_1.default.countDocuments({ 'membershipStatus.isMember': true });
        const localMembers = await user_1.default.countDocuments({ 'membershipStatus.membershipType': 'local' });
        const regionalMembers = await user_1.default.countDocuments({ 'membershipStatus.membershipType': 'regional' });
        const bothMembers = await user_1.default.countDocuments({ 'membershipStatus.membershipType': 'both' });
        const nonMembers = await user_1.default.countDocuments({ 'membershipStatus.isMember': false });
        const roleStats = await user_1.default.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);
        const yearLevelStats = await user_1.default.aggregate([
            {
                $group: {
                    _id: '$yearLevel',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
                members,
                nonMembers,
                membershipBreakdown: {
                    local: localMembers,
                    regional: regionalMembers,
                    both: bothMembers,
                },
                roleStats,
                yearLevelStats,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message,
        });
    }
};
exports.getUserStats = getUserStats;
// Search users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
            return;
        }
        const searchRegex = new RegExp(query, 'i');
        const users = await user_1.default.find({
            $or: [
                { studentNumber: searchRegex },
                { firstName: searchRegex },
                { lastName: searchRegex },
                { middleName: searchRegex },
            ],
        })
            .populate('registeredBy', 'firstName lastName middleName')
            .limit(20);
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message,
        });
    }
};
exports.searchUsers = searchUsers;
