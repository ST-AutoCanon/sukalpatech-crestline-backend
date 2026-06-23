// import thirdDB from "../../config/dborg.js";
// import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

// /* ================= CREATE PROJECT ================= */
// export const createProject = async (data, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const query = `
//     INSERT INTO ${schema}.project_management (
//       bd_request_id,
//       description,
//       required_date,
//       assigned_date,
//       assigned_by
//     )
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *;
//   `;

//   const values = [
//     data.bd_request_id,
//     data.description,
//     data.required_date,
//     data.assigned_date,
//     data.assigned_by,
//   ];

//   const { rows } = await thirdDB.query(query, values);
//   return rows[0];
// };

// /* ================= CHECK DUPLICATE ================= */
// export const findProjectByBDId = async (bd_request_id, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);
//   console.log("schema:", schema);
//   const { rows } = await thirdDB.query(
//     `SELECT * FROM ${schema}.project_management WHERE bd_request_id = $1`,
//     [bd_request_id],
//   );

//   return rows[0];
// };

// /* ================= GET ALL PROJECTS ================= */
// export const fetchAllProjects = async (org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);
//   console.log("schema:", schema);
//   const { rows } = await thirdDB.query(
//     `SELECT * FROM ${schema}.project_management ORDER BY id DESC`,
//   );

//   return rows;
// };

// /* ================= UPSERT DEPARTMENT STATUS ================= */
// export const upsertProjectStatus = async (data, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const query = `
//     INSERT INTO ${schema}.project_management_status
//     (project_management_id, department, status, comments, updated_by)
//     VALUES ($1, $2, $3, $4, $5)
//     ON CONFLICT (project_management_id, department)
//     DO UPDATE SET
//       status = EXCLUDED.status,
//       comments = EXCLUDED.comments,
//       updated_by = EXCLUDED.updated_by,
//       updated_at = CURRENT_TIMESTAMP
//     RETURNING *;
//   `;

//   const values = [
//     data.project_management_id,
//     data.department,
//     data.status,
//     data.comments,
//     data.updated_by,
//   ];

//   const { rows } = await thirdDB.query(query, values);
//   return rows[0];
// };

// /* ================= GET STATUS BY PROJECT ================= */
// export const getProjectStatuses = async (project_id, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const { rows } = await thirdDB.query(
//     `SELECT * FROM ${schema}.project_management_status 
//      WHERE project_management_id = $1
//      ORDER BY updated_at DESC`,
//     [project_id],
//   );

//   return rows;
// };

// // Add or update workflow sequence for a project
// export const upsertProjectWorkflow = async (
//   project_id,
//   workflowArray,
//   org_code,
// ) => {
//   // workflowArray = [{ department: "HR", sequence: 1 }, { department: "Engineering", sequence: 2 }, ...]
//   const schema = await getSchemaFromOrgCode(org_code);

//   // First delete any existing workflow for the project
//   await thirdDB.query(
//     `DELETE FROM ${schema}.project_workflow WHERE project_management_id = $1`,
//     [project_id],
//   );

//   // Insert new workflow
//   const insertQuery = `
//     INSERT INTO ${schema}.project_workflow (project_management_id, department, sequence)
//     VALUES ($1, $2, $3)
//   `;

//   for (const wf of workflowArray) {
//     await thirdDB.query(insertQuery, [project_id, wf.department, wf.sequence]);
//   }

//   return { message: "Workflow updated successfully" };
// };

// export const getProjectWorkflow = async (project_id, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const query = `
//     SELECT id, project_management_id, department, sequence
//     FROM ${schema}.project_workflow
//     WHERE project_management_id = $1
//     ORDER BY sequence ASC
//   `;

//   const { rows } = await thirdDB.query(query, [project_id]);

//   return rows;
// };


// export const fetchProjectsForDepartment = async (department, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const { rows } = await thirdDB.query(
//     `
//     SELECT DISTINCT p.*, 
//       s_prev.status AS prev_status,
//       s_curr.status AS curr_status
//     FROM ${schema}.project_management p
//     JOIN ${schema}.project_workflow w
//       ON p.id = w.project_management_id
//     LEFT JOIN ${schema}.project_management_status s_curr
//       ON p.id = s_curr.project_management_id
//       AND s_curr.department = $1
//     LEFT JOIN ${schema}.project_management_status s_prev
//       ON p.id = s_prev.project_management_id
//       AND s_prev.department = (
//         SELECT department
//         FROM ${schema}.project_workflow
//         WHERE project_management_id = p.id
//           AND sequence = w.sequence - 1
//       )
//     WHERE w.department = $1
//       AND (s_curr.status IS NULL OR s_curr.status = 'PENDING')
//       AND (
//         w.sequence = 1 OR s_prev.status = 'APPROVED'
//       )
//     ORDER BY p.id DESC
//     `,
//     [department],
//   );

