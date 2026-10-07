const INVENTORY_SHEET = "الاصناف والكميات";
const SUPPLY_SHEET = "طلبات التوريد";
const PHARMACY_SHEET = "بيانات الصيداليات";
const numberFormat = new Intl.NumberFormat("ar-EG");
const state = { inventory: [], supplyByNumber: new Map(), pharmacies: [], matches: [], saved: new Set(), notifications: [], onboardingStep: 0, recognition: null, user: null, areaQuery: "", selectedMedicine: null, notificationTimer: null };
const aliases = new Map([
  ["بنادول", "panadol"], ["بانادول", "panadol"], ["كاتافلام", "cataflam"], ["كتافلام", "cataflam"],
  ["بروفين", "brufen"], ["فولتارين", "voltaren"], ["ادول", "adol"], ["أدول", "adol"],
  ["اوجمنتين", "augmentin"], ["أوجمنتين", "augmentin"], ["كونجستال", "congestal"],
  ["فلاجيل", "flagyl"], ["موتيليوم", "motilium"], ["نوروڤين", "nurofen"], ["نيروفين", "nurofen"],
]);

const searchInput = document.querySelector("#medicine-search");
const suggestionList = document.querySelector("#search-suggestions");
const resultsSection = document.querySelector("#search-results");
const toast = document.querySelector("#toast");
let toastTimer;
const ingredientByType = {
  "مسكن وخافض للحرارة": ["باراسيتامول", "تخفيف الألم والحرارة"],
  "مضاد حيوي": ["تختلف حسب الاسم والتركيبة", "علاج عدوى بكتيرية بوصفة طبية"],
  "مضاد للالتهاب": ["تختلف حسب الاسم والتركيبة", "تخفيف الالتهاب والألم"],
  "فيتامينات": ["مزيج فيتامينات حسب المنتج", "تعويض نقص غذائي محدد"],
};

