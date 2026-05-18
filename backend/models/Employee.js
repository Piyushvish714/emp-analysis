const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: ["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "QA"],
        message: "{VALUE} is not a valid department",
      },
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one skill is required",
      },
    },
    performanceScore: {
      type: Number,
      required: [true, "Performance score is required"],
      min: [0, "Score cannot be less than 0"],
      max: [100, "Score cannot exceed 100"],
    },
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"],
      max: [50, "Experience value seems too high"],
    },
    aiRecommendation: {
      type: String,
      default: null,
    },
    lastRecommendationDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for fast search
employeeSchema.index({ department: 1 });
employeeSchema.index({ email: 1 });

module.exports = mongoose.model("Employee", employeeSchema);