//   return rows;
// };

// export const getNextDepartment = async (
//   project_id,
//   current_department,
//   org_code,
// ) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const query = `
//     SELECT department, sequence
//     FROM ${schema}.project_workflow
//     WHERE project_management_id = $1
//       AND sequence > (
//         SELECT sequence
//         FROM ${schema}.project_workflow
//         WHERE project_management_id = $1
//           AND department = $2
//         LIMIT 1
//       )
//     ORDER BY sequence ASC
//     LIMIT 1;
//   `;

//   const { rows } = await thirdDB.query(query, [project_id, current_department]);

//   return rows[0] || null;
// };
// export const findProjectByBDId1 = async (bd_request_id, org_code) => {
//   const schema = await getSchemaFromOrgCode(org_code);

//   const query = `
//     SELECT *
//     FROM ${schema}.project_management
//     WHERE bd_request_id = $1
//     LIMIT 1
//   `;

//   const { rows } = await thirdDB.query(query, [bd_request_id]);

//   return rows[0]; // may be undefined
// };


import thirdDB from "../../config/dborg.js";
import { getSchemaFromOrgCode } from "../getSchemaFromOrgCode.js";

/* ================= CREATE PROJECT ================= */
export const createProject = async (data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    INSERT INTO ${schema}.project_management (
      bd_request_id,
      description,
      required_date,
      assigned_date,
      assigned_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    data.bd_request_id,
    data.description,
    data.required_date,
    data.assigned_date,
    data.assigned_by,
  ];

  const { rows } = await thirdDB.query(query, values);
  return rows[0];
};

export const updateAssignedTo = async (
  projectId,
  assigned_to,
  org_code
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    UPDATE ${schema}.project_management
    SET
      assigned_to = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await thirdDB.query(query, [
    assigned_to,
    projectId,
  ]);

  return result.rows[0];
};

/* ================= CHECK DUPLICATE ================= */
export const findProjectByBDId = async (bd_request_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  console.log("schema:", schema);
  const { rows } = await thirdDB.query(
    `SELECT * FROM ${schema}.project_management WHERE bd_request_id = $1`,
    [bd_request_id],
  );

  return rows[0];
};

/* ================= GET ALL PROJECTS ================= */
export const fetchAllProjects = async (org_code, status) => {
  const schema = await getSchemaFromOrgCode(org_code);

  let query = `
    SELECT 
      p.*,
      b.id AS bd_request_display_id,
      s.status AS latest_status

    FROM ${schema}.project_management p

    LEFT JOIN ${schema}.business_development b
      ON b.id = p.bd_request_id

    LEFT JOIN LATERAL (
      SELECT status
      FROM ${schema}.project_management_status
      WHERE project_management_id = p.id
      ORDER BY updated_at DESC
      LIMIT 1
    ) s ON true
  `;

  const values = [];

  query += ` WHERE 1=1 `;

  // optional filter
  if (status && status !== "ALL") {
    query += ` AND s.status = $1`;
    values.push(status);
  }

  query += ` ORDER BY p.id DESC`;

  const { rows } = await thirdDB.query(query, values);
  return rows;
};

/* ================= UPSERT DEPARTMENT STATUS ================= */
export const upsertProjectStatus = async (data, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const query = `
INSERT INTO ${schema}.project_management_status
(project_management_id, department, status, comments, completion_percentage, updated_by)

SELECT 
  $1::int,
  $2::varchar,
  $3::project_status_enum,
  $4::text,
  $5::int,
  $6::varchar

WHERE NOT EXISTS (
  SELECT 1 
  FROM ${schema}.project_management_status
  WHERE project_management_id = $1
    AND department = $2
    AND status = $3
  ORDER BY updated_at DESC
  LIMIT 1
)

RETURNING *;
`;

  const values = [
    data.project_management_id,
    data.department,
    data.status,
    data.comments,
    data.completion_percentage,
    data.updated_by,
  ];

  const { rows } = await thirdDB.query(query, values);
  return rows[0];
};

/* ================= GET STATUS BY PROJECT ================= */
export const getProjectStatuses = async (project_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);
  const { rows } = await thirdDB.query(
    `SELECT * FROM ${schema}.project_management_status 
     WHERE project_management_id = $1
     ORDER BY updated_at ASC`,
    [project_id],
  );
  return rows;
};

