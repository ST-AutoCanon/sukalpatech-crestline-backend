// services/businessdev2/twoWheelerService.js
import { insertTwoWheelerBusiness ,getTwoWheelerBusinesses,reviewTwoWheelerBusiness as reviewModel,getTwoWheelerFeasibilityReviewed,updateTwoWheelerBusiness as updateTwoWheelerBusinessModel,reviewfinalTwoWheelerBusiness as reviewFinalModel} from "../../models/Businessdev/TwoWheeler.modal.js";

export const createTwoWheelerBusiness = async (org_code, payload) => {
  // Add any business logic if needed
  return insertTwoWheelerBusiness(org_code, payload);
};

export const fetchTwoWheelerBusinesses = async (org_code, statusFilter) => {
  try {
    const businesses = await getTwoWheelerBusinesses(org_code, statusFilter);

    return { success: true, data: businesses };

  } catch (error) {
    return { success: false, message: "Failed to fetch" };
  }
};

/* ---------------- Update 2W Business ---------------- */
// export const updateTwoWheelerBusiness = async (org_code, id, payload) => {
//   const client = await db.connect();

//   try {
//     await client.query("BEGIN");

//     const updatedBusiness = await model.updateTwoWheelerBusiness(
//       org_code,
//       id,
//       payload
//     );

//     if (!updatedBusiness) {
//       await client.query("ROLLBACK");

//       return {
//         success: false,
//         message: "2W Business not found",
//       };
//     }

//     await client.query("COMMIT");

//     return {
//       success: true,
//       message: "2W Business updated successfully",
//       data: updatedBusiness,
//     };

//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Update 2W Business Error:", error);

//     return {
//       success: false,
//       message: "Failed to update 2W business",
//     };
//   } finally {
//     client.release();
//   }
// };
/* ---------------- Update 2W Business ---------------- */
export const updateTwoWheelerBusiness = async (id, org_code, payload) => {
  try {

    const updatedBusiness = await updateTwoWheelerBusinessModel(
      org_code,
      id,
      payload
    );

    if (!updatedBusiness) {
      return {
        success: false,
        message: "2W Business not found",
      };
    }

    return {
      success: true,
      message: "2W Business updated successfully",
      data: updatedBusiness,
    };

  } catch (error) {
    console.error("Update 2W Business Error:", error);

    return {
      success: false,
      message: "Failed to update 2W business",
    };
  }
};


/* ---------------- Delete 2W Business ---------------- */
export const deleteTwoWheelerBusiness = async (org_code, id) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const deletedBusiness = await model.deleteTwoWheelerBusiness(org_code, id);

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

export const reviewTwoWheelerBusiness = async (org_code, payload) => {
  try {

    const result = await reviewModel(org_code, payload);

    return {
      success: true,
      message: "2W feasibility updated",
      data: result
    };

  } catch (error) {

    console.error("Review 2W Error:", error);

    return {
      success: false,
      message: "Failed to update feasibility"
    };
  }
};


/* ---------------- Fetch all 2W Feasibility Updated Requests ---------------- */
export const fetchUpdatedTwoWheelerFeasibility = async (org_code) => {
  try {
    const allBusinesses = await model.getTwoWheelerBusinesses(org_code);

    // Filter only those with feasibility_status set
    const updated = allBusinesses.filter(
      (item) => item.feasibility_status && item.feasibility_status !== ""
    );

    return {
      success: true,
      data: updated
    };
  } catch (error) {
    console.error("Fetch Updated 2W Feasibility Error:", error);
    return {
      success: false,
      message: "Failed to fetch updated feasibility requests"
    };
  }
};

/* ---------------- Fetch 2W Feasibility Reviewed Requests ---------------- */
export const fetchTwoWheelerFeasibilityReviewed = async (org_code) => {
  try {
    const data = await getTwoWheelerFeasibilityReviewed(org_code); // use the imported function
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Fetch 2W feasibility reviewed requests error:", error);
    return {
      success: false,
      message: "Failed to fetch 2W feasibility reviewed requests"
    };
  }
};

export const reviewfinalTwoWheelerBusiness = async (org_code, payload) => {
  try {
    const result = await reviewFinalModel(org_code, {
      ...payload,
      final_status: payload.final_status,
      final_comment: payload.final_comment
    });

    return {
      success: true,
      message: "2W feasibility updated",
      data: result
    };

  } catch (error) {
    console.error("Review 2W Error:", error);
    return { success: false, message: "Failed to update feasibility" };
  }
};