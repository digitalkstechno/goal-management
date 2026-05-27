const User = require("../models/User");
const Staff = require("../models/Staff");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { ROLES, getPermissionsByRole } = require("../utils/roles");

const register = (env) =>
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email and password are required.");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, "Email already registered.");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.ADMIN,
      permissions: getPermissionsByRole(ROLES.ADMIN),
    });

    const token = generateToken(user._id, env.jwtSecret);
    return sendSuccess(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, permissions: user.permissions },
      },
    });
  });

const login = (env) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    let user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    let userType = "user";

    if (!user) {
      user = await Staff.findOne({ email: email.toLowerCase() }).select("+password");
      userType = "staff";
    }

    if (!user) throw new ApiError(401, "Invalid email or password.");

    let isMatch = false;
    try {
      isMatch = await user.comparePassword(password);
    } catch (err) {
      console.error(`Auth error for ${user.email}:`, err);
      throw new ApiError(500, "Internal server error during authentication.");
    }

    if (!isMatch) throw new ApiError(401, "Invalid email or password.");
    if (!user.isActive) throw new ApiError(403, "Account is inactive.");

    const token = generateToken(user._id, env.jwtSecret);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, permissions: user.permissions, userType },
      },
    });
  });

const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: "Profile fetched successfully", data: req.user });
});

module.exports = { register, login, getMe };
