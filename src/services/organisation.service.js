

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

/* Add Department to Organisation */
export const addDepartmentToOrg = async (org_code, department_name) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const org = await model.getOrganisationByCode(client, org_code);

    if (!org) {
      throw new Error("Organisation not found");
    }

    const schemaName = org.schema_name;

    await model.insertDepartment(client, schemaName, department_name);

    await client.query("COMMIT");

    return {
      success: true,
      message: "Department added successfully",
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

    // 1️⃣ Update organisation (name + admin, org_code unchanged)
    const updatedOrg = await model.updateOrganisation(client, id, name, admin);

    // 2️⃣ Update departments (clear and reinsert)
    await model.clearDepartments(client, org.schema_name);

    if (selectedDepartments && selectedDepartments.length > 0) {
      await model.insertDefaultDepartments(
        client,
        org.schema_name,
        selectedDepartments,
      );
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
  if (!id) {
    return { success: false, message: "Organisation ID is required" };
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Fetch organisation to get schema name (optional: could be used for cleanup)
    const org = await model.getOrganisationById(client, id);
    if (!org) {
      await client.query("ROLLBACK");
      return { success: false, message: "Organisation not found" };
    }

    // 2️⃣ Delete organisation from master table
    const deletedOrg = await model.deleteOrganisation(client, id);

    // 3️⃣ Optional: you can also drop the schema if you want
    // await client.query(`DROP SCHEMA IF EXISTS ${org.schema_name} CASCADE`);

    await client.query("COMMIT");

    return {
      success: true,
      message: "Organisation deleted successfully",
      data: deletedOrg,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete Organisation Service Error:", error);
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