# Features

> All planned features for the Clinic Imaging Manager product.

---

## Feature Status Legend

| Status      | Meaning                   |
| ----------- | ------------------------- |
| planned     | Not started               |
| specced     | Ready for implementation  |
| in progress | Currently being built     |
| done        | Completed                 |
| paused      | Started but deprioritized |

---

# Feature List

| Feature                                 | Status  | Priority | Notes                             |
| --------------------------------------- | ------- | -------- | --------------------------------- |
| User authentication                     | done    | P0       | Supabase Auth                     |
| Dashboard shell                         | done    | P0       | Sidebar + layout                  |
| User profile                            | done    | P1       | Basic profile page                |
| RBAC roles (clinic_admin / radiologist) | planned | P0       | Replace default roles             |
| Patient management                      | done    | P0       | Create, list, view patients       |
| Study management                        | done    | P0       | Organize scans by patient         |
| Study type management                   | done    | P1       | CRUD study types for studies      |
| Scan upload                             | planned | P0       | Upload images to Supabase Storage |
| Scan viewer                             | planned | P0       | View scans in browser             |
| Radiology report editor                 | planned | P0       | Radiologist writes reports        |
| Study details page                      | planned | P1       | Show scans + report               |
| Role-based dashboard navigation         | planned | P1       | Different menus for roles         |

---

# Feature Overview

## Patient Management

Clinic admins can:

* create patient records
* view patient list
* open patient profile

Patient data:

* name
* age
* gender
* created date

---

## Study Management

A **study** represents a scan session for a patient.

Each study:

* belongs to one patient
* contains one or more scan images
* may contain a radiology report

---

## Scan Upload

Clinic admins can upload scan images.

Images will be stored in:

Supabase Storage

Supported formats (MVP):

* JPG
* PNG

---

## Scan Viewer

Users can open a study and view scans in the browser.

Viewer capabilities:

* zoom
* pan
* full screen

Advanced radiology tools are out of scope for MVP.

---

## Radiology Reports

Radiologists can:

* write diagnostic reports
* edit reports
* save report linked to study

Clinic admins can:

* view reports
* cannot edit reports

---

## Role-Based Access

Two roles exist:

clinic_admin

* manage patients
* upload scans
* manage studies

radiologist

* view studies
* create reports

---

# Adding a Feature

1. Add feature to this list
2. Create folder:

```
features/<feature-name>/
```

3. Add:

* spec.md
* design.md
* tasks.md

4. Update status
