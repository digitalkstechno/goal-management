const express = require("express");
const {
  fetchGoals,
  fetchGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

const buildGoalRoutes = (env) => {
  const router = express.Router();
  const { protect, requirePermissions } = require("../middlewares/authMiddleware");

  const auth = protect(env.jwtSecret);

  // GET /goals - Fetch all goals (requires view_goals permission)
  router.get("/", auth, requirePermissions("view_goals"), fetchGoals);

  // GET /goals/:id - Fetch a single goal (requires view_goals permission)
  router.get("/:id", auth, requirePermissions("view_goals"), fetchGoalById);

  // POST /goals - Create a new goal (requires manage_goals permission)
  router.post("/", auth, requirePermissions("manage_goals"), createGoal);

  // PUT /goals/:id - Update a goal
  router.put("/:id", auth, updateGoal);

  // DELETE /goals/:id - Delete a goal
  router.delete("/:id", auth, deleteGoal);

  return router;
};

module.exports = buildGoalRoutes;
