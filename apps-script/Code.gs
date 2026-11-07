// Standalone Apps Script project. Run install() once to add a form-submit trigger per role.
// Each new response is appended to that role's applications doc in a readable layout.
const ROLES = {
  // AI Engineer
  "1J8eAK61Z1d73rnRRrUlwQ4LQV82cjwuJZ8tUJyOS_ok": {
    doc: "1KTytjdJWCimvj8RXXfy5h_KkzMUAnSb0P3lLWtM35Ik",
    check: { title: "Plan JSON check", correct: "C" },
    long: {
      "Stack": "What is your stack?",
      "Shipped LLM system": "Describe one LLM system you shipped.",
      "Grounding answer": 'Grounding: "This instance is exposed to the internet."',
      "Evaluation answer": "Evaluation: may we switch to a new model version?",
      "Model design": "Design problem: a deterministic model in the spirit of Jev",
    },
  },
  // Frontend Engineer
  "1AUY1owInNlL7Y8MOhxufsO_jw_Wx07S5QyRGO2043XY": {
    doc: "1KTrmOOC3-GUChkOgAnFg0uaUUdAGujEsLEnFqH4uTzc",
    check: { title: "Knowledge check", correct: "B" },
    long: {
      "Stack": "What is your stack?",
      "Shipped frontend": "Describe one frontend you shipped that people used every day.",
      "Performance answer": "A pull request produces 240 findings. The dashboard loads the full 8 MB JSON and freezes for four seconds on a mid-range laptop. How do you fix it?",
      "Rendering answer": "Finding explanations come from a language model. A resource tag in the plan contains <img src=x onerror=alert(1)>, and the explanation quotes it. How do you render explanations safely, and what may Markdown in them still do?",
      "Design problem": "Design problem: How would you build the review view?",
    },
  },
  // Backend Engineer
  "1_0fM2zXK5DVtPh7hn8gwDO3ByW8Ral2ZH3K3Sb2GZMg": {
    doc: "1quePxL7AH773gSiG9J2Zw19GxlGK5isGWWqeAKIhopY",
    check: { title: "Knowledge check", correct: "C" },
    long: {
      "Stack": "What is your stack?",
      "Shipped backend": "Describe one backend service you shipped and ran in production.",
      "Webhook answer": "GitHub delivers the same pull_request.synchronize webhook twice, 400 ms apart, and a third time an hour later after a manual redelivery. Our service posts a review comment for each. How do you make processing correct?",
      "Large plan answer": "A plan JSON from a large monorepo is 300 MB. The analyzer runs on a GitHub Actions runner with 7 GB of RAM and loads the whole file. How would you change it, and how do you prove the findings did not change?",
      "Design problem": "Design problem: How would you design the findings backend?",
    },
  },
  // Full Stack Engineer
  "1uwRNNdt3GGprfSBi_OHZpydAyABiQFevO6VN6eWa__g": {
    doc: "1Mz1ddVIpLQxT3cm4afnjWWRNrKjvYwkyJNrBwV7Gk1E",
    check: { title: "Knowledge check", correct: "C" },
    long: {
      "Stack": "What is your stack?",
      "Shipped product": "Describe one product you built end to end.",
      "Install sync answer": "A customer installs our GitHub App on 3 of their 40 repositories, then adds 10 more a week later. The dashboard still shows only the first 3. Where can this break, from webhook to UI, and how do you find it?",
      "Suppression answer": "A user suppresses a finding in the dashboard with the reason \"accepted risk\". The next push to the pull request still shows it in the comment. How do you design suppressions so the comment, SARIF and dashboard always agree?",
      "Design problem": "Design problem: How would you build the first-run experience end to end?",
    },
  },
  // Cybersecurity Engineer
  "1v7JEgiu_x6r65RuCy05ZjfLoWUyDxV6j3m94LuUiOb0": {
    doc: "1EiG2-fmIHhOyfLlNg3-Mu172KEJ-KTuK1Xdd7bETUhE",
    check: { title: "Knowledge check", correct: "C" },
    long: {
      "Stack": "What is your stack?",
      "Shipped security control": "Describe one security control or detection you built and kept running.",
      "IAM severity answer": "A pull request changes an IAM policy from s3:GetObject on one bucket to s3:* on arn:aws:s3:::*, with a condition on aws:SourceVpc. What severity should the analyzer assign, and what facts must the finding contain?",
      "Workflow risk answer": "Our Action runs on pull_request_target so it can comment on pull requests from forks. It checks out the pull-request head and runs terraform plan. What is the risk, and how would you redesign the workflow?",
      "Design problem": "Design problem: How would you threat model Wayne Citadel?",
    },
  },
  // UI/UX Designer
  "1PrMrwik9Rogmhsnvld3fQ2t11kVsghFlPmVOCf8qhXA": {
    doc: "1cfOSopyxl4FOAXq67_HS85AwDuupuuA6zuuPQrmlAW0",
    check: { title: "Knowledge check", correct: "B" },
    long: {
      "Stack": "What is your stack?",
      "Shipped design": "Describe one product or feature you designed that shipped.",
      "Research answer": "Reviewers say our pull-request comments are \"too long, I just scroll past\". 70% of comments are never expanded. What do you do in the first week, and what would you change?",
      "States answer": "An analysis ends in one of three states: findings, no findings, or incomplete, because some values are only known after apply. In early tests, users read \"incomplete\" as \"safe\". How do you design the three states so nobody makes that mistake?",
      "Design problem": "Design problem: How would you design the review experience?",
    },
  },
  // DevOps Engineer
  "18We6FIFpCrbR4dyGTI6lrPg8ViEfq9Ez_1nazLG49WQ": {
    doc: "1VeOWxLZP7IAc9h7xe8Nf8ne8uja4eVNGmPtIqccjuRk",
    check: { title: "Knowledge check", correct: "B" },
    long: {
      "Stack": "What is your stack?",
      "Shipped pipeline": "Describe one pipeline or platform you built and ran.",
      "Reproducibility answer": "We record plan fixtures by running terraform plan against real AWS test accounts. The same code should give the same plan JSON, but two runs a day apart differ. What causes this, and how do you make recording reproducible?",
      "Release answer": "Customers pin our Action as wayne-citadel/review@v1. How do you release a new version safely, and what do you do if v1.4.0 breaks plans for some customers an hour after release?",
      "Design problem": "Design problem: How would you build the CI and release system?",
    },
  },
  // Software Engineer
  "1dOfmRZcGr-6Fbqo5q_rTQlxMayfKhUlwdeMttIVWGFA": {
    doc: "1cdlnJ7hVlr-LMPHQQB5NikU0uM29LQE5ElP8YnTw37Y",
    check: { title: "Knowledge check", correct: "C" },
    long: {
      "Stack": "What is your stack?",
      "Shipped software": "Describe one piece of software you shipped that others depended on.",
      "Rule change answer": "A teammate changes the rule for public S3 buckets. All unit tests pass, but on the fixture library 37 findings change: 30 disappear and 7 are new. How do you decide whether the change can merge?",
      "Determinism answer": "The analyzer must give the same findings, in the same order, for the same plan. A customer reports that two runs on the same commit listed findings in a different order, and once a finding was missing. Where do you look, and how do you prevent it for good?",
      "Design problem": "Design problem: How would you design the rule engine?",
    },
  },
};

function install() {
  for (const t of ScriptApp.getProjectTriggers()) {
    if (t.getHandlerFunction() === "appendToDoc") ScriptApp.deleteTrigger(t);
  }
  for (const formId of Object.keys(ROLES)) {
    ScriptApp.newTrigger("appendToDoc").forForm(formId).onFormSubmit().create();
  }
}

function appendToDoc(e) {
  const role = ROLES[e.source.getId()];
  const answers = {};
  for (const r of e.response.getItemResponses()) {
    answers[r.getItem().getTitle()] = String(r.getResponse());
  }

  const body = DocumentApp.openById(role.doc).getBody();
  heading(body, answers["Full name"] || "Unnamed", DocumentApp.ParagraphHeading.HEADING1);

  const submitted = Utilities.formatDate(e.response.getTimestamp(), Session.getScriptTimeZone(), "M/d/yyyy HH:mm:ss");
  meta(body, "Submitted", submitted);
  for (const [title, value] of Object.entries(answers)) {
    if (title === "Full name" || title in role.long) continue;
    meta(body, title, title === role.check.title ? `${value} (correct: ${role.check.correct})` : value || "-");
  }

  for (const [title, question] of Object.entries(role.long)) {
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
