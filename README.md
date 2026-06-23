#  SmartPass – Gate Pass Management System

## Overview

SmartPass is a full-stack MERN application designed to digitize and streamline the campus gate pass process. It enables students to apply for passes, administrators to approve or reject requests, and security personnel to verify and track entries/exits in real time.

---

##  Features

###  Student

* Apply for gate passes
* View pass status (Approved / Pending / Rejected)
* Track personal pass history

###  Admin (Warden)

* View all pass requests
* Approve or reject applications
* Monitor student activity

###  Security

* Verify passes using Pass ID
* Mark student OUT / IN
* View currently outside students

---

## 🛠️ Tech Stack

* **Frontend:** React.js, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas)
* **Authentication:** JWT (JSON Web Token)

---

## 🔗 Live Demo

https://smart-passs.netlify.app

---

##  Project Structure

### Frontend (React)

* Handles UI and user interactions
* Includes pages like Login, Register, and Dashboards
* Uses API layer to communicate with backend

### Backend (Node + Express)

* Handles API requests
* Contains routes, controllers, and database logic
* Manages authentication and role-based access

---

##  Application Flow

1. User registers or logs in
2. Frontend sends request to backend via API
3. Backend processes request using routes and controllers
4. Data is stored/retrieved from MongoDB
5. Response is sent back to frontend

---

##  Authentication

* JWT-based authentication system
* Token stored in browser (localStorage)
* Secures routes and enables role-based access control (RBAC)

---

##  API Overview

### Auth

* Register user
* Login user

### Pass Management

* Apply for pass
* Get user passes

### Admin

* Approve pass
* Reject pass

### Security

* Verify pass
* Log IN / OUT

---

##  Key Highlights

* Role-based dashboards (Student, Admin, Security)
* Real-time pass verification system
* Reduced manual entry/exit tracking effort by ~80%
* Clean and responsive UI design

---

##  Learning Outcomes

* Understood full-stack application architecture
* Learned API integration and backend workflows
* Gained hands-on experience with MongoDB and JWT authentication
* Improved debugging and deployment skills

---

##  Future Enhancements

* QR code-based pass verification
* Email/SMS notifications
* Analytics dashboard
* Improved UI/UX

---

## Conclusion

SmartPass demonstrates a complete end-to-end full-stack application with real-world use cases, showcasing skills in frontend development, backend integration, authentication, and database management.
