const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const { createTaskSchema, updateTaskSchema } = require('../validations/task.validation');
const { client } = require('../config/redis');

exports.createTask = asyncHandler(async (req, res) => {
  const validatedData = createTaskSchema.parse(req.body);
  
  const task = await Task.create({
    ...validatedData,
    user: req.user._id,
  });

  res.status(201).json(task);
});

exports.getTasks = asyncHandler(async (req, res) => {
  // Pagination & Filtering
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const status = req.query.status || 'all';
  const cacheKey = `tasks:${req.user._id}:page:${page}:limit:${limit}:status:${status}`;

  try {
    const cachedTasks = await client.get(cacheKey);
    if (cachedTasks) {
      return res.status(200).json(JSON.parse(cachedTasks));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const skip = (page - 1) * limit;

  const query = {};
  
  // Enforce data isolation
  if (req.user.role !== 'admin') {
    query.user = req.user._id;
  }
  
  if (req.query.status) {
    query.status = req.query.status;
  }

  const tasks = await Task.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Task.countDocuments(query);

  const responseData = {
    count: tasks.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: tasks,
  };

  try {
    await client.setEx(cacheKey, 300, JSON.stringify(responseData));
  } catch (err) {
    console.error("Redis set error:", err);
  }

  res.status(200).json(responseData);
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).lean();

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to access this task' });
  }

  res.status(200).json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const validatedData = updateTaskSchema.parse(req.body);
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this task' });
  }

  Object.assign(task, validatedData);
  await task.save();

  res.status(200).json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this task' });
  }

  await task.deleteOne();

  res.status(200).json({ message: 'Task removed successfully' });
});