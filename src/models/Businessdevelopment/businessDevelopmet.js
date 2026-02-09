import db from "../../config/dbfirst.js"; // assuming dbfirst is ESM compatible

const BusinessDevelopmentModel = {
  // CREATE BD REQUEST
  create: async (data) => {
    const query = `
      INSERT INTO business_development (
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
  $41,$42,$43,$44,$45,$46
)

      RETURNING *;
    `;

    const values = [
      data.bd_status || "DRAFT",
      data.bd_comments || null,
      data.description,
      data.priority,
      data.required_date,
      data.requested_by_department,
      data.requested_by_person,
      data.applicant_name,
      data.contact_person,
      data.mobile_number,
      data.email,
      data.address,
      data.chassis_manufacturer,
      data.chassis_model,
      data.chassis_number,
      data.engine_number,
      data.wheelbase,
      data.fuel_type,
      data.body_type,
      data.seating_capacity,
      data.seat_type,
      data.flooring_type,
      data.interior_color,
      data.body_material,
      data.paint_color,
      data.window_type,
      data.door_type,
      data.ac,
      data.cctv,
      data.gps,
      data.fire_extinguisher,
      data.emergency_exit,
      data.led_board,
      data.usb,
      data.luggage_carrier,
      data.wheelchair_access,
      data.ais_compliant,
      data.cmvr_compliant,
      data.school_bus_safety,
      data.state_transport_norms,
      data.expected_delivery,
      data.approximate_budget,
      data.attachments || [],
      data.applicant_signature || "",
      data.declaration_date || null,
      data.place || "",
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // GET ALL BD
  findAll: async () => {
    const { rows } = await db.query(
      "SELECT * FROM business_development ORDER BY id DESC"
    );
    return rows;
  },

  // GET BY ID
  findById: async (id) => {
    const { rows } = await db.query(
      "SELECT * FROM business_development WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  // UPDATE STATUS FOR SUBMIT TO FEASIBILITY
  updateStatus: async (id, bd_status, feasibility_status) => {
    const { rows } = await db.query(
      `UPDATE business_development
       SET bd_status=$1, feasibility_status=$2
       WHERE id=$3
       RETURNING *`,
      [bd_status, feasibility_status, id]
    );
    return rows[0];
  },
  // UPDATE FULL EDITABLE BD (Edit Modal Save)
updateEditableBD: async (id, payload) => {
  const keys = Object.keys(payload);

  if (keys.length === 0) {
    throw new Error("No fields provided for update");
  }

  const values = Object.values(payload);

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const query = `
    UPDATE business_development
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const { rows } = await db.query(query, [...values, id]);
  return rows[0];
},


  // GET PENDING FEASIBILITY REQUESTS
  getPendingFeasibility: async () => {
    const { rows } = await db.query(
      `SELECT * FROM business_development 
       WHERE feasibility_status='PENDING'
       ORDER BY id DESC`
    );
    return rows;
  },

  // FEASIBILITY REVIEW
  feasibilityReview: async (id, feasibility_status, feasibility_comments) => {
    const { rows } = await db.query(
      `UPDATE business_development
       SET feasibility_status=$1, feasibility_comments=$2
       WHERE id=$3
       RETURNING *`,
      [feasibility_status, feasibility_comments, id]
    );
    return rows[0];
  },

  // BD UPDATE (after feasibility approval)
  updateBD: async (id, bd_status, bd_comments) => {
    const { rows } = await db.query(
      `UPDATE business_development
       SET bd_status = $1,
           bd_comments = $2
       WHERE id = $3
       RETURNING *`,
      [bd_status, bd_comments, id]
    );

    return rows[0];
  },

};

// ✅ Export as ESM default
export default BusinessDevelopmentModel;
