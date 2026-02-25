// import * as service from "../services/organisation.service.js";

// export const registerOrg = async (req, res) => {
//   try {
//     const { name, org_code } = req.body;

//     const result = await service.registerOrganisation(name, org_code);

//     return res.status(result.success ? 201 : 400).json(result);
//   } catch (error) {
//     console.error("Organisation Register Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// export const getAllOrgs = async (req, res) => {
//   try {
//     const result = await service.listOrganisations();
//     res.json(result);
//   } catch (error) {
//     console.error("Organisation List Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };


import * as service from "../services/organisation.service.js";

// export const registerOrg = async (req, res) => {
//   try {
//     const {
//       name,
//       org_code,
//       admin, // 👈 receive admin details
//     } = req.body;

//     const result = await service.registerOrganisation(name, org_code, admin);

//     return res.status(result.success ? 201 : 400).json(result);
//   } catch (error) {
//     console.error("Organisation Register Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

export const registerOrg = async (req, res) => {
  try {
    const {
      name,
      org_code,
      admin,
      departments = [], // ✅ receive selected departments
    } = req.body;

    const result = await service.registerOrganisation(
      name,
      org_code,
      admin,
      departments, // ✅ pass to service
    );

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error("Organisation Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getAllOrgs = async (req, res) => {
  try {
    const result = await service.listOrganisations(org_code);
    return res.json(result);
  } catch (error) {
    console.error("Organisation List Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* Add Department */
export const addDepartmentToOrg = async (req, res) => {
  try {
    const { org_code, department_name } = req.body;

    if (!org_code || !department_name) {
      return res.status(400).json({
        success: false,
        message: "org_code and department_name are required",
      });
    }

    const result = await service.addDepartmentToOrg(
      org_code,
      department_name
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Add Department Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* Remove Department */
export const removeDepartmentFromOrg = async (req, res) => {
  try {
    const { org_code, department_name } = req.body;

    if (!org_code || !department_name) {
      return res.status(400).json({
        success: false,
        message: "org_code and department_name are required",
      });
    }

    const result = await service.removeDepartmentFromOrg(
      org_code,
      department_name
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Remove Department Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// get org codes and names
export const getOrgCodesAndNames = async (req, res) => {
  try {
    const result = await service.fetchAllOrgCodesAndNames(); // updated service function

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Get Org Codes and Names Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------- Update Organisation ---------------- */
export const updateOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, org_code, admin, departments = [] } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Organisation ID is required" });
    }

    const result = await service.updateOrganisation(id, name, org_code, admin, departments);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Update Organisation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------- Delete Organisation ---------------- */
export const deleteOrg = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Organisation ID is required" });
    }

    const result = await service.deleteOrganisation(id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Delete Organisation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
