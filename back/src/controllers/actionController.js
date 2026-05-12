const Action = require("../models/Action");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Fetch all actions with optional filters
const fetchActions = asyncHandler(async (req, res) => {
  const { goalId, status, priority, ownerId } = req.query;

  const query = {};

  if (goalId) query.goalId = goalId;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (ownerId) query.ownerId = ownerId;

  const actions = await Action.find(query)
    .populate("goalId", "name")
    .populate("ownerId", "name email role")
    .populate("assignedUserIds", "name email role")
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({
    success: true,
    data: actions,
  });
});

// Fetch a single action by ID
const fetchActionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const action = await Action.findById(id)
    .populate("goalId", "name")
    .populate("ownerId", "name email role")
    .populate("assignedUserIds", "name email role")
    .exec();

  if (!action) {
    throw new ApiError(404, "Action not found");
  }

  res.status(200).json({
    success: true,
    data: action,
  });
});

// Create a new action
const createAction = asyncHandler(async (req, res) => {
  const { goalId, name, description, startDate, deadline, ownerId, assignedUserIds, status, priority } =
    req.body;

  // Validation
  if (!goalId || !name || !startDate || !deadline || !ownerId) {
    throw new ApiError(
      400,
      "goalId, name, startDate, deadline, and ownerId are required"
    );
  }

  if (new Date(startDate) >= new Date(deadline)) {
    throw new ApiError(400, "Start date must be before deadline");
  }

  const action = await Action.create({
    goalId,
    name,
    description,
    startDate,
    deadline,
    ownerId,
    assignedUserIds: assignedUserIds || [],
    status,
    priority,
  });

  const populatedAction = await action.populate([
    { path: "goalId", select: "name" },
    { path: "ownerId", select: "name email role" },
    { path: "assignedUserIds", select: "name email role" },
  ]);

  res.status(201).json({
    success: true,
    data: populatedAction,
  });
});

// Update an action
const updateAction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { goalId, name, description, startDate, deadline, ownerId, assignedUserIds, status, priority } =
    req.body;

  const action = await Action.findById(id);
  if (!action) {
    throw new ApiError(404, "Action not found");
  }

  // Check for date validity
  const newStartDate = startDate ? new Date(startDate) : action.startDate;
  const newDeadline = deadline ? new Date(deadline) : action.deadline;

  if (newStartDate >= newDeadline) {
    throw new ApiError(400, "Start date must be before deadline");
  }

  // Update fields
  if (goalId) action.goalId = goalId;
  if (name) action.name = name;
  if (description !== undefined) action.description = description;
  if (startDate) action.startDate = startDate;
  if (deadline) action.deadline = deadline;
  if (ownerId) action.ownerId = ownerId;
  if (assignedUserIds) action.assignedUserIds = assignedUserIds;
  if (status) action.status = status;
  if (priority) action.priority = priority;

  const updatedAction = await action.save();
  const populatedAction = await updatedAction.populate([
    { path: "goalId", select: "name" },
    { path: "ownerId", select: "name email role" },
    { path: "assignedUserIds", select: "name email role" },
  ]);

  res.status(200).json({
    success: true,
    data: populatedAction,
  });
});

// Delete an action and cascade delete associated tasks
const deleteAction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const action = await Action.findById(id);
  if (!action) {
    throw new ApiError(404, "Action not found");
  }

  // Delete all tasks associated with this action
  await Task.deleteMany({ actionId: id });

  // Delete the action
  await Action.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Action and associated tasks deleted successfully",
  });
});

module.exports = {
  fetchActions,
  fetchActionById,
  createAction,
  updateAction,
  deleteAction,
};