function renderMedicineInfo(record) {
  const panel = document.querySelector("#medicine-info-content");
  const empty = document.querySelector("#medicine-info-empty");
  if (!panel || !empty || !record) return;
  const type = String(record["طبيعة الدواء"] || "صنف دوائي");
  const details = [record["المادة الفعالة"] || "غير محددة في ملف المصدر — راجع الصيدلي", type];
  panel.innerHTML = `<span class="info-subtitle">تفاصيل تعليمية عن النتيجة المختارة</span><h3>${escapeHtml(record["اسم الدواء"] || "دواء")}</h3><div class="info-grid"><div class="info-item"><b>المادة الفعالة</b><span>${escapeHtml(details[0])}</span></div><div class="info-item"><b>الاستخدام العام</b><span>${escapeHtml(details[1])}</span></div><div class="info-item"><b>الكود</b><span>${escapeHtml(record["الكود"] || "غير متاح")}</span></div><div class="info-item"><b>حالة السجل</b><span>${escapeHtml(getStatus(record).label)}</span></div></div><p class="info-warning">تنبيه: لا تبدأ أو توقف دواءً اعتمادًا على هذه البطاقة؛ اسأل الصيدلي عن المادة الفعالة والجرعة المناسبة.</p>`;
  empty.hidden = true; panel.hidden = false; state.selectedMedicine = record;
  document.querySelector("#medicine-info")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function loadOcrScript() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return new Promise((resolve, reject) => { const script = document.createElement("script"); script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"; script.onload = () => resolve(window.Tesseract); script.onerror = reject; document.head.appendChild(script); });
}

async function searchFromPhoto(file) {
  showToast("بنقرأ اسم الدواء من الصورة بالعربي والإنجليزي...");
  try {
    const Tesseract = await loadOcrScript();
    const result = await Tesseract.recognize(file, "ara+eng", { logger: (message) => { if (message.status === "recognizing text" && message.progress > .7) showToast("قربنا نخلص قراءة العلبة..."); } });
    const text = result.data.text.replace(/\s+/g, " ").trim();
    const candidate = findMatches(text)[0];
    if (!candidate) { showToast("قرأنا الصورة لكن الاسم مش موجود في سجل المصدر؛ جرّب كتابة الاسم."); return; }
    searchInput.value = candidate["اسم الدواء"]; performSearch(candidate["اسم الدواء"]);
  } catch { showToast("تعذر قراءة الصورة. جرّب صورة أوضح أو اكتب اسم الدواء يدويًا."); }
}


function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase("ar-EG").normalize("NFD").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").trim();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function getRecords() {
  return state.inventory.map((item) => ({ ...item, ...(state.supplyByNumber.get(String(item["م"])) ?? {}) }));
}

function editDistance(left, right) {
  if (Math.abs(left.length - right.length) > 2) return 3;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[right.length];
}

function symptomPhraseMatches(query, phrase) {
  const ignored = new Set(["في", "من", "عندي", "عند", "ب", "بـ", "و", "او", "أو", "مع", "على", "يا", "هو", "هي"]);
  const clean = (value) => normalize(value).split(/\s+/).map((token) => token.replace(/^ال/, "")).filter((token) => token.length > 1 && !ignored.has(token));
  const queryTokens = clean(query);
  const phraseTokens = clean(phrase);
  return phraseTokens.length > 0 && phraseTokens.every((token) => queryTokens.some((candidate) => candidate === token || candidate.includes(token) || token.includes(candidate)));
}
function findMatches(query) {
  const normalizedQuery = normalize(query);
  const aliasedQuery = normalize(aliases.get(normalizedQuery) ?? query);
  if (!aliasedQuery) return [];
  return getRecords().map((record) => {
    const name = normalize(record["اسم الدواء"]);
    const category = normalize(record["طبيعة الدواء"]);
    const code = normalize(record["الكود"]);
    let score = 0;
    if (name === aliasedQuery || code === aliasedQuery) score = 100;
    else if (name.startsWith(aliasedQuery) || code.startsWith(aliasedQuery)) score = 80;
    else if (`${name} ${category}`.includes(aliasedQuery)) score = 60;
    else if (aliasedQuery.length >= 4 && editDistance(name.split(" ")[0], aliasedQuery) <= (aliasedQuery.length > 7 ? 2 : 1)) score = 30;
    return { ...record, score };
  }).filter((record) => record.score > 0).sort((left, right) => right.score - left.score || String(left["اسم الدواء"]).localeCompare(String(right["اسم الدواء"]))).slice(0, 30);
}

function getStatus(record) {
  const quantity = Number(record["الكمية الحالية"] ?? record["الكمية"] ?? 0);
  const minimum = Number(record["الحد الأدنى"] ?? 0);
  if (quantity <= 0 || String(record["حالة المخزون"] ?? "").includes("غير متاح")) return { label: "غير متاح في السجل", className: "out" };
  if (quantity <= minimum) return { label: "كمية قليلة في السجل", className: "low" };
  return { label: "متاح في سجل المصدر", className: "available" };
}

function renderSuggestions(query) {
  if (!query.trim()) {
    suggestionList.hidden = true;
    suggestionList.replaceChildren();
    return;
  }
  const suggestions = findMatches(query).slice(0, 5);
  if (!suggestions.length) {
    suggestionList.innerHTML = '<div class="suggestion-option"><span class="suggestion-pill">?</span><span><strong>مش لاقيين تطابق</strong><small>جرّب الاسم العلمي أو الكود</small></span></div>';
  } else {
    suggestionList.innerHTML = suggestions.map((record, index) => `<button type="button" class="suggestion-option" role="option" aria-selected="${index === 0}" data-select-medicine="${escapeHtml(record["اسم الدواء"])}"><span class="suggestion-pill">Rx</span><span><strong>${escapeHtml(record["اسم الدواء"])}</strong><small>${escapeHtml(record["طبيعة الدواء"] || record["الكود"] || "دواء")}</small></span></button>`).join("");
  }
  suggestionList.hidden = false;
}

function renderMedicineCard(record) {
  const status = getStatus(record);
  const saved = state.saved.has(String(record["م"]));
  const nearby = nearbyPharmacyMarkup(record);
  return `<article class="medicine-result">
    <span class="medicine-glyph" aria-hidden="true"><i></i><b>Rx</b></span>
    <div class="medicine-main"><div class="medicine-title-row"><div><h3>${escapeHtml(record["اسم الدواء"])}</h3><p>${escapeHtml(record["طبيعة الدواء"] || "صنف دوائي")}</p></div><span class="medicine-status ${status.className}">${status.label}</span></div>
      <div class="medicine-meta"><span>الكود ${escapeHtml(record["الكود"] || "—")}</span><span>الكمية في السجل: ${numberFormat.format(Number(record["الكمية الحالية"] ?? record["الكمية"] ?? 0))} ${escapeHtml(record["وحدة القياس"] || record["الوحدة"] || "")}</span><span>حد الطلب: ${numberFormat.format(Number(record["الحد الأدنى"] ?? 0))}</span><span>المادة الفعالة: ${escapeHtml(record["المادة الفعالة"] || "غير محددة")}</span></div>
      <button class="save-medicine" type="button" data-save-medicine="${escapeHtml(record["م"])}" aria-pressed="${saved}">${saved ? "★ محفوظ في أدويتي" : "☆ أضف لأدويتي"}</button>
    </div>
    ${nearby}
  </article>`;
}

function uniquePharmacies() {
  const unique = new Map();
  for (const pharmacy of state.pharmacies) {
    const key = [pharmacy["اسم الصيدلية"], pharmacy["المنطقة / العنوان المتوقع"], pharmacy["رقم التليفون / الخط الساخن"]].join("|");
    if (!unique.has(key)) unique.set(key, pharmacy);
  }
  return [...unique.values()];
}

function simplifyArea(value) {
  return normalize(value).replace(/^محافظة\s*/, "").replace(/^ال/, "").replace(/[^\p{L}\p{N}]/gu, "");
}

function getNearbyPharmacies(query = state.areaQuery) {
  const normalizedQuery = simplifyArea(query);
  if (!normalizedQuery) return [];
  return uniquePharmacies().filter((pharmacy) => {
    const area = normalize(pharmacy["المنطقة / العنوان المتوقع"]);
    const segments = area.split(/\s*[-–/]\s*/).map(simplifyArea);
    return area.includes(normalize(query)) || segments.some((segment) => segment.includes(normalizedQuery) || normalizedQuery.includes(segment));
  });
}

function nearbyPharmacyMarkup(record) {
  const entries = getNearbyPharmacies().slice(0, 10);
  const area = state.areaQuery.trim();
  if (!area) {
    return `<section class="medicine-nearby"><div class="nearby-heading"><strong>أقرب فروع الدليل</strong><span>حدد منطقتك</span></div><p>اكتب منطقتك أو استخدم موقعك لعرض الصيدليات المسجلة فيها.</p><button class="nearby-choose-area" type="button" data-focus-area>اختار المنطقة <span aria-hidden="true">←</span></button></section>`;
  }
  if (!entries.length) {
    return `<section class="medicine-nearby"><div class="nearby-heading"><strong>مفيش فرع مطابق في الدليل</strong><span>${escapeHtml(area)}</span></div><p>جرّب اسم منطقة أقرب أو اتصل بصيدلية موثوقة.</p></section>`;
  }
  const pharmacies = entries.map((pharmacy) => {
    const phone = String(pharmacy["رقم التليفون / الخط الساخن"] ?? "");
    const dial = (phone.split("/")[0].match(/[\d+()\-\s]+/)?.[0] ?? "").replace(/[^\d+]/g, "");
    const location = String(pharmacy["المنطقة / العنوان المتوقع"] ?? "").split(/\s*[-–/]\s*/).at(-1) ?? area;
    return `<article class="nearby-pharmacy"><div class="nearby-pharmacy-copy"><strong>${escapeHtml(pharmacy["اسم الصيدلية"])}</strong><small>${escapeHtml(location)} · مطابقة لمنطقتك</small><span>اتصل للتأكد من توفر الدواء</span></div>${dial ? `<a class="nearby-call" href="tel:${escapeHtml(dial)}" aria-label="اتصل بـ${escapeHtml(pharmacy["اسم الصيدلية"])}">اتصال</a>` : `<span class="nearby-phone">${escapeHtml(phone || "رقم غير مدرج")}</span>`}</article>`;
  }).join("");
  return `<section class="medicine-nearby"><div class="nearby-heading"><strong>فروع الدليل الأقرب حسب المنطقة</strong><span>${escapeHtml(area)}</span></div><div class="nearby-pharmacy-list">${pharmacies}</div><p class="nearby-caveat">الترتيب حسب المنطقة المسجلة، مش المسافة الدقيقة. ملف المصدر لا يربط مخزون الدواء بالفرع.</p></section>`;
}

function renderAreaResults(query = "") {
  const normalizedQuery = normalize(query);
  const entries = getNearbyPharmacies(query).slice(0, 200);
  const container = document.querySelector("#area-results");
  if (!normalizedQuery) {
    container.innerHTML = '<div class="area-result"><span>اكتب اسم المنطقة عشان نرتّب الفروع المسجلة الأقرب.</span></div>';
    return;
  }
  if (!entries.length) {
    container.innerHTML = `<div class="area-result"><span>${query ? "مفيش منطقة مطابقة في الدليل" : "اكتب اسم المنطقة لعرض الفروع المسجلة"}</span></div>`;
    return;
  }
  container.innerHTML = entries.map((pharmacy) => {
    const phone = String(pharmacy["رقم التليفون / الخط الساخن"] ?? "");
    const dial = (phone.split("/")[0].match(/[\d+()\-\s]+/)?.[0] ?? "").replace(/[^\d+]/g, "");
    return `<div class="area-result"><span>${escapeHtml(pharmacy["اسم الصيدلية"])}<br><small>${escapeHtml(pharmacy["المنطقة / العنوان المتوقع"])}</small></span>${dial ? `<a href="tel:${escapeHtml(dial)}">اتصال</a>` : `<span>${escapeHtml(phone)}</span>`}</div>`;
  }).join("");
}

async function persistSavedMedicine(key, saved) {
  if (state.user?.role !== "patient") return;
  const response = await fetch("/api/saved-medicines", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ medicineKey: key, saved }) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "تعذر حفظ الدواء.");
}

