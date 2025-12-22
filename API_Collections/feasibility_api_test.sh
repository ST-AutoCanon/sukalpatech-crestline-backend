# -----------------------------
# Feasibility PR Tests
# -----------------------------

# 1️⃣ Get all feasibility PRs
curl -X GET http://localhost:5001/api/feasibility/prs \
  -H "Content-Type: application/json"

echo -e "\n\n"

# 2️⃣ Add feasibility comment to PR ID = 115
curl -X POST http://localhost:5001/api/feasibility/pr/comment \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 115,
    "commented_by": 2,
    "department": "AnyDepartment",
    "comment": "Feasibility review done."
  }'

echo -e "\n\n"

# 3️⃣ Update feasibility status for PR ID = 115
curl -X POST http://localhost:5001/api/feasibility/pr/status \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 115,
    "new_status": "Feasibility Approved",
    "old_status": "Feasibility Pending",
    "updated_by": 2,
    "department": "AnyDepartment",
    "note": "Checked all items, approved."
  }'

echo -e "\n\n"
