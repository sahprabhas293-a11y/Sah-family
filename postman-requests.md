# Postman request guide

Base URL: `http://localhost:8080`

## 1. Check application status
- Method: `GET`
- URL: `/api/health`

## 2. Create department
- Method: `POST`
- URL: `/api/departments`
- Body: raw JSON

```json
{
  "name": "Human Resources",
  "description": "Recruitment and employee records",
  "location": "Kathmandu"
}
```

## 3. List departments
- Method: `GET`
- URL: `/api/departments`

## 4. Get, update, or delete a department
- Method: `GET`, `PUT`, or `DELETE`
- URL: `/api/departments/DEPARTMENT_ID`
- For `PUT`, use a JSON body with `name`, `description`, and `location`.
- A department cannot be deleted while it has staff assigned.

## 5. Create staff record
- Method: `POST`
- URL: `/api/staff`
- Body: raw JSON. Replace the department ID with a real one.

```json
{
  "fullName": "Aarav Sah",
  "email": "aarav.sah@example.com",
  "phone": "+977-9800000000",
  "jobTitle": "IT Support Officer",
  "salary": 45000,
  "departmentId": "DEPARTMENT_ID"
}
```

## 6. List or filter staff
- All staff: `GET /api/staff`
- One department: `GET /api/staff?departmentId=DEPARTMENT_ID`

## 7. Get, update, or delete staff
- Method: `GET`, `PUT`, or `DELETE`
- URL: `/api/staff/STAFF_ID`
- For `PUT`, provide all required staff fields in JSON.