function renderNotifications() {
  const panel = document.querySelector("#notifications-panel");
  const count = document.querySelector("#notification-count");
  if (!panel || !count) return;
  const unread = state.notifications.filter((item) => !item.isRead).length;
  count.textContent = String(unread);
  count.hidden = unread === 0;
  panel.innerHTML = state.notifications.length ? state.notifications.map((item) => {
    if (item.kind === "donation_accepted") {
      return `<article class="notification-item donation-notification ${item.isRead ? "is-read" : ""}"><div class="notification-message-row"><div class="notification-message-copy"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.message)}</p><small>${escapeHtml(new Intl.DateTimeFormat("ar-EG", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.createdAt)))}</small></div><button type="button" class="notification-open-button" data-notification-open data-notification-id="${escapeHtml(item.id)}">عرض بيانات الصيدلية</button></div></article>`;
    }
    return `<article class="notification-item ${item.isRead ? "is-read" : ""}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.message)}</p><small>${escapeHtml(new Intl.DateTimeFormat("ar-EG", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.createdAt)))}</small></article>`;
  }).join("") : '<p class="notification-empty">لا توجد إشعارات جديدة.</p>';
}
async function markNotificationsRead() {
  if (!state.notifications.some((item) => !item.isRead)) return;
  state.notifications = state.notifications.map((item) => ({ ...item, isRead: true }));
  renderNotifications();
  try {
    await fetch("/api/notifications/read", { method: "POST", credentials: "same-origin" });
  } catch { /* The local state is already read; the next refresh retries from the server. */ }
}
function openPharmacyContact(notification) {
  const dialog = document.querySelector("#pharmacy-contact-dialog");
  if (!dialog) return;
  const name = notification.pharmacyName || "الصيدلية";
  const phone = String(notification.pharmacyPhone || "").replace(/[^0-9+]/g, "");
  const address = notification.pharmacyAddress || notification.area || "العنوان غير مسجل";
  const area = notification.area || "المنطقة غير مسجلة";
  document.querySelector("#contact-pharmacy-name").textContent = name;
  document.querySelector("#contact-pharmacy-message").textContent = `تم قبول تبرعك بدواء ${notification.medicine || "الدواء المطلوب"}. الصيدلية وافقت على الاستلام، وللتواصل معها استخدمي بيانات الاتصال الموجودة في رسالة القبول.`;
  document.querySelector("#contact-pharmacy-address").textContent = `العنوان: ${address}`;
  document.querySelector("#contact-pharmacy-area").textContent = `المنطقة: ${area}`;
  document.querySelector("#contact-pharmacy-phone").textContent = phone ? `للتواصل: ${notification.pharmacyPhone}` : "للتواصل: رقم الهاتف غير مسجل";
  const call = document.querySelector("#contact-pharmacy-call");
  call.removeAttribute("hidden");
  if (phone) { call.href = `tel:${phone}`; call.textContent = `اتصلي بالصيدلية: ${notification.pharmacyPhone}`; call.removeAttribute("aria-disabled"); call.classList.remove("is-disabled"); }
  else { call.href = "#"; call.textContent = "رقم التواصل غير مسجل"; call.setAttribute("aria-disabled", "true"); call.classList.add("is-disabled"); }
  dialog.showModal();
}
async function loadPatientData() {
  const [savedResponse, notificationsResponse] = await Promise.all([fetch("/api/saved-medicines", { credentials: "same-origin" }), fetch("/api/notifications", { credentials: "same-origin" })]);
  if (savedResponse.ok) {
    const savedPayload = await savedResponse.json();
    const serverSaved = new Set((savedPayload.medicineKeys || []).map(String));
    let localSaved = new Set();
    try { localSaved = new Set(JSON.parse(localStorage.getItem("dawaey-saved-medications") ?? "[]").map(String)); } catch { /* The server list remains available. */ }
    state.saved = new Set([...serverSaved, ...localSaved]);
    for (const key of localSaved) if (!serverSaved.has(key)) persistSavedMedicine(key, true).catch(() => {});
  }
  if (notificationsResponse.ok) {
    const notificationPayload = await notificationsResponse.json();
    state.notifications = notificationPayload.notifications || [];
  }
}

function updateSavedList() {
  const savedList = document.querySelector("#saved-list");
  const records = getRecords().filter((record) => state.saved.has(String(record["م"])));
  if (!records.length) {
    savedList.innerHTML = '<span class="saved-empty">لسه مفيش أدوية محفوظة.</span>';
    return;
  }
  savedList.innerHTML = records.map((record) => `<span class="saved-item">${escapeHtml(record["اسم الدواء"])}<button type="button" data-remove-saved="${escapeHtml(record["م"])}" aria-label="حذف ${escapeHtml(record["اسم الدواء"])} من أدويتي">×</button></span>`).join("");
}

