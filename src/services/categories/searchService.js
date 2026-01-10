import * as searchModel from "../../models/categories/searchModel.js";

export async function searchCategories(query) {
  const results = await searchModel.searchCategoriesHierarchy(query);

  // Optional: Transform into hierarchical JSON for frontend
  const hierarchy = results.map((row) => ({
    root_category: {
      id: row.root_id,
      name: row.root_name,
      code: row.root_code,
    },
    category: row.category_id
      ? {
          id: row.category_id,
          name: row.category_name,
          code: row.category_code,
        }
      : null,
    product: row.product_id
      ? {
          id: row.product_id,
          name: row.product_name,
          code: row.product_code,
        }
      : null,
    variant: row.variant_id
      ? {
          id: row.variant_id,
          name: row.variant_name,
          code: row.variant_code,
        }
      : null,
    sub_variant: row.sub_variant_id
      ? {
          id: row.sub_variant_id,
          name: row.sub_variant_name,
          code: row.sub_variant_code,
        }
      : null,
  }));

  return hierarchy;
}


export async function searchItems(query) {
  const items = await searchModel.searchItems(query);

  return items.map((item) => ({
    id: item.id,
    code: item.item_code,
    name: item.item_name,
    qty: item.qty,
    vendors: item.vendors || [],
  }));
}


export async function getAllTablesService() {
  try {
    const tables = await searchModel.getTables();

    return {
      success: true,
      count: tables.length,
      data: tables.map((t) => t.table_name),
    };
  } catch (error) {
    console.error("Error fetching tables:", error);

    throw {
      success: false,
      message: "Failed to fetch database tables",
    };
  }
}