import db from "../../config/dbfirst.js";

// -------------------------------
// Create new BD request
// -------------------------------
export const createBDRequest = async (data) => {
  const query = `
    INSERT INTO new_bus_body_building_request
    (
      applicant_company_name,
      contact_person_name,
      mobile_number,
      email_id,
      address,
      chassis_manufacturer,
      chassis_model,
      chassis_number,
      engine_number,
      wheelbase,
      fuel_type,
      body_type_required,
      seating_capacity,
      seat_type,
      flooring_type,
      interior_color_preference,
      body_material,
      paint_color_livery_details,
      window_type,
      door_type,
      additional_features,
      expected_delivery_date,
      approximate_budget,
      created_by,
      created_by_department
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
      $12,$13,$14,$15,$16,$17,$18,$19,$20,
      $21,$22,$23,$24,$25
    )
    RETURNING id
  `;

  const values = [
    data.applicant_company_name,
    data.contact_person_name,
    data.mobile_number,
    data.email_id || null,
    data.address || null,
    data.chassis_manufacturer || null,
    data.chassis_model || null,
    data.chassis_number || null,
    data.engine_number || null,
    data.wheelbase || null,
    data.fuel_type || null,
    data.body_type_required || null,
    data.seating_capacity || null,
    data.seat_type || null,
    data.flooring_type || null,
    data.interior_color_preference || null,
    data.body_material || null,
    data.paint_color_livery_details || null,
    data.window_type || null,
    data.door_type || null,
    data.additional_features || null,
    data.expected_delivery_date || null,
    data.approximate_budget || null,
    data.created_by,
    data.created_by_department,
  ];

  const result = await db.query(query, values);
  return result.rows[0].id;
};


// -------------------------------
// Create initial status (CREATED) for the request
// -------------------------------
export const createInitialStatus = async (request_id, data) => {
  const query = `
    INSERT INTO bus_body_request_department_status
    (
      request_id,
      department_name,
      status,
      comment,
      updated_by,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id
  `;

  const values = [
    request_id,
    data.created_by_department,
    "CREATED", // initial status
    data.comment || "Initial request",
    data.created_by,
    new Date(),
  ];

  const result = await db.query(query, values);
  return result.rows[0].id;
};