function updateStats() {
  const uniqueNames = new Set(getRecords().map((record) => record["اسم الدواء"]));
  const pharmacyNames = new Set(state.pharmacies.map((record) => record["اسم الصيدلية"]));
  const contacts = uniquePharmacies();
  const values = { medicines: uniqueNames.size, pharmacies: pharmacyNames.size, contacts: contacts.length };
  for (const [key, value] of Object.entries(values)) {
    const element = document.querySelector(`[data-stat="${key}"]`);
    if (!element) continue;
    const startedAt = performance.now();
    const animate = (now) => {
      const progress = Math.min(1, (now - startedAt) / 700);
      element.textContent = numberFormat.format(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

function performSearch(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    searchInput.focus();
    showToast("اكتب اسم الدواء الأول");
    return;
  }
  state.matches = findMatches(trimmedQuery);
  const isPatient = state.user?.role === "patient";
  if (state.matches[0]) {
    const searchedKey = String(state.matches[0]["م"]);
    if (!state.saved.has(searchedKey)) {
      state.saved.add(searchedKey);
      try { localStorage.setItem("dawaey-saved-medications", JSON.stringify([...state.saved])); } catch { /* The account database is the primary store. */ }
      if (isPatient) persistSavedMedicine(searchedKey, true).catch((error) => showToast(error.message));
      updateSavedList();
      showToast(`تم حفظ ${state.matches[0]["اسم الدواء"]} في أدويتي`);
    }
  }
  document.querySelector("#results-title").textContent = `نتائج: ${trimmedQuery}`;
  document.querySelector("#results-summary").textContent = state.matches.length ? `لقينا ${numberFormat.format(state.matches.length)} تطابق في سجل الأصناف.${!isPatient && state.matches.length > 5 ? " عرضنا أول ٥ للزائر." : ""}` : "ملقيناش الاسم ده في الكتالوج الحالي.";
  renderMedicineResults();
  if (state.matches[0]) renderMedicineInfo(state.matches[0]);
  resultsSection.hidden = false;
  suggestionList.hidden = true;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderMedicineResults() {
  const isPatient = state.user?.role === "patient";
  const visibleMatches = isPatient ? state.matches : state.matches.slice(0, 5);
  const guestNotice = !isPatient && state.matches.length > 5 ? '<div class="guest-limit-note">دي معاينة محدودة. <a href="auth.html">سجّل كمريض لعرض نتائج أكتر.</a></div>' : "";
  document.querySelector("#medicine-results").innerHTML = state.matches.length
    ? `${visibleMatches.map(renderMedicineCard).join("")}${guestNotice}`
    : `<div class="empty-results"><strong>مش لاقيين الدواء ده في ملف المصدر.</strong><br>جرّب اسمًا أو كودًا مختلفًا.</div>`;
}

const onboardingSlides = [
  { icon: "⌖", title: "منطقتك على راحتك", copy: "اختيار الموقع هيساعد لاحقًا في ترتيب الفروع. نسخة العرض الحالية لا تحتوي مواقع دقيقة للصيدليات." },
  { icon: "＋", title: "رتّب أدويتك", copy: "احفظ الأدوية المهمة لقائمة محلية على جهازك، من غير إرسالها لخادم." },
  { icon: "♧", title: "خليك على اطلاع", copy: "إشعارات التوفر تحتاج ربطًا مباشرًا بمخزون الصيدليات، وده غير مفعّل في نسخة العرض." },
];

function showOnboarding() {
  const welcome = new URLSearchParams(window.location.search).has("welcome");
  if (welcome) window.history.replaceState(null, "", `${window.location.pathname}#top`);
  if (!welcome || state.user?.role !== "patient") return;
  if (localStorage.getItem("dawaey-onboarding-done") === "yes") return;
  state.onboardingStep = 0;
  renderOnboarding();
  document.querySelector("#onboarding-dialog").showModal();
}

function renderOnboarding() {
  const step = onboardingSlides[state.onboardingStep];
  document.querySelector("#onboarding-progress").style.width = `${(state.onboardingStep + 1) / onboardingSlides.length * 100}%`;
  document.querySelector("#onboarding-content").innerHTML = `<div class="onboarding-copy"><span class="step-icon">${step.icon}</span><h2>${step.title}</h2><p>${step.copy}</p></div>`;
  document.querySelector("#onboarding-next").textContent = state.onboardingStep === onboardingSlides.length - 1 ? "ابدأ" : "التالي";
}

function setupVoiceSearch() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    showToast("البحث الصوتي مش مدعوم في المتصفح ده");
    return;
  }
  if (state.recognition) {
    state.recognition.stop();
    return;
  }
  const recognition = new Recognition();
  state.recognition = recognition;
  recognition.lang = "ar-EG";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    searchInput.value = event.results[0][0].transcript;
    performSearch(searchInput.value);
  };
  recognition.onerror = () => showToast("ما قدرناش نسمع بوضوح، جرّب تكتب اسم الدواء");
  recognition.onend = () => { state.recognition = null; document.querySelector("#voice-search").classList.remove("is-listening"); };
  recognition.start();
  document.querySelector("#voice-search").classList.add("is-listening");
  showToast("سامعينك.. قول اسم الدواء");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector("#theme-toggle").setAttribute("aria-label", theme === "dark" ? "التبديل للمظهر النهاري" : "التبديل للمظهر الليلي");
  try { localStorage.setItem("dawaey-theme", theme); } catch { /* Keep the selected theme for this page only. */ }
}

function setupTabs() {
  const panel = document.querySelector("#audience-panel");
  document.querySelectorAll("[data-audience]").forEach((tab) => tab.addEventListener("click", () => {
    const patient = tab.dataset.audience === "patient";
    document.querySelectorAll("[data-audience]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const pharmacyContent = `<div class="audience-symbol">✚</div><div><h3>إدارة أوضح للمخزون</h3><p>مساحة مخصصة للصيدلية لمتابعة الأصناف والطلبات، بعد ربط النظام ببيانات الفرع ومراجعته.</p><ul><li>عرض حالة المخزون حسب حدود الفرع</li><li>استقبال طلبات التحويل بين الصيدليات</li><li>توثيق الحساب قبل النشر</li></ul></div>`;
    const patientContent = `<div class="audience-symbol">💚</div><div><h3>معلومة أوضح قبل المشوار</h3><p>ابحث في الأصناف، احتفظ بأدويتك على جهازك، وتواصل مع الفروع المدرجة بدون ما نخلط بين دليل الفروع وسجل المخزون.</p><ul><li>بحث بالاسم والكود والفئة</li><li>حفظ محلي للأدوية اللي تهمك</li><li>إظهار حدود البيانات بوضوح</li></ul></div>`;
    panel.setAttribute("aria-labelledby", patient ? "patient-tab" : "pharmacy-tab");
    panel.innerHTML = patient ? patientContent : pharmacyContent;
  }));
}

function applyRoleVisibility() {
  const pharmacyOnly = state.user?.role === "patient";
  document.querySelectorAll("[data-pharmacy-only]").forEach((element) => {
    element.hidden = pharmacyOnly;
  });
}
function updateActiveNav(sectionId = null) {
  const links = [...document.querySelectorAll("[data-section]")];
  if (!links.length) return;
  let active = sectionId;
  if (!active) {
    active = window.scrollY < 180 ? "top" : links.find((link) => link.classList.contains("is-active"))?.dataset.section || "top";
  }
  links.forEach((link) => link.classList.toggle("is-active", link.dataset.section === active));
}

function setupObservers() {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  const onScroll = () => {
    document.querySelector("#site-header").classList.toggle("is-scrolled", window.scrollY > 24);
    if (window.scrollY < 180) updateActiveNav("top");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) updateActiveNav(visible[0].target.id);
  }, { rootMargin: "-22% 0px -58% 0px", threshold: [0.1, 0.35, 0.6] });
  document.querySelectorAll("[data-section]").forEach((link) => {
    const section = document.getElementById(link.dataset.section);
    if (section) sectionObserver.observe(section);
  });
  updateActiveNav(window.scrollY < 180 ? "top" : null);
}

function renderDonationResults(medicine, area) {
  const container = document.querySelector("#donation-results");
  const entries = getNearbyPharmacies(area).slice(0, 12);
  if (!medicine || !area) { container.innerHTML = "<p>اكتب اسم الدواء والمنطقة لعرض الصيدليات المسجلة.</p>"; return; }
  const matches = findMatches(medicine);
  const medicineName = matches[0]?.["اسم الدواء"] || medicine;
  if (!entries.length) { container.innerHTML = `<p>مش لاقيين صيدلية مسجلة في <strong>${escapeHtml(area)}</strong>. جرّب منطقة قريبة أو تواصل مع صيدلية موثوقة.</p>`; return; }
  container.innerHTML = `<div class="donation-result-title"><strong>فروع قريبة للتواصل بخصوص ${escapeHtml(medicineName)}</strong><small>${numberFormat.format(entries.length)} فرعًا مطابقًا للمنطقة</small></div>` + entries.map((pharmacy) => {
    const phone = String(pharmacy["رقم التليفون / الخط الساخن"] ?? "");
    const dial = (phone.split("/")[0].match(/[\d+()\-\s]+/)?.[0] ?? "").replace(/[^\d+]/g, "");
    return `<div class="donation-result"><span><strong>${escapeHtml(pharmacy["اسم الصيدلية"])}</strong><small>${escapeHtml(pharmacy["المنطقة / العنوان المتوقع"])}</small></span>${dial ? `<a href="tel:${escapeHtml(dial)}">اتصال</a>` : `<em>${escapeHtml(phone || "رقم غير مدرج")}</em>`}</div>`;
  }).join("");
}

