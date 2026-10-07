# Author downloads

Seven files the index imports but that no web archive could capture at their origin. They are kept
here byte for byte as downloaded, so that the Wayback Machine can capture a fixed copy (the
commit-pinned URL of each file) and the importers can check that copy's SHA-256 before they read it
(docs/06-sources-playbook.md; docs/10-build-log.md B-186, B-187, B-900–B-904).

## Why they are here

- The UN Digital Library answers Save Page Now with a bot challenge, so the MARCXML export of a
  voting record cannot be captured at `https://digitallibrary.un.org/record/{id}/export/xm`.
- The SIPRI Arms Transfers Database builds its CSV exports with a POST request, so an export has no
  URL that Save Page Now can capture.
- The author downloaded the files in a browser on 2026-09-29 and uploaded them unchanged to the
  Internet Archive item `sipri_register_supplier_israel`
  (https://archive.org/details/sipri_register_supplier_israel). Save Page Now refuses to capture
  archive.org URLs (`error:blocked-url`), so on 2026-09-29 the author decided to keep them in this
  repository instead.

## Files

| File | Original | SHA-256 |
|---|---|---|
| `undl_4083529.xml` | UN Digital Library record 4083529 (A/RES/ES-10/27), MARCXML export | `696dac7e108983cf7f767800f49eed30a147d01c6bf9103bc6d9eca7a6a4d8fd` |
| `undl_4088074.xml` | UN Digital Library record 4088074 (A/DEC/80/506), MARCXML export | `ff464c230a650a62876abe571b726f4a2ba3fdf977d14449471840644fb51189` |
| `undl_4088513.xml` | UN Digital Library record 4088513 (A/RES/80/1), MARCXML export | `b73d5b980d49c7e1b597f75590397cc60f48f388f2a6b1905c8e34e2f160c882` |
| `undl_4095073.xml` | UN Digital Library record 4095073 (A/RES/80/78), MARCXML export | `7003708bb1ec43d7bd3d9fc01e72e0dc6b0cf404d095407408a2a04e1902d508` |
| `undl_4095497.xml` | UN Digital Library record 4095497 (A/RES/80/116), MARCXML export | `5682345cdb7ba1ffa09e208f5b79024c00d3dc785b7dea425e004de129f603cd` |
| `sipri_tiv_israel_2022-2025.csv` | SIPRI Arms Transfers Database, import/export values: recipient Israel, imports by supplier, 2022–2025 | `fcbaafb58d4566a5ccd444dc3365e14cf9efa5c1e704984d40506831b42ba878` |
| `sipri_register_supplier_israel.csv` | SIPRI Arms Transfers Database, transfer register: supplier Israel, all recipients, no year range, ordered by buyer | `3afdbe07d67d1e15e372c82f81f3cb07ca98c54afb84df8c650072b66cdfb28a` |

Each file has a dataset source record in `data/sources/` naming the original, the browser download,
the archive.org copy and the captured repository copy. Do not edit, re-save or reformat these files:
any change breaks the hash check.

## Credits and terms

- UN voting records: United Nations Dag Hammarskjöld Library, UN Digital Library
  (https://digitallibrary.un.org).
- Arms transfers: SIPRI Arms Transfers Database, Stockholm International Peace Research Institute
  (https://www.sipri.org/databases/armstransfers). Reproduced for non-commercial research under
  SIPRI's terms and conditions, with SIPRI named as the source; the two exports are small extracts of
  the database.
