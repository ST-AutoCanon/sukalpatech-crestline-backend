// import * as model from "../models/organisation.model.js";

// export const registerOrganisation = async (name, org_code) => {
//   if (!name) {
//     return { success: false, message: "Organisation name is required" };
//   }
//   if (!org_code) {
//     return { success: false, message: "Organisation code is required" };
//   }
//   // Step 1: Generate schema name
//   const lastId = await model.getLastOrgId();
//   const schemaName = `org_${lastId + 1}`;

//   // Step 2: Insert org record
//   const org = await model.createOrganisation(name, schemaName, org_code);

//   // Step 3: Create schema
//   await model.createOrgSchema(schemaName);

//   // Step 4: Copy template tables
//   await model.copyTemplateTables(schemaName);

//   return {
//     success: true,
//     message: "Organisation Registered Successfully",
//     data: org,
//   };
// };

// /* List organisations */
// export const listOrganisations = async () => {
//   const orgs = await model.getOrganisations();

//   return {
//     success: true,
//     data: orgs,
//   };
// };

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

//fetch all org codes (for validation)
export const fetchAllOrgCodes = async () => {
  try {
    const orgCodes = await model.getAllOrgCodes();

    return {
      success: true,
      data: orgCodes,
    };
  } catch (error) {
    console.error("Fetch Org Codes Error:", error);

    return {
      success: false,
      message: "Failed to fetch organisation codes",
    };
  }
};