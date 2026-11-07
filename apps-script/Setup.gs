// One-time setup for the role forms. Run createRoleForms() once: it creates a form,
// a response sheet and a doc per role in Drive under "Wayne Citadel Applications",
// moves the AI Engineer files there too, and logs the IDs as JSON. Copy the IDs into
// Code.gs (ROLES) and into each role's apply.html, then run install().
const AI_FILES = {
  form: "1J8eAK61Z1d73rnRRrUlwQ4LQV82cjwuJZ8tUJyOS_ok",
  sheet: "1lGqlPof1kqKEPxkyilGow1mjDH_dEetYUpcLsU-5b9g",
  doc: "1KTytjdJWCimvj8RXXfy5h_KkzMUAnSb0P3lLWtM35Ik",
};
const NEW_ROLES = [
  { key: "frontend", name: "Frontend Engineer", items: [["Full name", "text"], ["Email", "text"], ["Location and timezone", "text"], ["GitHub or portfolio", "text"], ["LinkedIn", "text"], ["Hours per week", "text"], ["Budget not set yet", "text"], ["Stack", "paragraph"], ["UI testing level", "text"], ["Shipped frontend", "paragraph"], ["Performance answer", "paragraph"], ["Rendering answer", "paragraph"], ["Knowledge check", "text"], ["Design problem", "paragraph"]] },
  { key: "backend", name: "Backend Engineer", items: [["Full name", "text"], ["Email", "text"], ["Location and timezone", "text"], ["GitHub or portfolio", "text"], ["LinkedIn", "text"], ["Hours per week", "text"], ["Budget not set yet", "text"], ["Stack", "paragraph"], ["GitHub API level", "text"], ["Shipped backend", "paragraph"], ["Webhook answer", "paragraph"], ["Large plan answer", "paragraph"], ["Knowledge check", "text"], ["Design problem", "paragraph"]] },
  { key: "fullstack", name: "Full Stack Engineer", items: [["Full name", "text"], ["Email", "text"], ["Location and timezone", "text"], ["GitHub or portfolio", "text"], ["LinkedIn", "text"], ["Hours per week", "text"], ["Budget not set yet", "text"], ["Stack", "paragraph"], ["Auth level", "text"], ["Shipped product", "paragraph"], ["Install sync answer", "paragraph"], ["Suppression answer", "paragraph"], ["Knowledge check", "text"], ["Design problem", "paragraph"]] },
  { key: "cybersecurity", name: "Cybersecurity Engineer", items: [["Full name", "text"], ["Email", "text"], ["Location and timezone", "text"], ["GitHub or portfolio", "text"], ["LinkedIn", "text"], ["Hours per week", "text"], ["Budget not set yet", "text"], ["Stack", "paragraph"], ["AWS IAM level", "text"], ["Shipped security control", "paragraph"], ["IAM severity answer", "paragraph"], ["Workflow risk answer", "paragraph"], ["Knowledge check", "text"], ["Design problem", "paragraph"]] },
  { key: "ui-ux", name: "UI/UX Designer", items: [["Full name", "text"], ["Email", "text"], ["Location and timezone", "text"], ["GitHub or portfolio", "text"], ["LinkedIn", "text"], ["Hours per week", "text"], ["Budget not set yet", "text"], ["Stack", "paragraph"], ["Code level", "text"], ["Shipped design", "paragraph"], ["Research answer", "paragraph"], ["States answer", "paragraph"], ["Knowledge check", "text"], ["Design problem", "paragraph"]] },
  { key: "devops", name: "DevOps Engineer", items: [["Full name", "text"], ["Email", "text"], ["Location and timezone", "text"], ["GitHub or portfolio", "text"], ["LinkedIn", "text"], ["Hours per week", "text"], ["Budget not set yet", "text"], ["Stack", "paragraph"], ["Terraform and AWS level", "text"], ["Shipped pipeline", "paragraph"], ["Reproducibility answer", "paragraph"], ["Release answer", "paragraph"], ["Knowledge check", "text"], ["Design problem", "paragraph"]] },
];

function createRoleForms() {
  const root = folder(DriveApp.getRootFolder(), "Wayne Citadel Applications");

  FormApp.openById(AI_FILES.form).setTitle("Wayne Citadel AI Engineer Applications");
  const aiDir = folder(root, "AI Engineer");
  for (const id of Object.values(AI_FILES)) DriveApp.getFileById(id).moveTo(aiDir);

  const out = {};
  for (const role of NEW_ROLES) {
    const title = `Wayne Citadel ${role.name} Applications`;
    const form = FormApp.create(title).setCollectEmail(false).setAcceptingResponses(true);
    if (typeof form.setPublished === "function") form.setPublished(true);
    for (const [itemTitle, type] of role.items) {
      (type === "paragraph" ? form.addParagraphTextItem() : form.addTextItem()).setTitle(itemTitle);
    }
    const sheet = SpreadsheetApp.create(`${title} (Responses)`);
    form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
    const doc = DocumentApp.create(title);

    const dir = folder(root, role.name.replace("/", "-"));
    for (const id of [form.getId(), sheet.getId(), doc.getId()]) DriveApp.getFileById(id).moveTo(dir);

    out[role.key] = {
      form: form.getId(),
      sheet: sheet.getId(),
      doc: doc.getId(),
      endpoint: form.getPublishedUrl().replace(/\/viewform.*$/, "/formResponse"),
      entries: entryIds(form),
    };
  }
  console.log(JSON.stringify(out));
}

function folder(parent, name) {
  const found = parent.getFoldersByName(name);
  return found.hasNext() ? found.next() : parent.createFolder(name);
}

// A prefilled URL lists every item as entry.<id>=, in item order.
function entryIds(form) {
  const response = form.createResponse();
  for (const item of form.getItems()) {
    const typed = item.getType() === FormApp.ItemType.PARAGRAPH_TEXT ? item.asParagraphTextItem() : item.asTextItem();
    response.withItemResponse(typed.createResponse("x"));
  }
  return [...response.toPrefilledUrl().matchAll(/entry\.(\d+)=/g)].map((m) => Number(m[1]));
}
