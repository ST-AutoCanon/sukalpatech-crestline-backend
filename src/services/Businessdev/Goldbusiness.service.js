// services/Businessdev/Goldbusiness.service.js

import {
  insertGoldBusiness,
  getGoldBusinesses,
  updateGoldBusiness as updateModel,
  deleteGoldBusiness as deleteModel,
  reviewGoldBusiness as reviewModel,
  getGoldFeasibilityReviewed,
  reviewFinalGoldBusiness as finalReviewModel
} from "../../models/Businessdev/Goldbusiness.modal.js";

/* ---------------- CREATE ---------------- */
export const createGoldBusiness = async (org_code, payload) => {
  return insertGoldBusiness(org_code, payload);
};


/* ---------------- FETCH ALL ---------------- */
export const fetchGoldBusinesses = async (org_code) => {
  try {
    const businesses = await getGoldBusinesses(org_code);

    return {
      success: true,
      data: businesses,
    };

  } catch (error) {
    console.error("Fetch Gold Businesses Error:", error);

    return {
      success: false,
      message: "Failed to fetch Gold businesses",
    };
  }
};


/* ---------------- UPDATE ---------------- */
export const updateGoldBusiness = async (org_code, id, payload) => {
  try {
    const updatedBusiness = await updateModel(org_code, id, payload);

    if (!updatedBusiness) {
      return {
        success: false,
        message: "Gold Business not found",
      };
    }

    return {
      success: true,
      message: "Gold Business updated successfully",
      data: updatedBusiness,
    };

  } catch (error) {
    console.error("Update Gold Business Error:", error);

    return {
      success: false,
      message: "Failed to update Gold business",
    };
  }
};


/* ---------------- DELETE ---------------- */
export const deleteGoldBusiness = async (org_code, id) => {
  try {
    const deletedBusiness = await deleteModel(org_code, id);

    if (!deletedBusiness) {
      return {
        success: false,
        message: "Gold Business not found",
      };
    }

    return {
      success: true,
      message: "Gold Business deleted successfully",
      data: deletedBusiness,
    };

  } catch (error) {
    console.error("Delete Gold Business Error:", error);

    return {
      success: false,
      message: "Failed to delete Gold business",
    };
  }
};


/* ---------------- FEASIBILITY REVIEW ---------------- */
export const reviewGoldBusiness = async (org_code, payload) => {
  try {
    const result = await reviewModel(org_code, payload);

    return {
      success: true,
      message: "Gold feasibility updated",
      data: result,
    };

  } catch (error) {
    console.error("Review Gold Error:", error);

    return {
      success: false,
      message: "Failed to update feasibility",
    };
  }
};


/* ---------------- FETCH FEASIBILITY REVIEWED ---------------- */
export const fetchGoldFeasibilityReviewed = async (org_code) => {
  try {
    const data = await getGoldFeasibilityReviewed(org_code);

    return {
      success: true,
      data,
    };

  } catch (error) {
    console.error("Fetch Gold feasibility reviewed error:", error);

    return {
      success: false,
      message: "Failed to fetch Gold feasibility reviewed requests",
    };
  }
};


/* ---------------- FINAL REVIEW ---------------- */
export const reviewFinalGoldBusiness = async (org_code, payload) => {
  try {
    const result = await finalReviewModel(org_code, payload);

    return {
      success: true,
      message: "Gold final review updated",
      data: result,
    };

  } catch (error) {
    console.error("Final Review Gold Error:", error);

    return {
      success: false,
      message: "Failed to update final review",
    };
  }
};