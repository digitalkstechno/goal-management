const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Fetch all tasks with optional filters
const fetchTasks = asyncHandler(async (req, res) => {
  const { actionId, status, priority, assignedUserId } = req.query;

  const query = {};

  if (actionId) query.actionId = actionId;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedUserId) query.assignedUserId = assignedUserId;

  const tasks = await Task.find(query)
    .populate("actionId", "name")
    .populate("assignedUserId", "name email role")
    .sort({ order: 1, createdAt: -1 })
    .exec();

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

// Fetch a single task by ID
const fetchTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate("actionId", "name")
    .populate("assignedUserId", "name email role")
    .exec();

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const {
    actionId,
    name,
    description,
    startDate,
    deadline,
    assignedUserId,
    assignedTeam,
    status,
    priority,
    notes,
    order,
  } = req.body;

  // Validation
  if (!actionId || !name || !startDate || !deadline) {
    throw new ApiError(
      400,
      "actionId, name, startDate, and deadline are required"
    );
  }

  if (new Date(startDate) >= new Date(deadline)) {
    throw new ApiError(400, "Start date must be before deadline");
  }

  // Calculate order if not provided
  let taskOrder = order;
  if (taskOrder === undefined) {
    const lastTask = await Task.findOne({ actionId }).sort({ order: -1 });
    taskOrder = lastTask ? (lastTask.order || 0) + 1 : 0;
  }

  const task = await Task.create({
    actionId,
    name,
    description,
    startDate,
    deadline,
    assignedUserId,
    assignedTeam,
    status,
    priority,
    notes,
    order: taskOrder,
  });

  const populatedTask = await task.populate([
    { path: "actionId", select: "name" },
    { path: "assignedUserId", select: "name email role" },
  ]);

  res.status(201).json({
    success: true,
    data: populatedTask,
  });
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    actionId,
    name,
    description,
    startDate,
    deadline,
    assignedUserId,
    assignedTeam,
    status,
    priority,
    notes,
    order,
    completedAt,
  } = req.body;

  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check for date validity
  const newStartDate = startDate ? new Date(startDate) : task.startDate;
  const newDeadline = deadline ? new Date(deadline) : task.deadline;

  if (newStartDate >= newDeadline) {
    throw new ApiError(400, "Start date must be before deadline");
  }

  // Update fields
  if (actionId) task.actionId = actionId;
  if (name) task.name = name;
  if (description !== undefined) task.description = description;
  if (startDate) task.startDate = startDate;
  if (deadline) task.deadline = deadline;
  if (assignedUserId !== undefined) task.assignedUserId = assignedUserId;
  if (assignedTeam !== undefined) task.assignedTeam = assignedTeam;
  if (status) {
    task.status = status;
    // Auto-set completedAt when status becomes "completed"
    if (status === "completed" && !task.completedAt) {
      task.completedAt = new Date();
    }
  }
  if (priority) task.priority = priority;
  if (notes !== undefined) task.notes = notes;
  if (order !== undefined) task.order = order;
  if (completedAt !== undefined) task.completedAt = completedAt;

  const updatedTask = await task.save();
  const populatedTask = await updatedTask.populate([
    { path: "actionId", select: "name" },
    { path: "assignedUserId", select: "name email role" },
  ]);

  res.status(200).json({
    success: true,
    data: populatedTask,
  });
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Task.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

// Reorder tasks within an action
const reorderTasks = asyncHandler(async (req, res) => {
  const { actionId, taskIds } = req.body;

  if (!actionId || !Array.isArray(taskIds) || taskIds.length === 0) {
    throw new ApiError(400, "actionId and taskIds array are required");
  }

  // Update order for each task
  const updatePromises = taskIds.map((taskId, index) =>
    Task.findByIdAndUpdate(
      taskId,
      { order: index },
      { new: true }
    )
  );

  const updatedTasks = await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    data: updatedTasks,
  });
});

module.exports = {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
