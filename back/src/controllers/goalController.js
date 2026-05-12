const Goal = require("../models/Goal");
const Action = require("../models/Action");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Fetch all goals with optional filters
const fetchGoals = asyncHandler(async (req, res) => {
  const { status, priority, ownerId, responsibleId, startDate, deadline } =
    req.query;

  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (ownerId) query.ownerId = ownerId;
  if (responsibleId) query.responsibleId = responsibleId;

  if (startDate || deadline) {
    query.deadline = {};
    if (startDate) query.deadline.$gte = new Date(startDate);
    if (deadline) query.deadline.$lte = new Date(deadline);
  }

  const goals = await Goal.find(query)
    .populate("ownerId", "name email role")
    .populate("responsibleId", "name email role")
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({
    success: true,
    data: goals,
  });
});

// Fetch a single goal by ID
const fetchGoalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id)
    .populate("ownerId", "name email role")
    .populate("responsibleId", "name email role")
    .exec();

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  res.status(200).json({
    success: true,
    data: goal,
  });
});

// Create a new goal
const createGoal = asyncHandler(async (req, res) => {
  const { name, description, startDate, deadline, ownerId, responsibleId, status, priority } = req.body;

  // Validation
  if (!name || !startDate || !deadline || !ownerId || !responsibleId) {
    throw new ApiError(
      400,
      "name, startDate, deadline, ownerId, and responsibleId are required"
    );
  }

  if (new Date(startDate) >= new Date(deadline)) {
    throw new ApiError(400, "Start date must be before deadline");
  }

  const goal = await Goal.create({
    name,
    description,
    startDate,
    deadline,
    ownerId,
    responsibleId,
    status,
    priority,
  });

  const populatedGoal = await goal.populate([
    { path: "ownerId", select: "name email role" },
    { path: "responsibleId", select: "name email role" },
  ]);

  res.status(201).json({
    success: true,
    data: populatedGoal,
  });
});

// Update a goal
const updateGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, startDate, deadline, ownerId, responsibleId, status, priority } =
    req.body;

  const goal = await Goal.findById(id);
  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  // Check for date validity
  const newStartDate = startDate ? new Date(startDate) : goal.startDate;
  const newDeadline = deadline ? new Date(deadline) : goal.deadline;

  if (newStartDate >= newDeadline) {
    throw new ApiError(400, "Start date must be before deadline");
  }

  // Update fields
  if (name) goal.name = name;
  if (description !== undefined) goal.description = description;
  if (startDate) goal.startDate = startDate;
  if (deadline) goal.deadline = deadline;
  if (ownerId) goal.ownerId = ownerId;
  if (responsibleId) goal.responsibleId = responsibleId;
  if (status) goal.status = status;
  if (priority) goal.priority = priority;

  const updatedGoal = await goal.save();
  const populatedGoal = await updatedGoal.populate([
    { path: "ownerId", select: "name email role" },
    { path: "responsibleId", select: "name email role" },
  ]);

  res.status(200).json({
    success: true,
    data: populatedGoal,
  });
});

// Delete a goal and cascade delete actions and tasks
const deleteGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id);
  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  // Find and delete all actions associated with this goal
  const actions = await Action.find({ goalId: id });
  const actionIds = actions.map((a) => a._id);

  // Delete all tasks associated with these actions
  if (actionIds.length > 0) {
    await Task.deleteMany({ actionId: { $in: actionIds } });
  }

  // Delete all actions
  if (actionIds.length > 0) {
    await Action.deleteMany({ goalId: id });
  }

  // Delete the goal
  await Goal.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Goal and associated data deleted successfully",
  });
});

module.exports = {
  fetchGoals,
  fetchGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
};
