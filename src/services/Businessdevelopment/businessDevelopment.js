// import BDModel from "../../models/Businessdevelopment/businessDevelopmet.js";

// const BusinessDevelopmentService = {
//   createBD: async (data) => {
//     return await BDModel.create({
//       ...data,
//       attachments: data.attachments || [], // ✅ ensure array
//     });
//   },

//   getAllBD: async () => {
//     return await BDModel.findAll();
//   },

//   getBDById: async (id) => {
//     return await BDModel.findById(id);
//   },
//   updateBD: async (id, payload) => {
//     const bd = await BDModel.findById(id);
//     if (!bd) throw new Error("Business request not found");

//     // Optional rule: block edits after submission
//     if (bd.bd_status !== "DRAFT" && bd.bd_status !== "CREATED") {
//       throw new Error("Only DRAFT / CREATED requests can be edited");
//     }

//     return await BDModel.updateBD(id, payload);
//   },
  

//   submitToFeasibility: async (id) => {
//     const bd = await BDModel.findById(id);
//     if (!bd) throw new Error("Business request not found");

//     if (bd.bd_status !== "DRAFT" && bd.bd_status !== "CREATED") {
//       throw new Error("Only DRAFT / CREATED requests can be submitted");
//     }

//     return await BDModel.updateStatus(id, "SUBMITTED", "PENDING");
//   },

//   getPendingFeasibility: async () => {
//     return await BDModel.getPendingFeasibility();
//   },

//   feasibilityReview: async (id, feasibility_status, feasibility_comments) => {
//   const allowed = ["APPROVED", "REJECTED", "PENDING"];
//   if (!allowed.includes(feasibility_status.trim().toUpperCase())) {
//     throw new Error("Invalid feasibility status");
//   }
//   return await BDModel.feasibilityReview(
//     id,
//     feasibility_status.trim().toUpperCase(),
//     feasibility_comments
//   );
// },

//   bdUpdate: async (id, bd_status, bd_comments) => {
//    const bd = await BDModel.findById(id);
// if (!bd) throw new Error("Business request not found");

    
//  return await BDModel.updateBD(id, bd_status, bd_comments);
//   },
// };

// export default BusinessDevelopmentService; // ✅ ESM default export


import BDModel from "../../models/Businessdevelopment/businessDevelopmet.js";

const BusinessDevelopmentService = {

  // -----------------------------
  // Create Business Development
  // -----------------------------
  createBD: async (org_code, data) => {
    try {
      console.log("service org code" ,org_code);
      return await BDModel.create( {
        ...data,
        attachments: data.attachments || [],
      },org_code);
    } catch (err) {
      console.error("❌ Error creating BD:", err);
      throw err;
    }
  },

  // -----------------------------
  // Get All
  // -----------------------------
  getAllBD: async (org_code) => {
    try {
      return await BDModel.findAll(org_code);
    } catch (err) {
      console.error("❌ Error fetching BD list:", err);
      throw err;
    }
  },

  // -----------------------------
  // Get By ID
  // -----------------------------
  getBDById: async (id, org_code) => {
    try {
      return await BDModel.findById(id, org_code);
    } catch (err) {
      console.error("❌ Error fetching BD by ID:", err);
      throw err;
    }
  },

  // -----------------------------
  // Update BD (Full Edit)
  // -----------------------------
  updateBD: async (id, payload, org_code) => {
    try {
      const bd = await BDModel.findById(id, org_code);
      if (!bd) throw new Error("Business request not found");

      if (bd.bd_status !== "DRAFT" && bd.bd_status !== "CREATED") {
        throw new Error("Only DRAFT / CREATED requests can be edited");
      }

      return await BDModel.updateBD(id, payload, org_code);
    } catch (err) {
      console.error("❌ Error updating BD:", err);
      throw err;
    }
  },

  // -----------------------------
  // Submit To Feasibility
  // -----------------------------
  submitToFeasibility: async (id, org_code) => {
    try {
      const bd = await BDModel.findById(id, org_code);
      if (!bd) throw new Error("Business request not found");

      if (bd.bd_status !== "DRAFT" && bd.bd_status !== "CREATED") {
        throw new Error("Only DRAFT / CREATED requests can be submitted");
      }

      return await BDModel.updateStatus(
        id,
        "SUBMITTED",
        "PENDING",
        org_code,
      );
    } catch (err) {
      console.error("❌ Error submitting BD:", err);
      throw err;
    }
  },

  // -----------------------------
  // Get Pending Feasibility
  // -----------------------------
  getPendingFeasibility: async (org_code) => {
    try {
      return await BDModel.getPendingFeasibility(org_code);
    } catch (err) {
      console.error("❌ Error fetching pending feasibility:", err);
      throw err;
    }
  },

  // -----------------------------
  // Feasibility Review
  // -----------------------------
  
  // -----------------------------
// Feasibility Review
// -----------------------------
feasibilityReview: async (id, feasibility_status, feasibility_comments, org_code) => {
  try {
    const cleanStatus = feasibility_status
      .replace("FEASIBILITY ", "")
      .trim()
      .toUpperCase();

    const allowed = ["APPROVED", "REJECTED", "PENDING"];

    if (!allowed.includes(cleanStatus)) {
      throw new Error("Invalid feasibility status");
    }

    return await BDModel.feasibilityReview(
      id,
      cleanStatus,
      feasibility_comments,
      org_code
    );
  } catch (err) {
    console.error("❌ Error in feasibility review:", err);
    throw err;
  }
},

  // -----------------------------
  // Update BD Status
  // -----------------------------
  bdUpdate: async (id, bd_status, bd_comments, org_code) => {
    try {
      const bd = await BDModel.findById(id, org_code);
      if (!bd) throw new Error("Business request not found");

      return await BDModel.updateBD(
        id,
        bd_status,
        bd_comments,
        org_code
      );
    } catch (err) {
      console.error("❌ Error updating BD status:", err);
      throw err;
    }
  },
};

export default BusinessDevelopmentService;
