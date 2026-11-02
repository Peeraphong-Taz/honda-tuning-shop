import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';

// In-memory fallback if MongoDB is not connected
const mockUsers = [
  {
    _id: 'mock-user-1',
    name: 'Honda Enthusiast',
    email: 'user@honda.com',
    passwordHash: bcrypt.hashSync('123456', 10),
    carModel: 'Honda Civic FE 1.5 Turbo',
    role: 'user'
  },
  {
    _id: 'mock-admin-1',
    name: 'Shop Owner (Admin)',
    email: 'admin@honda.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    carModel: 'Honda Civic Type R (FL5)',
    role: 'admin'
  }
];

export const register = async (req, res, next) => {
  try {
    const { name, email, password, carModel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        carModel: carModel || 'Honda Civic',
        role: 'user'
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          carModel: user.carModel,
          role: user.role
        }
      });
    } catch (dbErr) {
      // In-memory fallback
      const found = mockUsers.find(u => u.email === email);
      if (found) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }
      const newUser = {
        _id: 'user-' + Date.now(),
        name,
        email,
        passwordHash: bcrypt.hashSync(password, 10),
        carModel: carModel || 'Honda Civic',
        role: 'user'
      };
      mockUsers.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          carModel: newUser.carModel,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
      const user = await User.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            carModel: user.carModel,
            role: user.role
          }
        });
      }
    } catch (e) {
      // DB offline, fall through to mock
    }

    // Mock check
    const mock = mockUsers.find(u => u.email === email);
    if (mock && bcrypt.compareSync(password, mock.passwordHash)) {
      const token = generateToken(mock);
      return res.json({
        success: true,
        token,
        user: {
          id: mock._id,
          name: mock.name,
          email: mock.email,
          carModel: mock.carModel,
          role: mock.role
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    } catch (e) {
      // Mock fallback
    }

    const mock = mockUsers.find(u => u._id === req.user.id);
    if (mock) {
      return res.json({
        success: true,
        user: {
          id: mock._id,
          name: mock.name,
          email: mock.email,
          carModel: mock.carModel,
          role: mock.role
        }
      });
    }

    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};
