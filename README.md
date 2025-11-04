

# EduShare

- [EduShare description](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/edushare.md)
- [CoC](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/coc.md)

## Team

| Name                          | Role | GitHub profile |
|------------------------------| ---- |---------------|
| Fenyvesi Barnabás            | Manager | [fbarnabas55](http://github.com/fbarnabas55) |
| Nagy Zsombor                 | Architect | [nzsombor04](http://github.com/nzsombor04) |
| Bátori András                | Frontend developer | [batoriandras](http://github.com/batoriandras) |
| Hanusz Bettina Alexandra     | Frontend developer | [hanuszbettina](http://github.com/hanuszbettina) |
| Zádori Áron                  | Backend developer | [zadoriaron](http://github.com/zadoriaron) |
| Keserű Gergely Márton        | Backend developer | [kesamarci](http://github.com/kesamarci) |

---

## Developer Guide

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

## Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | password |
| Teacher | testteacher@gmail.com | test |
| Student | teststudent@gmail.com | test |

> Seeded users, subjects and materials are included.

---

## Usage

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

## API Function List (excerpt)

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/materials` | GET | List materials |
| `/api/materials/upload` | POST | Upload material |
| `/api/materials/{id}/rate` | POST | Rate a material |
| `/api/materials/{id}/comment` | POST | Comment on a material |
| `/api/favourites` | GET | Get favourite materials |
| `/api/admin/moderate` | DELETE | Remove material/comment |
| `/api/admin/stats` | GET | Admin statistics |

> Full API is available via Swagger UI.

---

## UI Screens (overview)

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

## Problem Log

| Problem | Area | Resolution |
|---|---|---|
| CORS error | FE/BE | Configure allowed origins and headers in the API |
| PDF preview restrictions | FE | Embedded PDF viewer with proper CSP settings |
| EF migration conflict | BE | Resolved via `update-database` and schema reset |
| JWT token handling | FE | Implemented HTTP interceptor and secure storage |
| File upload size limit | BE | Increased request size and client-side validation |

---

## Documentation

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



































# EduShare

- [EduShare description](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/edushare.md)
- [CoC](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/coc.md)

## Team

| Név                          | Beosztás | GitHub profil |
|------------------------------| ---- |---------------|
| Fenyvesi Barnabás            | Manager | [fbarnabas55](http://github.com/fbarnabas55) |
| Nagy Zsombor                 | Architect | [nzsombor04](http://github.com/nzsombor04) |
| Bátori András                | Frontend developer | [batoriandras](http://github.com/batoriandras) |
| Hanusz Bettina Alexandra     | Frontend developer | [hanuszbettina](http://github.com/hanuszbettina) |
| Zádori Áron                  | Backend developer | [zadoriaron](http://github.com/zadoriaron) |
| Keserű Gergely Márton        | Backend developer | [kesamarci](http://github.com/kesamarci) |

---

## 📖 Guide
...

---

## 🖥️ Usage
The software can be run from the web:  
- The program is available at: https://....

### User Features
- User registration and login  
- Upload materials to subjects
- Rate and comment below materials

---

## 🔌 API Function List (excerpt)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | Register a new user |
| `/api/login` | POST | User login |
| `/api/logout` | POST | User logout |

---

## 🖼️ UI Screens (overview)
- **Login / Register** – user authentication  
- **Homepage** – overview, shows materials and statistics
---

## 📝 Problems
