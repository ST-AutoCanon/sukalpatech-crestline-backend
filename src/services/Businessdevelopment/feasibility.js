import BusinessDevelopmentService from "./businessDevelopment.service.js";

/**
 * Feasibility is calculated based on BD data
 * No DB table involved
 */
const FeasibilityService = {
  async checkFeasibilityByBDId(bdId) {
    const bd = await BusinessDevelopmentService.getBDById(bdId);

    if (!bd) {
      throw new Error("Business Development record not found");
    }

    let feasible = true;
    let reason = "Feasible";

    // Example feasibility rules
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

export default FeasibilityService;