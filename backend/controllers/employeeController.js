const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");

// @route   POST /api/employees
// @desc    Add a new employee
// @access  Private
const addEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, department, skills, performanceScore, experience } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "Employee with this email already exists." });
    }

    const employee = await Employee.create({
      name, email, department, skills, performanceScore, experience,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully.",
      employee,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/employees
// @desc    Get all employees (with optional filters)
// @access  Private
const getAllEmployees = async (req, res, next) => {
  try {
    const { department, minScore, maxScore, sortBy, order } = req.query;

    const query = {};
    if (department) query.department = department;
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const employees = await Employee.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/employees/search
// @desc    Search employees by department or name
// @access  Private
const searchEmployees = async (req, res, next) => {
  try {
    const { department, name, skill } = req.query;

    const query = {};
    if (department) query.department = { $regex: department, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };
    if (skill) query.skills = { $in: [new RegExp(skill, "i")] };

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/employees/:id
// @desc    Update employee details
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      employee,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/employees/rankings
// @desc    Get employees ranked by performance score
// @access  Private
const getEmployeeRankings = async (req, res, next) => {
  try {
    const employees = await Employee.find()
      .sort({ performanceScore: -1 })
      .select("name department performanceScore experience skills");

    const ranked = employees.map((emp, index) => ({
      rank: index + 1,
      ...emp.toObject(),
    }));

    res.status(200).json({ success: true, rankings: ranked });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeRankings,
};
