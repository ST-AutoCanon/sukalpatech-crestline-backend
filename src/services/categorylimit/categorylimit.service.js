
import { getCategoryLimit,addCategoryLimit, updateCategoryLimit,getApprovalLimitByCategory } from "../../models/categorylimit//categorylimit.modal.js";


export const getCategoryLimitService = async (org_code) => {
  const limits = await getCategoryLimit(org_code);

  if (!limits) {
    return {
      success: true,
      data: { high: 0, medium: 0, low: 0 },
    };
  }

  return { success: true, data: limits };
};


export const addCategoryLimitService = async (org_code, limits) => {
  const { high, medium, low } = limits;

  if (
    high === undefined ||
    medium === undefined ||
    low === undefined ||
    isNaN(high) ||
    isNaN(medium) ||
    isNaN(low) ||
    high < 0 ||
    medium < 0 ||
    low < 0
  ) {
    throw new Error("All category limits are required and must be valid numbers");
  }

  const addedLimit = await addCategoryLimit(org_code, {
    high: Number(high),
    medium: Number(medium),
    low: Number(low),
  });

  return { success: true, data: addedLimit };
};

// admin.controller.js or admin.service.js
export const updateCategoryLimitService = async (org_code, limits) => {
  let existing = await getCategoryLimit(org_code);

  // 🔥 If no limits exist, treat as ADD
  if (!existing) {
    const { high, medium, low } = limits;

    if (
      high === undefined ||
      medium === undefined ||
      low === undefined ||
      isNaN(high) ||
      isNaN(medium) ||
      isNaN(low) ||
      high < 0 ||
      medium < 0 ||
      low < 0
    ) {
      throw new Error("All category limits are required and must be valid numbers");
    }

    const added = await addCategoryLimit(org_code, {
      high: Number(high),
      medium: Number(medium),
      low: Number(low),
    });

    return { success: true, data: added };
  }

  // 🔥 Otherwise merge & update
  const updated = {
    high: limits.high !== undefined ? Number(limits.high) : existing.high,
    medium: limits.medium !== undefined ? Number(limits.medium) : existing.medium,
    low: limits.low !== undefined ? Number(limits.low) : existing.low,
  };

  if (
    isNaN(updated.high) ||
    isNaN(updated.medium) ||
    isNaN(updated.low) ||
    updated.high < 0 ||
    updated.medium < 0 ||
    updated.low < 0
  ) {
    throw new Error("Invalid category limits");
  }

  const updatedLimit = await updateCategoryLimit(org_code, updated);

  return { success: true, data: updatedLimit };
};

export const checkApprovalPermission = async (
  category,
  amount,
  org_code
) => {
  if (!category) {
    return { allowed: false, message: "User category not assigned" };
  }

  if (category.toUpperCase() === "HIGH") {
    return { allowed: true, limit: "Unlimited" };
  }

  const limitRaw = await getApprovalLimitByCategory(category, org_code);
  const limit = Number(limitRaw);

  if (isNaN(limit)) {
    return {
      allowed: false,
      message: "Invalid limit configuration",
    };
  }

  if (amount > limit) {
    return {
      allowed: false,
      message: `Approval denied. Limit for ${category} is ${limit}`,
      limit,
    };
  }

  return {
    allowed: true,
    limit,
  };
}