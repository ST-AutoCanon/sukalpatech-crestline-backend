import {
  fetchAllFeasibility,
  updateFeasibility,
} from "../services/feasibility.service.js";

/**
 * GET all feasibility requests
 */
export const getAllFeasibilityRequests = async (req, res) => {
  try {
    const data = await fetchAllFeasibility();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching feasibility:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * UPDATE feasibility status
 */
export const updateFeasibilityStatus = async (req, res) => {
  try {
    const { feasibility_status, feasibility_comments } = req.body;
    const { id } = req.params;

    await updateFeasibility(
      id,
      feasibility_status,
      feasibility_comments
    );

    res.status(200).json({
      success: true,
      message: "Feasibility updated successfully",
    });

  } catch (error) {
    console.error("❌ Error updating feasibility:", error);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};