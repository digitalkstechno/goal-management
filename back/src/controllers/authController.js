const User = require("../models/User");
const Staff = require("../models/Staff");
const ApiError = require("../utils/ApiError");
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

    // All new users are automatically assigned ADMIN role
    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.ADMIN,
      permissions: getPermissionsByRole(ROLES.ADMIN),
    });

    const token = generateToken(user._id, env.jwtSecret, env.jwtExpiresIn);
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        },
      },
    });
  });

const login = (env) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }
    console.log(`Login attempt for: ${email}`);

    let user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    let userType = "user";

    if (!user) {
      console.log(`Not found in User, checking Staff...`);
      user = await Staff.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );
      userType = "staff";
    }

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    let isMatch = false;
    try {
      isMatch = await user.comparePassword(password);
    } catch (err) {
      console.error(`Auth error for ${user.email}:`, err);
      throw new ApiError(500, "Internal server error during authentication.");
    }

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isActive) {
      console.log(`[AUTH] Account is inactive for ${userType} ${user.email}`);
      throw new ApiError(403, "Account is inactive.");
    }

    const token = generateToken(user._id, env.jwtSecret, env.jwtExpiresIn);
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          userType, // Optional: helpful for frontend to know
        },
      },
    });
  });

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
