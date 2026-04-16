const Task = require("../models/Task");
const { taskSchema, taskUpdateSchema } = require("../middleware/validate");

// Create a new task
const createTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, dueDate, status } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      status,
      userId: req.user.id, // from jwt token via auth middleware
    });

    await task.save();

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    next(err);
  }
};

// Get all tasks for the logged in user
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

// Get a single task by id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // make sure this task belongs to the logged in user
    if (task.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to access this task" });
    }

    res.json({ task });
  } catch (err) {
    // if id format is wrong, mongoose throws CastError
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    next(err);
  }
};

// Update task - only fields provided will be updated
const updateTask = async (req, res, next) => {
  try {
    const { error } = taskUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // check ownership
    if (task.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this task" });
    }

    // update only the fields that are sent in request
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // return updated document
    );

    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    next(err);
  }
};

// Delete a task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ownership check
    if (task.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    next(err);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