// Add or update workflow sequence for a project
export const upsertProjectWorkflow = async (
  project_id,
  workflowArray,
  org_code,
) => {
  // workflowArray = [{ department: "HR", sequence: 1 }, { department: "Engineering", sequence: 2 }, ...]
  const schema = await getSchemaFromOrgCode(org_code);

  // First delete any existing workflow for the project
  await thirdDB.query(
    `DELETE FROM ${schema}.project_workflow WHERE project_management_id = $1`,
    [project_id],
  );

  // Insert new workflow
  const insertQuery = `
  INSERT INTO ${schema}.project_workflow
  (
    project_management_id,
    task_title,
    department,
    assigned_to,
    priority,
    start_date,
    due_date,
    estimated_days,
    sequence,
    task_description
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
`;

  for (const wf of workflowArray) {
  await thirdDB.query(insertQuery, [
    project_id,               // $1
    wf.task_title,            // $2
    wf.department,            // $3
    wf.assigned_to,           // $4
    wf.priority,              // $5
    wf.start_date,            // $6
    wf.due_date,              // $7
    wf.estimated_days || null,// $8
    wf.sequence,              // $9
    wf.task_description       // $10
  ]);
}
  return { message: "Workflow updated successfully" };
};

export const getProjectWorkflow = async (project_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
SELECT
  id,
  project_management_id,
  task_title,
  department,
  assigned_to,
  priority,
  start_date,
  due_date,
  estimated_days,
  sequence,
  task_description
FROM ${schema}.project_workflow
WHERE project_management_id = $1
ORDER BY sequence ASC
`;

  const { rows } = await thirdDB.query(query, [project_id]);

  return rows;
};

export const fetchProjectsForDepartment = async (department, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const { rows } = await thirdDB.query(
    `
    SELECT DISTINCT p.*, 
     b.id AS bd_request_display_id,
      s_prev.status AS prev_status,
      s_curr.status AS curr_status

    FROM ${schema}.project_management p
      LEFT JOIN ${schema}.business_development b
    ON b.id = p.bd_request_id


    JOIN ${schema}.project_workflow w
      ON p.id = w.project_management_id

    -- ✅ CURRENT DEPARTMENT LATEST STATUS
    LEFT JOIN LATERAL (
      SELECT status
      FROM ${schema}.project_management_status
      WHERE project_management_id = p.id
        AND department = w.department
      ORDER BY updated_at DESC
      LIMIT 1
    ) s_curr ON true

    -- ✅ PREVIOUS DEPARTMENT LATEST STATUS
    LEFT JOIN LATERAL (
      SELECT status
      FROM ${schema}.project_management_status
      WHERE project_management_id = p.id
        AND department = (
          SELECT department
          FROM ${schema}.project_workflow
          WHERE project_management_id = p.id
            AND sequence = w.sequence - 1
          LIMIT 1
        )
      ORDER BY updated_at DESC
      LIMIT 1
    ) s_prev ON true

    WHERE w.department = $1
    AND (
  s_curr.status IS NULL
  OR s_curr.status IN ('PENDING', 'IN_PROGRESS', 'REJECTED')
)

    ORDER BY p.id DESC
    `,
    [department],
  );

  return rows;
};
export const getNextDepartment = async (
  project_id,
  current_department,
  org_code,
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT department, sequence
    FROM ${schema}.project_workflow
    WHERE project_management_id = $1
      AND sequence > (
        SELECT sequence
        FROM ${schema}.project_workflow
        WHERE project_management_id = $1
          AND department = $2
        LIMIT 1
      )
    ORDER BY sequence ASC
    LIMIT 1;
  `;

  const { rows } = await thirdDB.query(query, [project_id, current_department]);

  return rows[0] || null;
};
export const findProjectByBDId1 = async (bd_request_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE bd_request_id = $1
    LIMIT 1
  `;

  const { rows } = await thirdDB.query(query, [bd_request_id]);

  return rows[0]; // may be undefined
};

/* ================= GET PROJECT BY ID ================= */
export const findProjectById = async (project_id, org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT *
    FROM ${schema}.project_management
    WHERE id = $1
    LIMIT 1
  `;

  const { rows } = await thirdDB.query(query, [project_id]);

  return rows[0];
};

export const getProjectTasks = async (
  projectId,
  org_code
) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const result = await thirdDB.query(
    `
    SELECT *
    FROM ${schema}.project_workflow
     WHERE project_management_id = $1
    `,
    [projectId]
  );

  return result.rows;
};