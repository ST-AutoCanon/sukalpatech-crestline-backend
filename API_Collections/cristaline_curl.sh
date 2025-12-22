#!/bin/bash
# Cristaline Procurement API - cURL Test Script
# =============================================
# This script contains all CRUD requests for testing the Procurement API.
# Make sure your server is running on port 5001 before executing.

# -----------------------------
# 1️⃣ Create Vendor
# -----------------------------
# Adds a new vendor to the system
curl -X POST http://localhost:5001/api/procurement/vendor \
  -H "Content-Type: application/json" \
  -d '{"vendor_name":"Acme Supplies"}'

echo -e "\n\n"

# -----------------------------
# 2️⃣ Get All Vendors
# -----------------------------
# Fetch all vendors from the database
curl http://localhost:5001/api/procurement/vendors

echo -e "\n\n"

# -----------------------------
# 3️⃣ Create PR (Procurement Request)
# -----------------------------
# Creates a new procurement request with items, comments, and attachments
curl -X POST http://localhost:5001/api/procurement/pr \
  -H "Content-Type: application/json" \
  -d '{
    "prData": {
      "project_name": "Project Alpha",
      "requested_by": 1,
      "requested_by_person": "Jane Smith",
      "priority": "High",
      "required_delivery_date": "2025-12-20",
      "remarks": "Urgent request",
      "status": "draft",
      "requesting_department_id": 2
    },
    "items": [
      {"item_name": "Laptop", "quantity_required": 5, "expected_rate": 1200}
    ],
    "comments": [
      {"commented_by": 1, "comment": "Please approve quickly"}
    ],
    "attachments": [
      {"file_name": "specs.pdf", "file_path": "/uploads/specs.pdf"}
    ]
  }'

echo -e "\n\n"

# -----------------------------
# 4️⃣ Get All PRs
# -----------------------------
# Fetch all procurement requests
curl http://localhost:5001/api/procurement/prs

echo -e "\n\n"

# -----------------------------
# 5️⃣ Add PR Item
# -----------------------------
# Add an item to an existing procurement request (PR ID = 21)
curl -X POST http://localhost:5001/api/procurement/pr/item \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 21,
    "item_name": "Monitor",
    "quantity_required": 10,
    "expected_rate": 250
  }'

echo -e "\n\n"

# -----------------------------
# 6️⃣ Add PR Comment
# -----------------------------
# Add a comment to a PR
curl -X POST http://localhost:5001/api/procurement/pr/comment \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 21,
    "commented_by": 1,
    "comment": "Approved by manager"
  }'

echo -e "\n\n"

# -----------------------------
# 7️⃣ Get PR Comments
# -----------------------------
# Fetch all comments for PR ID = 21
curl http://localhost:5001/api/procurement/pr/21/comments

echo -e "\n\n"

# -----------------------------
# 8️⃣ Add PR Attachment
# -----------------------------
# Add an attachment to a PR
curl -X POST http://localhost:5001/api/procurement/pr/attachment \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 21,
    "file_name": "invoice.pdf",
    "file_path": "/uploads/invoice.pdf"
  }'

echo -e "\n\n"

# -----------------------------
# 9️⃣ Add PR Vendors
# -----------------------------
# Add multiple vendors to PR ID = 21
curl -X POST http://localhost:5001/api/procurement/vendor/add \
  -H "Content-Type: application/json" \
  -d '{
    "pr_id": 21,
    "vendor_ids": [1, 5, 9]
  }'

echo -e "\n\n"

# -----------------------------
# 🔟 Get PR Vendors
# -----------------------------
# Fetch all vendors linked to PR ID = 21
curl -X GET http://localhost:5001/api/procurement/vendor/21 \
  -H "Content-Type: application/json"

echo -e "\n\n"

# -----------------------------
# 1️⃣1️⃣ Update PR
# -----------------------------
# Update PR ID = 21
curl -X PUT http://localhost:5001/api/procurement/21 \
  -H "Content-Type: application/json" \
  -H "x-department: Procurement" \
  -d '{
    "project_name": "Updated Project Name for PR 21",
    "priority": "High",
    "remarks": "Updated remarks for testing",
    "items": [
      { "item_id": 101, "item_name": "Updated Item 1", "quantity_required": "20" }
    ],
    "comments": [
      { "comment_id": 201, "comment": "Updated comment text" }
    ],
    "attachments": [],
    "vendors": [
      { "id": 10, "vendor_id": 5 }
    ]
  }'

echo -e "\n\n"

# -----------------------------
# 1️⃣2️⃣ Delete PR
# -----------------------------
# Delete PR ID = 21
curl -X DELETE http://localhost:5001/api/procurement/21 \
  -H "Content-Type: application/json" \
  -H "x-department: Procurement"

echo -e "\n\n"
