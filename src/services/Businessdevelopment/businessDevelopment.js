import BDModel from "../../models/Businessdevelopment/businessDevelopmet.js";

const BusinessDevelopmentService = {
  createBD: async (data) => {
    return await BDModel.create({
      ...data,
      attachments: data.attachments || [], // ✅ ensure array
    });
  },

  getAllBD: async () => {
    return await BDModel.findAll();
  },

  getBDById: async (id) => {
    return await BDModel.findById(id);
  },

  submitToFeasibility: async (id) => {
    const bd = await BDModel.findById(id);
    if (!bd) throw new Error("Business request not found");

    if (bd.bd_status !== "DRAFT" && bd.bd_status !== "CREATED") {
      throw new Error("Only DRAFT / CREATED requests can be submitted");
    }

    return await BDModel.updateStatus(id, "SUBMITTED", "PENDING");
  },

  getPendingFeasibility: async () => {
    return await BDModel.getPendingFeasibility();
  },

  feasibilityReview: async (id, feasibility_status, feasibility_comments) => {
  const allowed = ["APPROVED", "REJECTED", "PENDING"];
  if (!allowed.includes(feasibility_status.trim().toUpperCase())) {
    throw new Error("Invalid feasibility status");
  }
  return await BDModel.feasibilityReview(
    id,
    feasibility_status.trim().toUpperCase(),
    feasibility_comments
  );
},

  bdUpdate: async (id, bd_status, bd_comments) => {
   const bd = await BDModel.findById(id);
if (!bd) throw new Error("Business request not found");

    


    return await BDModel.updateBD(id, bd_status, bd_comments);
  },
};


export default BusinessDevelopmentService; // ✅ ESM default export
