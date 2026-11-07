# Wayne Citadel: AI Engineer application

Static application form, published with GitHub Pages. Submissions go to a Google Form.
An Apps Script bound to the form appends each response to a private Google Doc in a
readable layout. The form's linked Google Sheet stays as a raw backup.

- `index.html`: role and company overview
- `apply.html`, `app.js`: the form
- `styles.css`: shared styles
- `apps-script/Code.gs`: form-submit trigger that writes to the doc

## Setting up the doc trigger

The trigger is installed in the standalone Apps Script project
"Wayne Citadel Applications to Doc" on the account that owns the form and the doc.
To reinstall: paste `apps-script/Code.gs` into a new project at script.google.com,
select `install`, click Run and approve the permissions.
