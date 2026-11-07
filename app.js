const ENDPOINT = "https://docs.google.com/forms/d/e/1FAIpQLSfANQMVBZL67-pEaYGADTNLNsmUFwFWasDNcgpZkIrMtLXsBw/formResponse";
const ENTRY_IDS = {
  name: 1729838657,
  email: 1675897583,
  location: 1936091208,
  github: 1024284574,
  linkedin: 2133174874,
  availability: 1709997039,
  pay: 329680528,
  stack: 895075083,
  iac_level: 1736882114,
  shipped: 617983085,
  grounding: 350222479,
  evaluation: 61610046,
  plan_check: 1652205462,
  model_design: 1866922369,
};
const DRAFT_KEY = "wc-ai-engineer-draft";

const form = document.getElementById("form");
const errorBox = document.getElementById("error");
const submitBtn = document.getElementById("submit");
const saved = document.getElementById("saved");
const essay = document.getElementById("model_design");
const count = document.getElementById("count");

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function updateCount() {
  const words = essay.value.trim().split(/\s+/).filter(Boolean).length;
  count.textContent = words;
}

function saveDraft() {
  try {
    const { website, ...data } = readForm();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    saved.textContent = "draft saved";
  } catch {
    saved.textContent = "";
  }
}

function loadDraft() {
  try {
    const data = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    for (const [name, value] of Object.entries(data)) {
      const field = form.elements[name];
      if (!field) continue;
      if (field instanceof RadioNodeList) {
        for (const radio of field) radio.checked = radio.value === value;
      } else {
        field.value = value;
      }
    }
  } catch {
    localStorage.removeItem(DRAFT_KEY);
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

function validate() {
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  form.querySelectorAll(".invalid-group").forEach((el) => el.classList.remove("invalid-group"));

  let first = null;
  for (const el of form.querySelectorAll("[required]")) {
    if (el.checkValidity()) continue;
    if (el.type === "radio") el.closest(".field").classList.add("invalid-group");
    else el.classList.add("invalid");
    first = first || el;
  }
  return first;
}

function buildPayload(data) {
  const payload = new URLSearchParams();
  for (const [name, id] of Object.entries(ENTRY_IDS)) {
    payload.append(`entry.${id}`, data[name] || "");
  }
  return payload;
}

function showDone() {
  clearDraft();
  saved.textContent = "";
  form.hidden = true;
  const done = document.getElementById("done");
  done.hidden = false;
  done.focus();
  window.scrollTo(0, 0);
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

form.addEventListener("input", () => {
  updateCount();
  saveDraft();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  const first = validate();
  if (first) {
    showError(first === essay
      ? "The design answer needs more detail. Please write at least 400 characters."
      : "Please complete the highlighted fields.");
    first.focus();
    return;
  }

  const data = readForm();
  if (data.website) {
    showDone();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending";
  try {
    // Google Forms sends no CORS headers, so the response cannot be read here.
    await fetch(ENDPOINT, { method: "POST", mode: "no-cors", body: buildPayload(data) });
    showDone();
  } catch {
    showError("Your application was not sent. Your answers are still here, so please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit application";
  }
});

loadDraft();
updateCount();
