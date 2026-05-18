const express = require("express");
const { getRecommendation, rankAllEmployees, getTrainingSuggestions } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/recommend", getRecommendation);
router.post("/rank-all", rankAllEmployees);
router.post("/training-suggestions", getTrainingSuggestions);

module.exports = router;
