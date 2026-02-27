

import db from "../config/dborg.js";
import * as model from "../models/organisation.model.js";

export const registerOrganisation = async (
  name,
  org_code,
  admin,
  selectedDepartments = [],
) => {
  if (!name) {
    return { success: false, message: "Organisation name is required" };
  }

  if (!org_code) {
    return { success: false, message: "Organisation code is required" };
  }

  if (!admin?.email) {
    return { success: false, message: "Admin details are required" };
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Step 1: Generate schema name (SAFE inside transaction)
    const lastId = await model.getLastOrgId(client);
    const schemaName = `org_${lastId + 1}`;

    // Optional safety check
    if (!/^org_\d+$/.test(schemaName)) {
      throw new Error("Invalid schema name");
    }

    // Step 2: Insert organisation
    const org = await model.createOrganisation(
      client,
      name,
      schemaName,
      org_code,
    );

    // Step 3: Create schema
    await model.createOrgSchema(client, schemaName);

    // Step 4: Copy template tables
    await model.copyTemplateTables(client, schemaName);

    await model.insertDefaultDepartments(
      client,
      schemaName,
      selectedDepartments,
    );

    // Step 5: Create admin user
    await model.createOrgAdmin(client, schemaName, {
      ...admin,
      org_code,
    });

    await client.query("COMMIT");

    return {
      success: true,
      message: "Organisation and Admin created successfully",
      data: org,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Organisation creation failed:", error);

    return {
      success: false,
      message: "Organisation creation failed",
    };
  } finally {
    client.release();
  }
};

/* List organisations (READ-ONLY) */
export const listOrganisations = async () => {
  const orgs = await model.getOrganisations();
  return {
    success: true,
    data: orgs,
  };
};



/* Remove Department from Organisation */
export const removeDepartmentFromOrg = async (org_code, department_name) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const org = await model.getOrganisationByCode(client, org_code);

    if (!org) {
      throw new Error("Organisation not found");
    }

    const schemaName = org.schema_name;

    await model.deleteDepartment(client, schemaName, department_name);

    await client.query("COMMIT");

    return {
      success: true,
      message: "Department removed successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");

    return {
      success: false,
      message: error.message,
    };
  } finally {
    client.release();
  }
};


// fetch all org codes and names (for validation)
export const fetchAllOrgCodesAndNames = async () => {
  try {
    const orgs = await model.getAllOrgCodesAndNames(); // updated model function

    return {
      success: true,
      data: orgs, // array of { org_code, name }
    };
  } catch (error) {
    console.error("Fetch Org Codes and Names Error:", error);

    return {
      success: false,
      message: "Failed to fetch organisation codes and names",
    };
  }
};


export const listDepartments = async () => {
  try {
    const departments = await model.getAllDepartments();
    return { success: true, data: departments };
  } catch (error) {
    console.error("Departments Service Error:", error);
    return { success: false, message: "Failed to fetch departments" };
  }
};

/* ---------------- Update Organisation ---------------- */
// export const updateOrganisationService = async (
//   id,
//   name,
//   admin,
//   selectedDepartments = [],
// ) => {
//   const client = await db.connect();

//   try {
//     await client.query("BEGIN");

//     const org = await model.getOrganisationById(client, id);
//     if (!org) throw new Error("Organisation not found");

//     // 1️⃣ Update organisation (name + admin, org_code unchanged)
//     const updatedOrg = await model.updateOrganisation(client, id, name, admin);

//     // 2️⃣ Update departments (clear and reinsert)
//     await model.clearDepartments(client, org.schema_name);

//     if (selectedDepartments && selectedDepartments.length > 0) {
//       await model.insertDefaultDepartments(
//         client,
//         org.schema_name,
//         selectedDepartments,
//       );
//     }

//     await client.query("COMMIT");

//     return {
//       success: true,
//       message: "Organisation updated successfully",
//       data: updatedOrg,
//     };
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Update Organisation Error:", error);

//     return {
//       success: false,
//       message: error.message || "Failed to update organisation",
//     };
//   } finally {
//     client.release();
//   }
// };

export const updateOrganisationService = async (
  id,
  name,
  admin,
  selectedDepartments = [],
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const org = await model.getOrganisationById(client, id);
    if (!org) throw new Error("Organisation not found");

    // 1️⃣ Update organisation basic details
    const updatedOrg = await model.updateOrganisation(client, id, name, admin);

    const schemaName = org.schema_name;

    // 2️⃣ Get existing departments
    const existingDepartments = await model.getDepartments(client, schemaName);

    // Convert to array of names
    const existingNames = existingDepartments.map((d) => d.name);

    // 3️⃣ Find departments to delete
    const departmentsToDelete = existingNames.filter(
      (name) => !selectedDepartments.includes(name),
    );

    // 4️⃣ Find departments to insert
    const departmentsToInsert = selectedDepartments.filter(
      (name) => !existingNames.includes(name),
    );

    // 5️⃣ Delete removed departments
    for (const name of departmentsToDelete) {
      await model.deleteDepartments(client, schemaName, name);
    }

    // 6️⃣ Insert new departments
    if (departmentsToInsert.length > 0) {
      await model.insertDepartments(client, schemaName, departmentsToInsert);
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "Organisation updated successfully",
      data: updatedOrg,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update Organisation Error:", error);

    return {
      success: false,
      message: error.message || "Failed to update organisation",
    };
  } finally {
    client.release();
  }
};

/* ---------------- Delete Organisation ---------------- */
export const deleteOrganisationService = async (id) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const deletedOrg = await model.deleteOrganisation(client, id);

    if (!deletedOrg) {
      await client.query("ROLLBACK");
      return { success: false, message: "Organisation not found" };
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "Organisation deleted successfully",
      data: deletedOrg,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete Organisation Error:", error);
    return { success: false, message: "Server Error" };
  } finally {
    client.release();
  }
};


/* ---------------- Get Single Organisation ---------------- */
export const getSingleOrganisation = async (id) => {
  const client = await db.connect();

  try {
    const org = await model.getOrganisationById(client, id);

    if (!org) {
      return {
        success: false,
        message: "Organisation not found",
      };
    }

    return {
      success: true,
      data: org,
    };
  } catch (error) {
    console.error("Get Organisation Error:", error);

    return {
      success: false,
      message: "Failed to fetch organisation",
    };
  } finally {
    client.release();
  }
};