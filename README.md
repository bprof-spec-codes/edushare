

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
2. Update database:
```powershell
update-database
```
3. Run the Web API (IIS Express or Kestrel)  
4. Swagger UI is available while the backend is running

---

## 🔐 Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | molnar.tamas@example.com | 123123123 |
| Teacher | testteacher@gmail.com | test |
| Student | toth.milan@example.com | 123123123 |

> Seeded users, subjects and materials are included.

---

## 🧭 Use-cases

### Users
- Register / log in
- Browse and filter materials
- PDF preview
- Rate and comment
- Save to favourites
- See recommended materials
- View download / open statistics

### Teachers
- Upload materials
- Set subject and semester
- Mark as **Recommended** or **Exam**
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
| Home / Materials | Browse, search and filter materials |
| Material page | PDF preview, comments, ratings, statistics |
| Favourites | Saved materials |
| Subject Management (Teacher) | Manage subjects |
| Admin Dashboard | Moderation & statistics |

> Screenshots will be added later.

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

The repository must include a `docs/` directory containing:
- `usermanual.pdf` — step-by-step end-user manual
- any additional documentation

Structure:
```
/docs
   └── usermanual.pdf
```

---

## Notes
Project developed at Óbuda University.  
SCRUM methodology; GitHub Issues & Projects used for tracking.
