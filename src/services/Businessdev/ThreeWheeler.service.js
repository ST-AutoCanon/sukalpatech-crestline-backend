// services/businessdev3/threeWheelerService.js
import { insertThreeWheelerBusiness,getThreeWheelerBusinesses,reviewThreeWheelerBusiness as reviewModel,getThreeWheelerFeasibilityReviewed, updateThreeWheelerBusiness as updateThreeWheelerBusinessModel, reviewfinalThreeWheelerBusiness as reviewFinalModel} from "../../models/Businessdev/ThreeWheeler.modal.js";

export const createThreeWheelerBusiness = async (org_code, payload) => {
  return insertThreeWheelerBusiness(org_code, payload);
};

/* ---------------- Get All with optional status filter ---------------- */
export const fetchThreeWheelerBusinesses = async (org_code, statusFilter) => {
  try {
    const businesses = await getThreeWheelerBusinesses(org_code, statusFilter);

    return { success: true, data: businesses };

  } catch (error) {
    return { success: false, message: "Failed to fetch" };
  }
};


/* ---------------- Update 2W Business ---------------- */
export const updateThreeWheelerBusiness = async (id, org_code, payload) => {
  try {

    const updatedBusiness = await updateThreeWheelerBusinessModel(
      org_code,
      id,
      payload
    );

    if (!updatedBusiness) {
      return {
        success: false,
        message: "3W Business not found",
      };
    }

    return {
      success: true,
      message: "3W Business updated successfully",
      data: updatedBusiness,
    };

  } catch (error) {
    console.error("Update 3W Business Error:", error);

    return {
      success: false,
      message: "Failed to update 3W business",
    };
  }
};


/* ---------------- Delete 2W Business ---------------- */
export const deleteThreeWheelerBusiness = async (org_code, id) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const deletedBusiness = await model.deleteThreeWheelerBusiness(org_code, id);

    if (!deletedBusiness) {
      await client.query("ROLLBACK");

      return {
        success: false,
        message: "2W Business not found",
      };
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "2W Business deleted successfully",
      data: deletedBusiness,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete 2W Business Error:", error);

    return {
      success: false,
      message: "Failed to delete 2W business",
    };
  } finally {
    client.release();
  }
};

/* ---------------- Review 3W Business ---------------- */

export const reviewThreeWheelerBusiness = async (org_code, payload) => {
  try {

    const result = await reviewModel(org_code, payload);

    return {
      success: true,
      message: "3W feasibility updated",
      data: result
    };

  } catch (error) {

    console.error("Review 3W Error:", error);

    return {
      success: false,
      message: "Failed to update feasibility"
    };
  }
};

/* ---------------- Fetch all 2W Feasibility Updated Requests ---------------- */
export const fetchUpdatedThreeWheelerFeasibility = async (org_code) => {
  try {
    const allBusinesses = await model.getThreeWheelerBusinesses(org_code);

    // Filter only those with feasibility_status set
    const updated = allBusinesses.filter(
      (item) => item.feasibility_status && item.feasibility_status !== ""
    );

    return {
      success: true,
      data: updated
    };
  } catch (error) {
    console.error("Fetch Updated 3W Feasibility Error:", error);
    return {
      success: false,
      message: "Failed to fetch updated feasibility requests"
    };
  }
};

/* ---------------- Fetch 2W Feasibility Reviewed Requests ---------------- */
export const fetchThreeWheelerFeasibilityReviewed = async (org_code) => {
  try {
    const data = await getThreeWheelerFeasibilityReviewed(org_code); // use the imported function
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Fetch 3W feasibility reviewed requests error:", error);
    return {
      success: false,
      message: "Failed to fetch 3W feasibility reviewed requests"
    };
  }
};

export const reviewfinalThreeWheelerBusiness = async (org_code, payload) => {
  try {

    const result = await reviewFinalModel(org_code, payload);
    console.log("Updated 3W Row:", result.rows);

    return {
      success: true,
      message: "3W final review updated",
      data: result.data || result
    };

  } catch (error) {
    console.error("Review 3W Final Error:", error);

    return {
      success: false,
      message: "Failed to update final review"
    };
  }
};