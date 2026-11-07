# Wayne Citadel: AI Engineer application

Static application form, published with GitHub Pages. Submissions go to a Google Form.
An Apps Script bound to the form appends each response to a private Google Doc in a
readable layout. The form's linked Google Sheet stays as a raw backup.

- `index.html`: role and company overview
- `apply.html`, `app.js`: the form
- `styles.css`: shared styles
- `apps-script/Code.gs`: form-submit trigger that writes to the doc

## Setting up the doc trigger

1. Open the Google Form editor, then Extensions > Apps Script.
2. Replace the contents of `Code.gs` with `apps-script/Code.gs` and save.
3. Select `install` and click Run. Approve the permissions with the account that owns the form and the doc.
