const express = require("express");
const {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  assignRole,
  deleteStaff,
  toggleStaffStatus,
} = require("../controllers/staffController");
const {
  protect,
  authorizeRoles,
  requirePermissions,
} = require("../middlewares/authMiddleware");
const { ROLES } = require("../utils/roles");

const buildStaffRoutes = (env) => {
  const router = express.Router();
  const auth = protect(env.jwtSecret);

  // Create staff - Only admins
  router.post(
    "/",
    auth,
    authorizeRoles(ROLES.ADMIN),
    requirePermissions("manage_staff"),
    createStaff
  );

  // Get all staff for admin - Only admins, managers and staff
  router.get(
    "/",
    auth,
    authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
    requirePermissions("view_staff"),
    getStaff
  );

  // Get staff by ID - Only admins, managers and staff
  router.get(
    "/:id",
    auth,
    authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF),
    requirePermissions("view_staff"),
    getStaffById
  );

  // Update staff - Only admins
  router.patch(
    "/:id",
    auth,
    authorizeRoles(ROLES.ADMIN),
    requirePermissions("manage_staff"),
    updateStaff
  );

  // Assign role to staff - Only admins
  router.patch(
    "/:id/role",
    auth,
    authorizeRoles(ROLES.ADMIN),
    requirePermissions("manage_staff"),
    assignRole
  );

  // Toggle staff status (activate/deactivate) - Only admins
  router.patch(
    "/:id/toggle-status",
    auth,
    authorizeRoles(ROLES.ADMIN),
    requirePermissions("manage_staff"),
    toggleStaffStatus
  );

  // Delete staff - Only admins
  router.delete(
    "/:id",
    auth,
    authorizeRoles(ROLES.ADMIN),
    requirePermissions("manage_staff"),
    deleteStaff
  );

  return router;
};

module.exports = buildStaffRoutes;