function assistantMedicineCards(records) {
  return records.map((record) => `<article class="assistant-medicine-card"><div><strong>${escapeHtml(record["اسم الدواء"] || "دواء")}</strong><small>${escapeHtml(record["المادة الفعالة"] || "المادة الفعالة غير محددة في السجل")}</small></div><button type="button" data-assistant-medicine="${escapeHtml(record["اسم الدواء"] || "")}">عرض الدواء</button></article>`).join("");
}
function assistantQuickActions(actions) {
  return `<div class="assistant-quick-actions">${actions.map(([label, prompt]) => `<button type="button" data-assistant-prompt="${escapeHtml(prompt)}">${escapeHtml(label)}</button>`).join("")}</div>`;
}
function assistantReply(question) {
  const query = normalize(question);
  if (/^(اهلا|أهلا|هاي|hello|hi|السلام عليكم|صباح الخير|مساء الخير)/i.test(question.trim())) return `أهلًا بيك! أنا مساعد دوائي. ${assistantQuickActions([["اسأل عن البرد", "عندي برد"], ["اسأل عن التهاب", "عندي التهاب"], ["ابحث عن دواء", "ابحث عن Panadol"]])}`;
  if (query.includes("شكرا") || query.includes("متشكر")) return `العفو! أنا هنا أساعدك في فهم بيانات الدواء والبحث داخل الكتالوج. ${assistantQuickActions([["عندي عرض", "عندي صداع"], ["ابحث عن صيدلية", "أين أجد صيدلية في المعادي؟"]])}`;
  if (query.includes("انت مين") || query.includes("بتعمل ايه") || query.includes("ممكن تساعد")) return `أنا مساعد دوائي أقدر أبحث في سجل الأدوية، أوضح المادة الفعالة، وأقترح فئة عامة مرتبطة بالحالة. لا أشخّص ولا أحدد جرعات، واسأل الصيدلي قبل الاستخدام. ${assistantQuickActions([["دواء للبرد", "عندي برد"], ["دواء للالتهاب", "عندي التهاب"], ["ابحث عن دواء", "ابحث عن Panadol"]])}`;
  if (query.includes("سعر") || query.includes("بكام") || query.includes("تكلف")) return "الكتالوج الحالي لا يحتوي على أسعار. ابحث عن اسم الدواء ثم تواصل مع الصيدلية مباشرة لمعرفة السعر والتوفر.";
  if (query.includes("جرع") || query.includes("كام قرص") || query.includes("اخد قد ايه")) return "لا أقدر أحدد جرعة أو عدد أقراص؛ الجرعة تعتمد على السن والحالة والأدوية الأخرى. ارجع لصيدلي أو طبيب، خصوصًا للأطفال وكبار السن.";
  if (query.includes("حامل") || query.includes("حمل") || query.includes("طفل") || query.includes("رضيع") || query.includes("مزمن")) return "الحالة دي تحتاج سؤال الصيدلي أو الطبيب قبل أي دواء. ما تستخدمش اقتراحًا من المساعد بدون مراجعة المختص.";
  const medicine = getRecords().find((record) => {
    const name = normalize(record["اسم الدواء"]);
    return name && query.includes(name);
  }) || findMatches(question)[0];
  if (medicine) return `<strong>لقيت الدواء في سجل دوائي</strong><div class="assistant-medicine-card"><div><strong>${escapeHtml(medicine["اسم الدواء"])}</strong><small>${escapeHtml(medicine["المادة الفعالة"] || "المادة الفعالة غير محددة في المصدر")}</small></div><button type="button" data-assistant-medicine="${escapeHtml(medicine["اسم الدواء"])}">عرض الدواء</button></div><small>البيانات إرشادية فقط؛ اسأل الصيدلي عن الملاءمة والجرعة.</small>`;

  if (query.includes("بديل") || query.includes("بدائل")) {
    const match = findMatches(question)[0];
    if (!match) return "اكتب اسم الدواء الذي تريد بديلًا له، وسأبحث عن نفس المادة الفعالة في السجل. وبعدها اسأل الصيدلي قبل الاستبدال.";
    const ingredient = normalize(match["المادة الفعالة"]);
    const alternatives = getRecords().filter((record) => ingredient && normalize(record["المادة الفعالة"]) === ingredient && normalize(record["اسم الدواء"]) !== normalize(match["اسم الدواء"])).slice(0, 4);
    return alternatives.length ? `<strong>بدائل لها نفس المادة الفعالة المسجلة:</strong><div class="assistant-medicine-list">${assistantMedicineCards(alternatives)}</div><small>لا تبدّل الدواء إلا بعد سؤال الصيدلي.</small>` : "مش لاقي بديلًا بنفس المادة الفعالة في السجل. اسأل الصيدلي عن البدائل الآمنة.";
  }
  if (query.includes("مضاد حيوي") || query.includes("انتي بيوتك") || query.includes("مضاد حيوى")) return "المضاد الحيوي لا يُستخدم لمجرد البرد أو الالتهاب، ولازم يحدده الطبيب أو الصيدلي حسب السبب. اكتب اسم دواء محدد لو عايز تعرف مادته الفعالة.";
  const emergencySymptoms = ["ضيق تنفس", "صعوبة تنفس", "ألم صدر", "فقدان وعي", "نزيف شديد", "تشنج", "حساسية شديدة", "تورم الوجه"];
  if (emergencySymptoms.some((symptom) => query.includes(normalize(symptom)))) return "دي علامة تستدعي مساعدة عاجلة. لا تنتظر اقتراح دواء من الشات؛ اتصل بالإسعاف 123 أو توجّه لأقرب طوارئ فورًا.";

  const advice = [
    { words: ["برد", "نزلة برد", "زكام", "إنفلونزا", "انفلونزا", "رشح", "انسداد الانف", "سيلان الانف"], category: "برد أو إنفلونزا", options: "يمكن سؤال الصيدلي عن أدوية البرد الموجودة في السجل مثل Congestal أو Flurest أو Cold Free", catalogNames: ["congestal", "flurest", "cold free", "paracetamol"] },
    { words: ["التهاب", "التهابات", "التهاب عضلات", "التهاب مفاصل"], category: "التهاب أو ألم", options: "اسأل الصيدلي عن مضاد التهاب مناسب مثل Cataflam أو Brufen، ولا تبدأ مضادًا حيويًا من نفسك", catalogNames: ["cataflam", "brufen", "diclofenac", "ibuprofen"] },
    { words: ["وجع معدة", "الم معدة", "ألم معدة", "وجع بطن", "الم بطن", "ألم بطن", "تقلصات المعدة"], category: "ألم أو وجع المعدة", options: "ألم المعدة له أسباب مختلفة؛ اسأل الصيدلي عن علاج مناسب، ولا تستخدم مسكنات عشوائيًا إذا الألم شديد أو مستمر", catalogNames: ["panadol", "adol"] },
    { words: ["وجع سن", "الم سن", "ألم سن", "ضرس", "اسنان", "أسنان"], category: "ألم الأسنان", options: "يمكن سؤال الصيدلي عن مسكن مناسب مثل Panadol أو Cataflam، واحجز كشف أسنان لمعرفة السبب", catalogNames: ["panadol", "adol", "cataflam"] },
    { words: ["وجع ظهر", "الم ظهر", "ألم ظهر", "ظهرى", "ظهري"], category: "ألم الظهر", options: "اسأل الصيدلي عن مسكن أو مضاد التهاب مناسب مثل Panadol أو Brufen، وتجنب الدواء إذا لديك مانع طبي", catalogNames: ["panadol", "adol", "brufen"] },
    { words: ["دوخة", "دوار", "حاسس بدوخه", "عدم اتزان"], category: "دوخة أو عدم اتزان", options: "الدوخة لها أسباب متعددة؛ اجلس واشرب سوائل واسأل الصيدلي أو الطبيب قبل أي دواء", catalogNames: [] },
    { words: ["امساك", "إمساك", "مش عارف ادخل الحمام"], category: "إمساك", options: "اسأل الصيدلي عن علاج مناسب للإمساك واشرب سوائل، واطلب تقييمًا إذا كان الألم شديدًا أو يوجد قيء", catalogNames: [] },
    { words: ["طفح", "حساسية جلد", "حكة جلد", "حكه جلد", "احمرار الجلد"], category: "طفح أو حساسية جلدية", options: "اسأل الصيدلي عن علاج مناسب للحساسية، وتجنب السبب المحتمل ولا تستخدم كريمًا مجهولًا", catalogNames: ["cetirizine", "loratadine", "claritine"] },
    { words: ["وجع اذن", "ألم اذن", "الم اذن", "ودني", "أذني"], category: "ألم الأذن", options: "ألم الأذن يحتاج سؤال الصيدلي أو الطبيب، ولا تضع قطرات بدون معرفة سبب الألم", catalogNames: [] },
    { words: ["حرقان بول", "الم في البول", "ألم عند التبول", "التهاب بول"], category: "ألم أو حرقان أثناء التبول", options: "اسأل الطبيب أو الصيدلي لعمل التقييم المناسب، ولا تبدأ مضادًا حيويًا من نفسك", catalogNames: [] },
    { words: ["الدورة", "دورة شهرية", "الم الدورة", "ألم الدورة", "تقلصات الدورة"], category: "ألم الدورة الشهرية", options: "يمكن سؤال الصيدلي عن مسكن مناسب مثل Panadol أو Cataflam بعد التأكد من عدم وجود مانع", catalogNames: ["panadol", "adol", "cataflam"] },
    { words: ["صداع", "وجع راس", "رأس", "الم راس", "ألم راس"], category: "ألم أو صداع", options: "من الخيارات الشائعة التي يمكن سؤال الصيدلي عنها: باراسيتامول مثل Panadol أو Adol", catalogNames: ["panadol", "adol", "paracetamol", "fevadol"] },
    { words: ["حراره", "سخنيه", "حمى", "سخونه", "درجة الحرارة"], category: "حرارة أو حمى", options: "يمكن سؤال الصيدلي عن باراسيتامول مثل Panadol أو Adol بعد قياس الحرارة", catalogNames: ["panadol", "adol", "paracetamol", "fevadol"] },
    { words: ["حساسيه", "رشح", "عطس", "حكة", "حكه", "انسداد الانف"], category: "حساسية أو رشح", options: "يمكن سؤال الصيدلي عن سيتريزين أو لوراتادين، مع التأكد من عدم وجود مانع للاستخدام", catalogNames: ["cetirizine", "loratadine", "claritine", "claritin", "telfast"] },
    { words: ["حموضه", "حرقان", "ارتجاع", "معدة", "المعدة"], category: "حموضة أو ارتجاع", options: "يمكن سؤال الصيدلي عن أدوية الحموضة مثل أوميبرازول أو مضاد حموضة مناسب" },
    { words: ["كحه", "كحة", "بلغم", "سعال"], category: "كحة أو سعال", options: "اسأل الصيدلي عن علاج مناسب حسب كون الكحة جافة أو مصحوبة ببلغم؛ لا تستخدم مضادًا حيويًا من نفسك" },
    { words: ["مغص", "تقلص", "تقلصات", "الم بطن", "ألم بطن"], category: "مغص أو تقلصات", options: "اسأل الصيدلي عن دواء مناسب لمضاد التقلصات، لكن ألم البطن المستمر يحتاج تقييم السبب أولًا", catalogNames: [] },
    { words: ["التهاب حلق", "زور", "حلق", "الم حلق", "ألم حلق"], category: "ألم أو التهاب الحلق", options: "يمكن سؤال الصيدلي عن أقراص استحلاب ومسكن مناسب، ولا تبدأ مضادًا حيويًا دون كشف" },
    { words: ["غثيان", "ترجيع", "قيء"], category: "غثيان أو قيء", options: "اسأل الصيدلي عن خيار مناسب، واهتم بالسوائل؛ القيء المتكرر أو المصحوب بدم يحتاج طوارئ" },
    { words: ["اسهال", "إسهال"], category: "إسهال", options: "ابدأ بمحلول الإماهة بعد سؤال الصيدلي، واطلب تقييمًا طبيًا عند وجود دم أو جفاف أو حرارة عالية" },
  ];
  const matched = advice.find((item) => item.words.some((word) => symptomPhraseMatches(question, word)));
  if (matched) {
    const tokens = matched.options.split(/مثل|أو|،/).map((token) => normalize(token)).filter((token) => token.length > 3);
    const catalog = getRecords().filter((record) => {
      const text = `${normalize(record["اسم الدواء"])} ${normalize(record["طبيعة الدواء"])} ${normalize(record["المادة الفعالة"])}`;
      return (matched.catalogNames || []).some((name) => text.includes(normalize(name))) || text.includes(normalize(matched.category)) || tokens.some((token) => text.includes(token));
    }).slice(0, 4);
    if (!catalog.length) return `<strong>فهمت إن عندك ${escapeHtml(matched.category)}</strong><br>مش لاقي دواء مناسب للعرض ده في كتالوج دوائي الحالي. <strong>الأفضل ترجع لصيدلي</strong> عشان يحدد السبب والدواء المناسب، خصوصًا لو العرض مستمر أو شديد.<br><small>المساعد لا يشخّص ولا يحدد جرعات.</small>`;
    return `<strong>فهمت إن عندك ${escapeHtml(matched.category)}</strong><br>${escapeHtml(matched.options)}، ودي أدوية لقيتها في سجل دوائي:<div class="assistant-medicine-list">${assistantMedicineCards(catalog)}</div><small>اختار دواء لعرض بياناته. الاقتراح لا يغني عن سؤال الصيدلي ولا يحدد جرعة.</small>`;
  }
  const areaMatch = question.match(/(?:في|بـ|ب|منطقة)\s+(.+)/i);
  if (query.includes("صيدلي") || query.includes("فرع") || query.includes("عنوان")) {
    const area = areaMatch?.[1]?.trim() || state.areaQuery;
    const entries = getNearbyPharmacies(area).slice(0, 10);
    if (entries.length) return `لقيت ${numberFormat.format(entries.length)} فروع مسجلة في ${escapeHtml(area)}. تواصل معهم قبل الذهاب للتأكد من الخدمة والتوفر.`;
    return "اكتب اسم المنطقة أو المحافظة بشكل أوضح، وسأبحث في دليل الفروع المسجلة.";
  }
  if (query.includes("جرع") || query.includes("تشخيص")) return "أقدر أوضح بيانات الدواء وأقترح فئة عامة فقط، لكن لا أحدد جرعة أو أشخّص. اسأل طبيبًا أو صيدليًا، ولو الحالة طارئة اتصل بـ123.";
  const symptomText = question.replace(/^(انا|أنا)?\s*(عندي|عندي احساس ب|حاسس ب|حاسه ب|اشعر ب|أشعر ب|بعاني من|أعاني من)\s*/i, "").trim();
  if (symptomText.length > 2) return `فهمت إنك بتسأل عن <strong>${escapeHtml(symptomText)}</strong>، لكن مش لاقي له دواء واضح في سجل دوائي. الأفضل ترجع لصيدلي يحدد السبب والعلاج المناسب، خصوصًا لو العرض جديد أو شديد. ${assistantQuickActions([["اسأل عن البرد", "عندي برد"], ["اسأل عن الالتهاب", "عندي التهاب"], ["اكتب سؤالًا آخر", "ممكن تساعدني؟"]])}`;
  return `اكتب اسم الدواء أو صف الحالة بطريقتك، وأنا أبحث في السجل وأقولك إمتى تحتاج ترجع لصيدلي. ${assistantQuickActions([["عندي برد", "عندي برد"], ["عندي التهاب", "عندي التهاب"], ["ابحث عن صيدلية", "أين أجد صيدلية في المعادي؟"]])}`;
}
function addAssistantMessage(text, kind) {
  const messages = document.querySelector("#assistant-messages");
  if (!messages) return;
  const bubble = document.createElement("div"); bubble.className = `assistant-message ${kind}`; bubble.innerHTML = `<span>${text}</span>`; messages.appendChild(bubble); messages.scrollTop = messages.scrollHeight;
}

