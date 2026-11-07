# Wayne Citadel: application site

Static application forms, published with GitHub Pages. Each role has its own landing
page and form, and submits to its own Google Form. An Apps Script trigger appends each
response to that role's private Google Doc in a readable layout. Each form's linked
Google Sheet stays as a raw backup. All forms, sheets and docs are in Drive under
"Wayne Citadel Applications", one folder per role.

| Role | Pages |
|---|---|
| AI Engineer | `index.html`, `apply.html` |
| Frontend Engineer | `frontend/` |
| Backend Engineer | `backend/` |
| Full Stack Engineer | `fullstack/` |
| Cybersecurity Engineer | `cybersecurity/` |
| UI/UX Designer | `ui-ux/` |
| DevOps Engineer | `devops/` |
| Software Engineer | `software/` |

- `app.js`: the form logic, shared by every role. Each `apply.html` defines `APPLICATION`
  with its form endpoint, entry IDs and draft key.
- `styles.css`: shared styles
- `apps-script/Code.gs`: form-submit trigger that writes each role's responses to its doc
- `apps-script/Setup.gs`: setup script that creates the role forms, sheets and docs

## Setting up the doc trigger

The triggers are installed in the standalone Apps Script project
"Wayne Citadel Applications to Doc" on the account that owns the forms and the docs.
To reinstall: paste `apps-script/Code.gs` into a project at script.google.com,
select `install`, click Run and approve the permissions.

## Adding a role

Add the role to `NEW_ROLES` in `Setup.gs` and run `createRoleForms()`. Roles that already
have a folder in Drive are skipped. It logs the new form, sheet and doc IDs, the form endpoint and the entry IDs in field order. Put the
endpoint and entry IDs in the role's `apply.html`, add the form to `ROLES` in `Code.gs`,
and run `install()`.
