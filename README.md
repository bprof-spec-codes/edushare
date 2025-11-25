

# 📚 EduShare

- [EduShare description](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/edushare.md)
- [CoC](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/coc.md)

## 👥 Team

| Name                          | Role | GitHub profile |
|------------------------------| ---- |---------------|
| Fenyvesi Barnabás            | Manager | [fbarnabas55](http://github.com/fbarnabas55) |
| Nagy Zsombor                 | Architect | [nzsombor04](http://github.com/nzsombor04) |
| Bátori András                | Frontend developer | [batoriandras](http://github.com/batoriandras) |
| Hanusz Bettina Alexandra     | Frontend developer | [hanuszbettina](http://github.com/hanuszbettina) |
| Zádori Áron                  | Backend developer | [zadoriaron](http://github.com/zadoriaron) |
| Keserű Gergely Márton        | Backend developer | [kesamarci](http://github.com/kesamarci) |

---

## <img width="25" alt="eduhog" src="https://github.com/user-attachments/assets/67e81705-b99a-495f-91a4-97c4b1a90c1d" /> Availability

The site is available for everyone at  https://edushareoe.hu

---

## 🧑‍💻 Developer Guide

### Requirements
- Node.js + npm
- Angular CLI
- Visual Studio (ASP.NET Core)
- SQL database (LocalDB / MSSQL)
- .NET EF tools

### Frontend (Angular)
```bash
cd Frontend/eduShare
npm install
ng serve
```
Runs at: `http://localhost:4200/`

### Backend (ASP.NET Core)
1. Open the solution in Visual Studio
2. Add Migration (if needed)
   ```powershell
   Add-Migration
   ```
3. Update database:
   ```powershell
   Update-Database
   ```
4. Run the Web API (IIS Express or Kestrel)  
5. Swagger UI is available while the backend is running

---

## 🔐 Develop Default Accounts after loaded Seed API

| Role | Email | Password |
|---|---|---|
| Admin | molnar.tamas@example.com | 123123123 |
| Teacher | testteacher@gmail.com | test |
| Student | toth.milan@example.com | 123123123 |

> Seeded users, subjects and materials are included.

---

## 🧭 Use-cases

### Users
- Upload materials
- Browse and filter materials
- PDF preview
- Download material
- Rate and comment a material
- Save material to favourites
- See recommended materials

### Teachers
- Set subjects and semesters
- Mark materials as **Recommended** or **Exam**
- Manage subjects

### Admins
- Remove inappropriate materials and comments
- Warn or ban users
- View statistics (most downloaded materials, most active uploader)

---

## 🔌 API Function List (excerpt)

| Endpoint | Method | Description |
|---|---|---|
| `/api/user/login` | POST | User login |
| `/api/user/register` | POST | User registration |
| `/api/user` | GET | List users |
| `/api/user/{id}` | GET | List user by ID |
| `/api/user/{id}` | PUT | Update user |
| `/api/user/{id}` | DELETE | Delete user |
| `/api/user/grantadmin/{userid}` | GET | Give admin |
| `/api/user/grantteacher/{userid}` | GET | Give teacher |
| `/api/user/revokerole/{userid}` | GET | Delete roles |
| `/api/material` | GET | List materials |
| `/api/material/{id}` | GET | List material by ID |
| `/api/material` | POST | Upload material |
| `/api/material/{id}` | DELETE | Delete material |
| `/api/material/{id}` | PUT | Update material |
| `/api/material/{id}/recommended` | PUT | Recommended status changes |
| `/api/material` | POST | Upload material |


> Full API is available via Swagger UI.

---

## 🖼️ UI Screens (overview)

| Screen | Purpose |
|---|---|
| Login / Register | User authentication |
| Home | navigation, important informations |
| Material upload | upload material |
| Materials list | browse, search and filter materials |
| Material | PDF preview, download, comments, ratings, statistics |
| Favourites | saved materials |
| Profile | update profile, uploaded materials |
| Profiles list | all users |
| Subject Management (Teacher) | Manage subjects |
| Admin Dashboard (Admin) | Moderation & statistics |

> Screenshots and guideline available in docs.

---

## 🧾 Problem Log

| Problem | Area | Resolution |
|---|---|---|
| CORS error | FE/BE | Configure allowed origins and headers in the API |
| PDF preview restrictions | FE | Embedded PDF viewer with proper CSP settings |
| EF migration conflict | BE | Resolved via `update-database` and schema reset |
| JWT token handling | FE | Implemented HTTP interceptor and secure storage |
| File upload size limit | BE | Increased request size and client-side validation |

---

## 📂 Documentation

The repository include a `docs/` directory:
- `usermanual.pdf` — step-by-step end-user manual

---

## Notes
Project developed at Óbuda University.  
SCRUM methodology; GitHub Issues & Projects used for tracking.
