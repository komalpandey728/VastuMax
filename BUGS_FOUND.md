# Bugs & Improvements Log - Vastu Marketplace [RESOLVED]

All identified bugs have been successfully resolved and tested.

---

| Bug ID | Component / Page | Description | Severity | Status | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | `ThreeSixtyViewer.jsx` | Image loading race condition where cached/base64 frames fail to fire `onLoad` consistently. | **High** | ✅ **Resolved** | Replaced React loader with a background preloader using native JavaScript `Image()` constructors and `Promise.all` loops. |
| **BUG-002** | `ThreeSixtyViewer.jsx` | Missing keyboard arrow navigation and visible frame counter tag (e.g. `1/12`). | **Medium** | ✅ **Resolved** | Implemented Left/Right keyboard arrow listeners, frame indexing labels, and an interactive bounce cursor hint. |
| **BUG-003** | `VehicleForm.jsx` | Deleting existing images in edit mode does not sync with backend/sandbox database. | **High** | ✅ **Resolved** | Configured `onSubmit` to append `existingImages` and `existing360` arrays, which are parsed by the Mongoose controller and sandbox engine. |
| **BUG-004** | `VehicleCatalog.jsx` | Comparison tray state is held in page memory only and cleared on route navigation. | **Medium** | ✅ **Resolved** | Linked comparison listings selection to `localStorage` (`vastu_compare_ids`) with auto-repopulation on mount hooks. |
| **BUG-005** | `Navbar.jsx` | Notification bell dropdown is non-functional and does not load user alerts. | **Medium** | ✅ **Resolved** | Integrated glassmorphic Bell dropdown, unread count badge, mark-as-read toggles, and direct dashboard page navigation. |
| **BUG-006** | `CustomerDashboard.jsx` | Coordinates values are not synced back to local context when profile is updated. | **Medium** | ✅ **Resolved** | Added a `useEffect` layout sync matching user coordinates state adjustments to the form variables. |
| **BUG-007** | `db.js` | Enforced strict image upload restrictions (min 5 photos, min 8 rotation frames) are not validated. | **Low** | ✅ **Resolved** | Added size length validation checkpoints in `onSubmit` before calling creation services. |
