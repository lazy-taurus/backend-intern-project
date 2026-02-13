const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

exports.register = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);

  const userExists = await User.findOne({ email: validatedData.email }).lean();
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await User.create(validatedData);

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});