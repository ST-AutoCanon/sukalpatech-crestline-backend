import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

const BusinessDevelopmentModel = {
  // CREATE BD REQUEST
//   create: async (data, org_code) => {
//     const schema = await getSchemaFromOrgCode(org_code);

//     const query = `
//       INSERT INTO ${schema}.business_development (
//          bd_status,
//          bd_comments,
//          description,
//          priority,
//          required_date,
//          requested_by_department,
//          requested_by_person,
//          applicant_name, contact_person, mobile_number, email, address,
//          chassis_manufacturer, chassis_model, chassis_number, engine_number, wheelbase, fuel_type,
//          body_type,
//          seating_capacity, seat_type, flooring_type, interior_color,
//          body_material, paint_color, window_type, door_type,
//          ac, cctv, gps, fire_extinguisher, emergency_exit, led_board, usb, luggage_carrier, wheelchair_access,
//          ais_compliant, cmvr_compliant, school_bus_safety, state_transport_norms,
//          expected_delivery, approximate_budget,
//          attachments,
//          applicant_signature,
//          declaration_date,
//          place
//       )
//      VALUES (
//   $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
//   $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
//   $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
//   $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
//   $41,$42,$43,$44,$45,$46
// )

//       RETURNING *;
//     `;

//     const safe = (val) => (val === undefined || val === null || val === "" ? null : val);

//     const values = [
//       data.bd_status || "DRAFT",
//       safe(data.bd_comments),
//       safe(data.description),
//       safe(data.priority),
//       safe(data.required_date),
//       safe(data.requested_by_department),
//       safe(data.requested_by_person),
//       safe(data.applicant_name),
//       safe(data.contact_person),
//       safe(data.mobile_number),
//       safe(data.email),
//       safe(data.address),
//       safe(data.chassis_manufacturer),
//       safe(data.chassis_model),
//       safe(data.chassis_number),
//       safe(data.engine_number),
//       safe(data.wheelbase),
//       safe(data.fuel_type),
//       safe(data.body_type),
//       safe(data.seating_capacity),
//       safe(data.seat_type),
//       safe(data.flooring_type),
//       safe(data.interior_color),
//       safe(data.body_material),
//       safe(data.paint_color),
//       safe(data.window_type),
//       safe(data.door_type),
//       safe(data.ac),
//       safe(data.cctv),
//       safe(data.gps),
//       safe(data.fire_extinguisher),
//       safe(data.emergency_exit),
//       safe(data.led_board),
//       safe(data.usb),
//       safe(data.luggage_carrier),
//       safe(data.wheelchair_access),
//       safe(data.ais_compliant),
//       safe(data.cmvr_compliant),
//       safe(data.school_bus_safety),
//       safe(data.state_transport_norms),
//       safe(data.expected_delivery),
//       safe(data.approximate_budget),
//       data.attachments || [],
//       safe(data.applicant_signature),
//       safe(data.declaration_date),
//       safe(data.place),
//     ];

//     const { rows } = await thirdDB.query(query, values);
//     return rows[0];
//   },

create: async (data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  // ✅ Step 1: Get last display_id
  const lastRes = await thirdDB.query(
    `SELECT display_id FROM ${schema}.business_development 
     ORDER BY display_id DESC 
     LIMIT 1`
  );

  const nextDisplayId =
    lastRes.rows.length > 0 ? lastRes.rows[0].display_id + 1 : 1;

  // ✅ Step 2: Add display_id in INSERT
  const query = `
    INSERT INTO ${schema}.business_development (
         display_id,  -- ✅ ADD THIS
         bd_status,
         bd_comments,
         description,
         priority,
         required_date,
         requested_by_department,
         requested_by_person,
         applicant_name, contact_person, mobile_number, email, address,
         chassis_manufacturer, chassis_model, chassis_number, engine_number, wheelbase, fuel_type,
         body_type,
         seating_capacity, seat_type, flooring_type, interior_color,
         body_material, paint_color, window_type, door_type,
         ac, cctv, gps, fire_extinguisher, emergency_exit, led_board, usb, luggage_carrier, wheelchair_access,
         ais_compliant, cmvr_compliant, school_bus_safety, state_transport_norms,
         expected_delivery, approximate_budget,
         attachments,
         applicant_signature,
         declaration_date,
         place
      )
     VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
  $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
  $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
  $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
  $41,$42,$43,$44,$45,$46,$47  -- ✅ +1
)
RETURNING *;
  `;

  const safe = (val) =>
    val === undefined || val === null || val === "" ? null : val;

  const values = [
    nextDisplayId, // ✅ FIRST VALUE
    data.bd_status || "DRAFT",
    safe(data.bd_comments),
    safe(data.description),
    safe(data.priority),
    safe(data.required_date),
    safe(data.requested_by_department),
    safe(data.requested_by_person),
    safe(data.applicant_name),
    safe(data.contact_person),
    safe(data.mobile_number),
    safe(data.email),
    safe(data.address),
    safe(data.chassis_manufacturer),
    safe(data.chassis_model),
    safe(data.chassis_number),
    safe(data.engine_number),
    safe(data.wheelbase),
    safe(data.fuel_type),
    safe(data.body_type),
    safe(data.seating_capacity),
    safe(data.seat_type),
    safe(data.flooring_type),
    safe(data.interior_color),
    safe(data.body_material),
    safe(data.paint_color),
    safe(data.window_type),
    safe(data.door_type),
    safe(data.ac),
    safe(data.cctv),
    safe(data.gps),
    safe(data.fire_extinguisher),
    safe(data.emergency_exit),
    safe(data.led_board),
    safe(data.usb),
    safe(data.luggage_carrier),
    safe(data.wheelchair_access),
    safe(data.ais_compliant),
    safe(data.cmvr_compliant),
    safe(data.school_bus_safety),
    safe(data.state_transport_norms),
    safe(data.expected_delivery),
    safe(data.approximate_budget),
    data.attachments || [],
    safe(data.applicant_signature),
    safe(data.declaration_date),
    safe(data.place),
  ];

  const { rows } = await thirdDB.query(query, values);
  return rows[0];
},

  // GET ALL BD
  // findAll: async (org_code) => {
  //   const schema = await getSchemaFromOrgCode(org_code);
  //   const { rows } = await thirdDB.query(`SELECT * FROM ${schema}.business_development ORDER BY id DESC`);
  //   return rows;
  // },
  // GET ALL BD (WITH FILTER)
findAll: async (org_code, status) => {
  const schema = await getSchemaFromOrgCode(org_code);

  let query = `SELECT * FROM ${schema}.business_development`;
  let values = [];

  // ✅ Apply filter
  if (status && status !== "ALL") {
    query += ` WHERE bd_status = $1`;
    values.push(status);
  }

 query += ` ORDER BY display_id ASC`;
  const { rows } = await thirdDB.query(query, values);

  // ✅ IMPORTANT: Parse attachments JSON
  const parsedRows = rows.map((row) => ({
    ...row,
    attachments: (() => {
      try {
        return typeof row.attachments === "string"
          ? JSON.parse(row.attachments)
          : row.attachments || [];
      } catch {
        return [];
      }
    })(),
  }));

  return parsedRows;
},
  // GET BY ID
  findById: async (id, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);
    const { rows } = await thirdDB.query(`SELECT * FROM ${schema}.business_development WHERE id = $1`, [id]);
    return rows[0];
  },

  // UPDATE STATUS FOR SUBMIT TO FEASIBILITY
  updateStatus: async (id, bd_status, feasibility_status, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);
    const { rows } = await thirdDB.query(
      `UPDATE ${schema}.business_development SET bd_status=$1, feasibility_status=$2 WHERE id=$3 RETURNING *`,
      [bd_status, feasibility_status, id]
    );
    return rows[0];
  },

  // UPDATE FULL EDITABLE BD
  updateEditableBD: async (id, payload, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);

    const keys = Object.keys(payload);
    if (!keys.length) throw new Error("No fields provided for update");

    const values = Object.values(payload);
    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const query = `UPDATE ${schema}.business_development SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

    const { rows } = await thirdDB.query(query, [...values, id]);
    return rows[0];
  },

  // GET PENDING FEASIBILITY
  getPendingFeasibility: async (org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);
    const { rows } = await thirdDB.query(
      `SELECT * FROM ${schema}.business_development WHERE feasibility_status='PENDING' ORDER BY id DESC`
    );
    return rows;
  },

  // FEASIBILITY REVIEW
  feasibilityReview: async (id, feasibility_status, feasibility_comments, org_code) => {
    const schema = await getSchemaFromOrgCode(org_code);
    const { rows } = await thirdDB.query(
      `UPDATE ${schema}.business_development SET feasibility_status=$1, feasibility_comments=$2 WHERE id=$3 RETURNING *`,
      [feasibility_status, feasibility_comments, id]
    );
    return rows[0];
  },

  

  // BD UPDATE (after feasibility approval)
  updateBD: async (id, payload, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const fields = [];
  const values = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key} = $${index}`);
    values.push(payload[key]);
    index++;
  }

  values.push(id);

  const { rows } = await thirdDB.query(
    `UPDATE ${schema}.business_development 
     SET ${fields.join(", ")} 
     WHERE id = $${index} 
     RETURNING *`,
    values
  );

  return rows[0];
},

};

export default BusinessDevelopmentModel;