function setupDonationAndAssistant() {
  document.querySelector("#donation-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const medicine = document.querySelector("#donation-medicine").value.trim();
    const area = document.querySelector("#donation-area").value.trim();
    const quantity = document.querySelector("#donation-quantity").value.trim() || "غير محددة";
    if (state.user?.role !== "patient") {
      document.querySelector("#donation-results").innerHTML = '<p class="donation-saved-note">سجّل دخولك بحساب مريض أولًا حتى يصلك إشعار عند قبول الصيدلية للتبرع. <a href="auth.html">تسجيل الدخول</a></p>';
      return;
    }
    renderDonationResults(medicine, area);
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine, area, quantity }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "تعذر تسجيل طلب التبرع.");
      const notice = document.querySelector("#donation-results");
      notice.insertAdjacentHTML("afterbegin", '<p class="donation-saved-note">تم تسجيل طلب التبرع على الخادم وسيظهر للصيدليات من أي جهاز.</p>');
    } catch (error) {
      showToast(error.message || "تعذر تسجيل طلب التبرع.");
    }
  });
  document.querySelector("#assistant-form")?.addEventListener("submit", (event) => { event.preventDefault(); const input = document.querySelector("#assistant-input"); const question = input.value.trim(); if (!question) return; addAssistantMessage(escapeHtml(question), "user"); addAssistantMessage(assistantReply(question), "assistant"); input.value = ""; });
  document.querySelector("#assistant-messages")?.addEventListener("click", (event) => {
    const quickButton = event.target.closest("[data-assistant-prompt]");
    if (quickButton) {
      const input = document.querySelector("#assistant-input");
      input.value = quickButton.dataset.assistantPrompt;
      input.focus();
      return;
    }
    const medicineButton = event.target.closest("[data-assistant-medicine]");
    if (!medicineButton) return;
    const medicineName = medicineButton.dataset.assistantMedicine;
    document.querySelector("#medicine-search").value = medicineName;
    performSearch(medicineName);
    document.querySelector("#search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    addAssistantMessage(`فتحت نتيجة <strong>${escapeHtml(medicineName)}</strong> في البحث. راجع بياناته واسأل الصيدلي قبل الاستخدام.`, "assistant");
  });
  document.querySelectorAll("[data-assistant-prompt]").forEach((button) => button.addEventListener("click", () => { const input = document.querySelector("#assistant-input"); input.value = button.dataset.assistantPrompt; input.focus(); }));
}

