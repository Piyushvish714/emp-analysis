const express = require("express");
const { body } = require("express-validator");
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeRankings,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Validation rules for adding/updating employee
const employeeValidation = [
  body("name").trim().notEmpty().withMessage("Employee name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("department")
    .isIn(["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "QA"])
    .withMessage("Invalid department"),
  body("skills").isArray({ min: 1 }).withMessage("At least one skill is required"),
  body("performanceScore")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Performance score must be between 0 and 100"),
  body("experience")
    .isFloat({ min: 0 })
    .withMessage("Experience must be a positive number"),
];

// All routes are protected
router.use(protect);

router.get("/search", searchEmployees);
router.get("/rankings", getEmployeeRankings);
router.get("/", getAllEmployees);
router.post("/", employeeValidation, addEmployee);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
