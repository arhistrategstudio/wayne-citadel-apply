// Standalone Apps Script project. Run install() once to add the form-submit trigger.
// Each new response is appended to the applications doc in a readable layout.
const FORM_ID = "1J8eAK61Z1d73rnRRrUlwQ4LQV82cjwuJZ8tUJyOS_ok";
const DOC_ID = "1KTytjdJWCimvj8RXXfy5h_KkzMUAnSb0P3lLWtM35Ik";
const LONG_ANSWERS = {
  "Stack": "What is your stack?",
  "Shipped LLM system": "Describe one LLM system you shipped.",
  "Grounding answer": 'Grounding: "This instance is exposed to the internet."',
  "Evaluation answer": "Evaluation: may we switch to a new model version?",
  "Model design": "Design problem: a deterministic model in the spirit of Jev",
};
const PLAN_CHECK = "Plan JSON check";

function install() {
  for (const t of ScriptApp.getProjectTriggers()) {
    if (t.getHandlerFunction() === "appendToDoc") ScriptApp.deleteTrigger(t);
  }
  ScriptApp.newTrigger("appendToDoc").forForm(FORM_ID).onFormSubmit().create();
}

function appendToDoc(e) {
  const answers = {};
  for (const r of e.response.getItemResponses()) {
    answers[r.getItem().getTitle()] = String(r.getResponse());
  }

  const body = DocumentApp.openById(DOC_ID).getBody();
  heading(body, answers["Full name"] || "Unnamed", DocumentApp.ParagraphHeading.HEADING1);

  const submitted = Utilities.formatDate(e.response.getTimestamp(), Session.getScriptTimeZone(), "M/d/yyyy HH:mm:ss");
  meta(body, "Submitted", submitted);
  for (const [title, value] of Object.entries(answers)) {
    if (title === "Full name" || title in LONG_ANSWERS) continue;
    meta(body, title, title === PLAN_CHECK ? `${value} (correct: C)` : value || "-");
  }

  for (const [title, question] of Object.entries(LONG_ANSWERS)) {
    heading(body, question, DocumentApp.ParagraphHeading.HEADING2);
    text(body, answers[title] || "-");
  }
  body.appendHorizontalRule();
}

function heading(body, value, level) {
  body.appendParagraph(value).setHeading(level);
}

function meta(body, label, value) {
  const p = body.appendParagraph(`${label}: ${value}`).setHeading(DocumentApp.ParagraphHeading.NORMAL);
  const t = p.editAsText();
  t.setBold(false);
  t.setBold(0, label.length, true);
}

// Blank lines split paragraphs, "- " lines become bullets, ``` fences become monospace.
function text(body, value) {
  let code = null;
  let para = [];
  const flush = () => {
    if (para.length) body.appendParagraph(para.join("\n")).setHeading(DocumentApp.ParagraphHeading.NORMAL);
    para = [];
  };
  for (const line of value.replace(/\r/g, "").split("\n")) {
    if (line.startsWith("```")) {
      flush();
      if (code) {
        body.appendParagraph(code.join("\n")).setHeading(DocumentApp.ParagraphHeading.NORMAL).editAsText().setFontFamily("Courier New");
        code = null;
      } else {
        code = [];
      }
    } else if (code) {
      code.push(line);
    } else if (!line.trim()) {
      flush();
    } else if (line.startsWith("- ")) {
      flush();
      body.appendListItem(line.slice(2)).setGlyphType(DocumentApp.GlyphType.BULLET);
    } else {
      para.push(line);
    }
  }
  if (code) para.push(...code);
  flush();
}