function renderAccountProfile() {
  const profile = document.querySelector("#account-profile");
  const loginLink = document.querySelector(".login-link");
  if (!profile || !loginLink) return;
  if (!state.user) {
    profile.hidden = true;
    loginLink.textContent = "دخول / حساب جديد";
    loginLink.href = "auth.html";
    loginLink.removeAttribute("aria-expanded");
    return;
  }
  document.querySelector("#profile-name").textContent = state.user.name || "المستخدم";
  document.querySelector("#profile-role").textContent = state.user.role === "pharmacy" ? "حساب صيدلية" : "حساب مريض";
  document.querySelector("#profile-status").textContent = state.user.role === "pharmacy" ? "الحساب مسجل وينتظر المراجعة" : "الحساب مسجل الدخول";
  loginLink.textContent = state.user.name || "حسابي";
  loginLink.href = "#account-profile";
  loginLink.setAttribute("aria-expanded", String(!profile.hidden));
}

async function logoutFromProfile() {
  try {
    const response = await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
    if (!response.ok) throw new Error("تعذر تسجيل الخروج.");
    state.user = null;
    state.notifications = [];
    state.saved = new Set();
    document.querySelector("#patient-notifications")?.setAttribute("hidden", "");
    document.querySelector("#account-profile").hidden = true;
    renderAccountProfile();
    updateSavedList();
    window.location.href = "auth.html";
  } catch (error) {
    showToast(error.message || "تعذر تسجيل الخروج.");
  }
}

