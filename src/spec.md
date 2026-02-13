# Specification

## Summary
**Goal:** Add QR code generation for current form values and enable full-form auto-fill when scanning those QR codes, while keeping fields editable and sharing the updated live site link.

**Planned changes:**
- Add a “Generate QR” action that encodes the current Name, Case Number, Crime Number, and Forward Date into the exact pipe-delimited string: `Name|CaseNo|CrimeNo|Date`.
- Update QR scanning handling to parse scanned values in the `Name|CaseNo|CrimeNo|Date` format and auto-populate all four fields.
- Keep existing fallback behavior: if the scanned value is not in the expected 4-part format, treat it as the Case Number only, and continue playing the existing scan success beep on successful scans.
- Ensure auto-filled fields remain editable and that edited values are what get submitted via “Add Record”.
- Provide a single updated live website URL after deployment for verification.

**User-visible outcome:** Users can generate a QR code from the form, scan a QR code to auto-fill Name/Case Number/Crime Number/Forward Date (with a safe fallback if format doesn’t match), edit any auto-filled values, and use the shared updated live link to verify the changes.
