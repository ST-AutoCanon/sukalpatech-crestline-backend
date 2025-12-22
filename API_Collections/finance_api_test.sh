#!/bin/bash
# Cristaline Finance API - cURL Test Script
# =========================================
# This script tests Finance PR endpoints.
# Make sure your server is running on port 5001 before executing.

# -----------------------------
# 1️⃣ Get all Finance PRs
# -----------------------------
curl -X GET http://localhost:5001/api/finance/prs \
  -H "Content-Type: application/json"

echo -e "\n\n"

# -----------------------------
# 2️⃣ Add Finance Comment (feasibility approved PR)
# -----------------------------
curl -X POST http://localhost:5001/api/finance/pr/comment \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 115,
    "commented_by": 2,
    "department": "AnyDepartment",
    "comment": "Finance review completed."
  }'

echo -e "\n\n"

# -----------------------------
# 3️⃣ Update Finance Status (feasibility approved PR)
# -----------------------------
curl -X POST http://localhost:5001/api/finance/pr/status \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 115,
    "new_status": "Finance Approved",
    "old_status": "Pending Finance",
    "updated_by": 2,
    "department": "AnyDepartment",
    "note": "All financial checks passed."
  }'

echo -e "\n\n"