function setupEvents() {
  const loginLink = document.querySelector(".login-link");
  const profile = document.querySelector("#account-profile");
  loginLink?.addEventListener("click", (event) => {
    if (!state.user) return;
    event.preventDefault();
    profile.hidden = !profile.hidden;
    loginLink.setAttribute("aria-expanded", String(!profile.hidden));
  });
  document.querySelector("#profile-logout")?.addEventListener("click", logoutFromProfile);
  document.addEventListener("click", (event) => {
    if (state.user && !event.target.closest("#account-profile, .login-link")) {
      profile.hidden = true;
      loginLink.setAttribute("aria-expanded", "false");
    }
  });
  document.querySelector("#medicine-search-form").addEventListener("submit", (event) => { event.preventDefault(); performSearch(searchInput.value); });
  document.querySelector("#web-search-arabic")?.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) { showToast("اكتب اسم الدواء أولًا للبحث عنه على الويب بالعربي."); searchInput.focus(); return; }
    const webQuery = `${query} دواء المادة الفعالة الاستخدامات الصيدليات مصر`;
    const url = `https://www.google.com/search?hl=ar&gl=eg&q=${encodeURIComponent(webQuery)}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  });
  searchInput.addEventListener("input", () => renderSuggestions(searchInput.value));
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && !suggestionList.hidden) {
      event.preventDefault();
      suggestionList.querySelector(".suggestion-option[role=option]")?.focus();
    }
    if (event.key === "Escape") suggestionList.hidden = true;
  });
  suggestionList.addEventListener("click", (event) => {
    const suggestion = event.target.closest("[data-select-medicine]");
    if (!suggestion) return;
    searchInput.value = suggestion.dataset.selectMedicine;
    performSearch(searchInput.value);
  });
  document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => {
    searchInput.value = button.dataset.query;
    performSearch(searchInput.value);
  }));
  document.querySelector("#clear-search").addEventListener("click", () => {
    resultsSection.hidden = true;
    searchInput.value = "";
    searchInput.focus();
  });
  document.querySelector("#area-search").addEventListener("input", (event) => {
    state.areaQuery = event.target.value.trim();
    renderAreaResults(state.areaQuery);
    if (state.matches.length) renderMedicineResults();
  });
  document.querySelector("#nearby-filter").addEventListener("click", () => {
    document.querySelector("#area-search").focus();
    document.querySelector("#area-search").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.querySelector("#medicine-results").addEventListener("click", (event) => {
    if (!event.target.closest("[data-focus-area]")) return;
    document.querySelector("#area-search").focus();
    document.querySelector("#area-search").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.querySelector("#voice-search").addEventListener("click", setupVoiceSearch);
  document.querySelector("#medicine-photo").addEventListener("change", (event) => {
    if (event.target.files?.length) searchFromPhoto(event.target.files[0]);
    event.target.value = "";
  });
  document.querySelector("#use-location").addEventListener("click", () => {
    if (!navigator.geolocation) { showToast("المتصفح مش بيدعم تحديد الموقع"); return; }
    showToast("بنحدد المنطقة التقريبية من OpenStreetMap...");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const parameters = new URLSearchParams({ lat: String(coords.latitude), lon: String(coords.longitude) });
        const response = await fetch(`/api/area?${parameters}`, { credentials: "same-origin" });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.area) throw new Error(result.error || "area unavailable");
        const area = result.area;
        state.areaQuery = area;
        document.querySelector("#area-search").value = area;
        renderAreaResults(area);
        if (state.matches.length) renderMedicineResults();
        showToast(`لقينا الفروع المسجلة في ${area}. توافر الدواء محتاج تأكيد بالاتصال.`);
      } catch (error) {
        showToast(error.message || "اكتب اسم المنطقة يدويًا عشان نلاقي الفروع المسجلة.");
        document.querySelector("#area-search").focus();
      }
    }, () => showToast("الموقع غير متاح؛ اكتب اسم المنطقة يدويًا"), { timeout: 7000, maximumAge: 60000 });
  });
  const openEmergency = () => document.querySelector("#emergency-dialog")?.showModal();
  document.querySelector("#emergency-top")?.addEventListener("click", openEmergency);
  document.querySelector("#emergency-button")?.addEventListener("click", openEmergency);
  document.querySelectorAll("[data-action]").forEach((card) => {
    const activate = () => { if (card.dataset.action === "search") { searchInput.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); } else if (card.dataset.action === "source") { document.querySelector("#medicine-info")?.scrollIntoView({ behavior: "smooth" }); } else { document.querySelector("#for-everyone")?.scrollIntoView({ behavior: "smooth" }); } };
    card.addEventListener("click", activate); card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
  });
  document.querySelector("#patient-notifications")?.addEventListener("click", async () => {
    const panel = document.querySelector("#notifications-panel");
    const button = document.querySelector("#patient-notifications");
    const opening = panel?.hasAttribute("hidden");
    if (opening) {
      panel?.removeAttribute("hidden");
      button?.setAttribute("aria-expanded", "true");
      if (state.user?.role === "patient") {
        await loadPatientData();
        renderNotifications();
      }
      await markNotificationsRead();
    } else {
      panel?.setAttribute("hidden", "");
      button?.setAttribute("aria-expanded", "false");
    }
  });
  document.querySelector("#notifications-panel")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-notification-open]");
    if (!card) return;
    const notification = state.notifications.find((item) => String(item.id) === String(card.dataset.notificationId));
    if (!notification) return;
    document.querySelector("#notifications-panel")?.setAttribute("hidden", "");
    document.querySelector("#patient-notifications")?.setAttribute("aria-expanded", "false");
    openPharmacyContact(notification);
  });
  document.querySelector('.main-nav a[href="#dawaey-assistant"]')?.addEventListener("click", () => { window.setTimeout(() => document.querySelector("#assistant-input")?.focus(), 250); });
  document.querySelector("#theme-toggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  document.querySelector("#command-search").addEventListener("input", (event) => {
    const query = event.target.value.trim();
    const matches = query ? findMatches(query).slice(0, 8) : [];
    document.querySelector("#command-results").innerHTML = matches.map((record) => `<button type="button" class="command-item" data-command-select="${escapeHtml(record["اسم الدواء"])}"><strong>${escapeHtml(record["اسم الدواء"])}</strong><small>${escapeHtml(record["طبيعة الدواء"] || record["الكود"] || "دواء")}</small></button>`).join("") || '<span class="dialog-hint">ابدأ بكتابة اسم الدواء</span>';
  });
  document.querySelector("#command-results").addEventListener("click", (event) => {
    const item = event.target.closest("[data-command-select]");
    if (!item) return;
    document.querySelector("#command-dialog").close();
    searchInput.value = item.dataset.commandSelect;
    performSearch(searchInput.value);
  });
  document.querySelector("#command-search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector("#command-dialog").close();
      performSearch(event.target.value);
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.querySelector("#command-dialog").showModal();
      document.querySelector("#command-search").focus();
    }
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
  });
  document.querySelector("#onboarding-next").addEventListener("click", () => {
    if (state.onboardingStep === onboardingSlides.length - 1) { document.querySelector("#onboarding-dialog").close(); return; }
    state.onboardingStep += 1;
    renderOnboarding();
  });
  document.querySelector("#onboarding-skip").addEventListener("click", () => document.querySelector("#onboarding-dialog").close());
  document.querySelector("#onboarding-dialog").addEventListener("close", () => {
    try { localStorage.setItem("dawaey-onboarding-done", "yes"); } catch { /* The tour remains dismissible without storage. */ }
  });
  document.querySelector("#medicine-results").addEventListener("click", (event) => {
    const infoCard = event.target.closest(".medicine-result");
    if (infoCard && !event.target.closest("button, a")) { const index = [...document.querySelectorAll(".medicine-result")].indexOf(infoCard); if (state.matches[index]) renderMedicineInfo(state.matches[index]); return; }
    const button = event.target.closest("[data-save-medicine]");
    if (!button) return;
    const key = String(button.dataset.saveMedicine);
    const nextSaved = !state.saved.has(key);
    if (nextSaved) state.saved.add(key);
    else state.saved.delete(key);
    try { localStorage.setItem("dawaey-saved-medications", JSON.stringify([...state.saved])); } catch { /* Server remains the source for logged-in patients. */ }
    persistSavedMedicine(key, nextSaved).catch((error) => showToast(error.message));
    button.setAttribute("aria-pressed", String(state.saved.has(key)));
    button.textContent = state.saved.has(key) ? "★ محفوظ في أدويتي" : "☆ أضف لأدويتي";
    updateSavedList();
  });
  document.querySelector("#saved-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-saved]");
    if (!button) return;
    const key = String(button.dataset.removeSaved);
    state.saved.delete(key);
    persistSavedMedicine(key, false).catch((error) => showToast(error.message));
    try { localStorage.setItem("dawaey-saved-medications", JSON.stringify([...state.saved])); } catch { /* Keep this change in memory. */ }
    updateSavedList();
  });
}

async function start() {
  try {
    const [dataResponse, sessionResponse] = await Promise.all([
      fetch("/api/bootstrap", { credentials: "same-origin" }),
      fetch("/api/session", { credentials: "same-origin" }),
    ]);
    if (!dataResponse.ok || !sessionResponse.ok) throw new Error("تعذر تحميل بيانات دوائي");
    const [data, session] = await Promise.all([dataResponse.json(), sessionResponse.json()]);
    state.inventory = data.catalog ?? [];
    state.pharmacies = data.pharmacies ?? [];
    state.user = session.user ?? null;
    updateStats();
    updateSavedList();
    renderAreaResults();
    const loginLink = document.querySelector(".login-link");
    if (loginLink && state.user) {
      loginLink.setAttribute("aria-label", `حساب ${state.user.name}`);
      renderAccountProfile();
    }
    if (state.user?.role === "patient") {
      await loadPatientData();
      renderNotifications();
      window.clearInterval(state.notificationTimer);
      const refreshPatientNotifications = async () => {
        if (document.visibilityState === "hidden") return;
        await loadPatientData();
        renderNotifications();
      };
      state.notificationTimer = window.setInterval(refreshPatientNotifications, 1000);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") refreshPatientNotifications();
      });
      window.addEventListener("focus", refreshPatientNotifications);
    }
    applyRoleVisibility();
  } catch {
    showToast("بيانات البحث مش متاحة؛ افتح الصفحة من الخادم المحلي");
  }
  applyRoleVisibility();
  setupTabs();
  setupObservers();
  setupEvents();
  setupDonationAndAssistant();
  try {
    const savedTheme = localStorage.getItem("dawaey-theme");
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    const saved = new Set(JSON.parse(localStorage.getItem("dawaey-saved-medications") ?? "[]").map(String));
    if (state.user?.role === "patient") {
      if (!state.saved.size && saved.size) { state.saved = saved; saved.forEach((key) => persistSavedMedicine(key, true).catch(() => {})); }
    } else {
      state.saved = saved;
    }
    updateSavedList();
  } catch { /* The default theme and empty list still work without storage. */ }
  if (state.user?.role === "patient") {
    document.querySelector("#patient-notifications")?.removeAttribute("hidden");
    document.querySelector(".hero-copy h1").innerHTML = `أهلاً بيك يا ${escapeHtml(state.user.name)}<br><span>دواءك أقرب.</span>`;
  }
  showOnboarding();
}

start();
