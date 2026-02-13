const BDService = require("./businessDevelopment.service");

/**
 * Feasibility is calculated based on BD data
 * No DB table involved
 */
const FeasibilityService = {
  checkFeasibilityByBDId: async (bdId) => {
    const bd = await BDService.getBDById(bdId);

    if (!bd) {
      throw new Error("Business Development record not found");
    }

    // 🔹 Example feasibility logic
    let feasible = true;
    let reason = "Feasible";

    if (bd.quantity > 1000) {
      feasible = false;
      reason = "Quantity too high";
    }

    if (!bd.expected_timeline) {
      feasible = false;
      reason = "Timeline not defined";
    }

    return {
      businessDevelopmentId: bd.id,
      feasible,
      reason,
      checkedAt: new Date(),
    };
  },
};

module.exports = FeasibilityService;
