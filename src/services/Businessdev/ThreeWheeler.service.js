// services/businessdev3/threeWheelerService.js
import { insertThreeWheelerBusiness,getThreeWheelerBusinesses } from "../../models/Businessdev/ThreeWheeler.modal.js";

export const createThreeWheelerBusiness = async (org_code, payload) => {
  return insertThreeWheelerBusiness(org_code, payload);
};

export const fetchThreeWheelerBusinesses = async (org_code) => {

  try {
    const businesses = await getThreeWheelerBusinesses(org_code);

    return {
      success: true,
      data: businesses,
    };

  } catch (error) {
    console.error("Fetch 2W Businesses Error:", error);

    return {
      success: false,
      message: "Failed to fetch 2W businesses",
    };
  }
};

/* ---------------- Update 2W Business ---------------- */
export const updateThreeWheelerBusiness = async (org_code, id, payload) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const updatedBusiness = await model.updateThreeWheelerBusiness(
      org_code,
      id,
      payload
    );

    if (!updatedBusiness) {
      await client.query("ROLLBACK");

      return {
        success: false,
        message: "2W Business not found",
      };
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "2W Business updated successfully",
      data: updatedBusiness,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update 2W Business Error:", error);

    return {
      success: false,
      message: "Failed to update 2W business",
    };
  } finally {
    client.release();
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