const state = { role: "patient", mode: "login", busy: false };
const LOCATION_DATA = {"القاهرة": ["مدينة نصر", "مصر الجديدة", "المعادي", "حلوان", "الزمالك", "المطرية", "عين شمس", "المرج", "شبرا", "السيدة زينب", "الخليفة", "البساتين", "دار السلام", "السلام", "النزهة", "الوايلي", "حدائق القبة", "منشأة ناصر"], "الجيزة": ["الدقي", "العجوزة", "المهندسين", "الهرم", "فيصل", "العمرانية", "بولاق الدكرور", "إمبابة", "الوراق", "6 أكتوبر", "الشيخ زايد", "الحوامدية", "أبو النمرس", "البدرشين", "العياط", "أوسيم", "كرداسة", "الصف", "أطفيح", "الواحات البحرية"], "الإسكندرية": ["المنتزه", "شرق الإسكندرية", "وسط الإسكندرية", "الجمرك", "غرب الإسكندرية", "العجمي", "العامرية", "برج العرب", "سيدي جابر", "محرم بك", "الرمل"], "القليوبية": ["بنها", "شبرا الخيمة", "القناطر الخيرية", "الخانكة", "الخصوص", "العبور", "قليوب", "طوخ", "شبين القناطر", "كفر شكر"], "الدقهلية": ["المنصورة", "طلخا", "ميت غمر", "دكرنس", "منية النصر", "السنبلاوين", "أجا", "شربين", "بلقاس", "جمصة", "المطرية", "منزلة النصر"], "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "منيا القمح", "فاقوس", "أبو كبير", "كفر صقر", "الحسينية", "ههيا", "الإبراهيمية", "أولاد صقر", "مشتول السوق"], "الغربية": ["طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة", "سمنود", "قطور", "بسيون"], "البحيرة": ["دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو المطامير", "أبو حمص", "حوش عيسى", "الدلنجات", "المحمودية", "إيتاي البارود", "كوم حمادة", "وادي النطرون", "شبراخيت"], "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "قلين", "سيدي سالم", "الحامول", "بلطيم", "الرياض", "بيلا", "البرلس"], "دمياط": ["دمياط", "دمياط الجديدة", "رأس البر", "فارسكور", "الزرقا", "كفر سعد", "كفر البطيخ", "السرو"], "بورسعيد": ["حي الشرق", "حي العرب", "حي المناخ", "حي الضواحي", "حي الزهور", "حي الجنوب", "بورفؤاد"], "الإسماعيلية": ["الإسماعيلية", "فايد", "القنطرة شرق", "القنطرة غرب", "التل الكبير", "أبو صوير", "القصاصين الجديدة"], "السويس": ["حي السويس", "حي الأربعين", "حي عتاقة", "حي فيصل", "حي الجناين"], "شمال سيناء": ["العريش", "بئر العبد", "الشيخ زويد", "رفح", "الحسنة", "نخل"], "جنوب سيناء": ["الطور", "شرم الشيخ", "دهب", "نويبع", "طابا", "سانت كاترين", "رأس سدر", "أبو رديس", "أبو زنيمة"], "بني سويف": ["بني سويف", "الواسطي", "ناصر", "إهناسيا", "ببا", "الفشن", "سمسطا"], "الفيوم": ["الفيوم", "سنورس", "إطسا", "طامية", "أبشواي", "يوسف الصديق"], "المنيا": ["المنيا", "ملوي", "مغاغة", "بني مزار", "سمالوط", "أبو قرقاص", "مطاي", "العدوة", "دير مواس"], "أسيوط": ["أسيوط", "ديروط", "القوصية", "منفلوط", "أبنوب", "الفتح", "أبو تيج", "الغنايم", "ساحل سليم", "البداري", "صدفا"], "سوهاج": ["سوهاج", "أخميم", "جرجا", "البلينا", "طهطا", "المراغة", "المنشأة", "دار السلام", "جهينة", "ساقلتة"], "قنا": ["قنا", "نجع حمادي", "دشنا", "قفط", "قوص", "نقادة", "فرشوط", "أبو تشت", "الوقف"], "الأقصر": ["الأقصر", "إسنا", "أرمنت", "القرنة", "البياضية", "الزينية", "الطود"], "أسوان": ["أسوان", "كوم أمبو", "إدفو", "دراو", "نصر النوبة", "أبو سمبل"], "البحر الأحمر": ["الغردقة", "رأس غارب", "سفاجا", "القصير", "مرسى علم", "الشلاتين", "حلايب"], "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط"], "مطروح": ["مرسى مطروح", "الحمام", "العلمين", "الضبعة", "النجيلة", "سيدي براني", "السلوم", "سيوة"], "المنوفية": ["شبين الكوم", "منوف", "السادات", "أشمون", "الباجور", "تلا", "بركة السبع", "قويسنا", "الشهداء", "سرس الليان"]};
const form = document.querySelector("#account-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");
const numberFormat = new Intl.NumberFormat("ar-EG");

function setMessage(text, kind = "error") {
  message.textContent = text;
  message.classList.toggle("is-success", kind === "success");
  message.hidden = !text;
}

function clearFieldErrors() {
  form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
  setMessage("");
}

function visibleRequired(field) {
  return !field.closest("[hidden]");
}

function syncForm() {
  const registering = state.mode === "register";
  document.body.dataset.authMode = state.mode;
  document.querySelectorAll("[data-register-only]").forEach((element) => {
    const wrongRole = element.dataset.roleFields && element.dataset.roleFields !== state.role;
    element.hidden = !registering || Boolean(wrongRole);
  });

  form.querySelectorAll("[data-required]").forEach((field) => {
    field.required = visibleRequired(field);
  });

  document.querySelectorAll(".role-option").forEach((button) => {
    const active = button.dataset.role === state.role;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".auth-mode [data-mode]").forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  const contactLabel = document.querySelector("#contact-label");
  const contactInput = form.elements.contact;
  contactLabel.textContent = state.role === "pharmacy" ? "رقم الموبايل المسجل للصيدلية" : "الموبايل أو البريد الإلكتروني";
  contactInput.type = state.role === "pharmacy" ? "tel" : "text";
  contactInput.inputMode = state.role === "pharmacy" ? "tel" : "text";
  contactInput.placeholder = state.role === "pharmacy" ? "01xxxxxxxxx" : "01xxxxxxxxx أو name@email.com";
  form.elements.password.autocomplete = registering ? "new-password" : "current-password";
  document.querySelector("#password-strength").hidden = !registering;
  document.querySelector("#review-note").hidden = !(registering && state.role === "pharmacy");
  document.querySelector("#submit-button").innerHTML = `${registering ? "إنشاء الحساب" : "تسجيل الدخول"} <span aria-hidden="true">←</span>`;
  document.querySelector("#auth-title").textContent = registering ? "حسابك يبدأ من هنا" : "سجّل دخولك";
  document.querySelector("#auth-description").textContent = registering
    ? state.role === "pharmacy" ? "قدّم بيانات الفرع للمراجعة قبل تفعيل الحساب." : "اكتب بياناتك مرة واحدة عشان تحفظ أدويتك." 
    : "ادخل بيانات حسابك للمتابعة في دوائي.";
  document.querySelector("#mode-footnote").textContent = registering
    ? "بيانات التسجيل تُحفظ في قاعدة دوائي المحلية، وكلمة المرور لا تُحفظ كنص مباشر."
    : "الدخول آمن بكلمة مرور مشفّرة على الخادم المحلي.";
  clearFieldErrors();
}

function updatePasswordStrength() {
  const password = form.elements.password.value;
  const panel = document.querySelector("#password-strength");
  const length = password.length;
  let score = 0;
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ["اكتب كلمة مرور", "ضعيفة", "مقبولة", "قوية", "قوية جدًا"];
  panel.dataset.level = String(score);
  panel.querySelector(".strength-track i").style.width = `${score * 25}%`;
  panel.querySelector("small").textContent = labels[score];
}

function fillLocationSuggestions() {
  const governorates = Object.keys(LOCATION_DATA);
  document.querySelectorAll("[data-location-governorate]").forEach((select) => {
    const current = select.value;
    select.innerHTML = `<option value="">اختار المحافظة</option>${governorates.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
    if (governorates.includes(current)) select.value = current;
  });
  document.querySelectorAll("[data-location-governorate]").forEach((governorateSelect) => {
    const districtSelect = governorateSelect.closest(".role-fields")?.querySelector("[data-location-district]");
    const updateDistricts = () => {
      const districts = LOCATION_DATA[governorateSelect.value] || [];
      districtSelect.innerHTML = `<option value="">اختار المنطقة</option>${districts.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
      districtSelect.disabled = !districts.length;
    };
    governorateSelect.addEventListener("change", updateDistricts);
    updateDistricts();
  });
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

async function requestApi(path, payload) {
  const response = await fetch(`/api/${path}`, {
    method: payload ? "POST" : "GET",
    credentials: "same-origin",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "تعذر الاتصال بخدمة دوائي.");
  return result;
}

function redirectByAccountRole(user) {
  // الحسابان منفصلان: الصيدلية لا تدخل واجهة المريض، والمريض لا يدخل لوحة الصيدلية.
  if (user?.role === "pharmacy") {
    window.location.replace("pharmacy.html");
    return;
  }
  window.location.replace("index.html?welcome=1#top");
}

function showAccount(user) {
  form.hidden = true;
  document.querySelector(".role-picker").hidden = true;
  document.querySelector(".auth-mode").hidden = true;
  const panel = document.querySelector("#signed-in-panel");
  const isPharmacy = user.role === "pharmacy";
  redirectByAccountRole(user);
  return;
  panel.innerHTML = `<h2>أهلاً ${escapeHtml(user.name)}</h2><p>${isPharmacy ? `حساب ${escapeHtml(user.pharmacyName || "الصيدلية")} في انتظار موافقة إدارة دوائي.` : "تم تسجيل دخولك. تقدر ترجع للبحث وتكمل من حيث وصلت."}</p><span class="${isPharmacy ? "pending-mark" : "pending-mark"}">${isPharmacy ? "قيد المراجعة" : "حساب مريض"}</span><div class="signed-in-actions"><a href="index.html${isPharmacy ? "#for-everyone" : "#my-medicines"}">العودة إلى دوائي</a><button type="button" id="logout-button">تسجيل الخروج</button></div>`;
  panel.hidden = false;
  document.querySelector("#auth-title").textContent = isPharmacy ? "طلب الصيدلية" : "تم تسجيل الدخول";
  document.querySelector("#auth-description").textContent = isPharmacy ? "هنتواصل معاك بعد مراجعة البيانات." : `الحساب مرتبط بـ ${user.contact}.`;
}

function showPendingApplication(pharmacyName) {
  form.hidden = true;
  document.querySelector(".role-picker").hidden = true;
  document.querySelector(".auth-mode").hidden = true;
  const panel = document.querySelector("#signed-in-panel");
  panel.innerHTML = `<span class="pending-mark">طلب قيد المراجعة</span><h2>وصلنا طلب ${escapeHtml(pharmacyName)}</h2><p>حفظنا بيانات الصيدلية في قاعدة البيانات المحلية. الطلب لن يظهر في دليل الفروع أو يسجل دخولًا قبل موافقة الإدارة.</p><div class="signed-in-actions"><a href="index.html">العودة إلى دوائي</a><button type="button" id="back-to-login">رجوع لتسجيل الدخول</button></div>`;
  panel.hidden = false;
  document.querySelector("#auth-title").textContent = "طلب الصيدلية";
  document.querySelector("#auth-description").textContent = "استلام الطلب لا يعني اعتماد بيانات الفرع.";
}

function restoreForm() {
  document.querySelector("#signed-in-panel").hidden = true;
  document.querySelector(".role-picker").hidden = false;
  document.querySelector(".auth-mode").hidden = false;
  form.hidden = false;
  state.mode = "login";
  syncForm();
}

function setBusy(busy) {
  state.busy = busy;
  submitButton.disabled = busy;
  submitButton.querySelector("span").textContent = busy ? "..." : "←";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFieldErrors();
  const visibleFields = [...form.querySelectorAll("input")].filter((field) => visibleRequired(field));
  const invalid = visibleFields.find((field) => !field.checkValidity());
  if (invalid) {
    invalid.setAttribute("aria-invalid", "true");
    setMessage(invalid.type === "checkbox" ? "وافق على حفظ بيانات الحساب لإكمال التسجيل." : "راجع الحقل المحدد واكتب بيانات صحيحة.");
    invalid.focus();
    return;
  }

  const formData = new FormData(form);
  const password = String(formData.get("password") ?? "");
  if (state.mode === "register" && password !== formData.get("passwordConfirm")) {
    form.elements.passwordConfirm.setAttribute("aria-invalid", "true");
    setMessage("كلمتا المرور مش متطابقتين.");
    form.elements.passwordConfirm.focus();
    return;
  }

  const payload = {
    role: state.role,
    fullName: String(formData.get("fullName") ?? "").trim(),
    contact: String(formData.get("contact") ?? "").trim(),
    password,
  };
  if (state.mode === "register") {
    payload.privacyAccepted = formData.get("privacyAccepted") === "yes";
    const locationPrefix = state.role === "patient" ? "patient" : "pharmacy";
    payload.governorate = String(formData.get(`${locationPrefix}Governorate`) ?? "").trim();
    payload.district = String(formData.get(`${locationPrefix}District`) ?? "").trim();
    if (state.role === "pharmacy") {
      Object.assign(payload, {
        pharmacyName: String(formData.get("pharmacyName") ?? "").trim(),
        pharmacistName: String(formData.get("pharmacistName") ?? "").trim(),
        licenseNumber: String(formData.get("licenseNumber") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        openingHours: String(formData.get("openingHours") ?? "").trim(),
        whatsapp: String(formData.get("whatsapp") ?? "").trim(),
        latitude: String(formData.get("pharmacyLatitude") ?? "").trim(),
        longitude: String(formData.get("pharmacyLongitude") ?? "").trim(),
        locationUrl: String(formData.get("pharmacyLocationUrl") ?? "").trim(),
      });
    }
  }

  setBusy(true);
  try {
    if (state.mode === "register" && state.role === "pharmacy") {
      const response = await requestApi("register", payload);
      showPendingApplication(payload.pharmacyName);
      setMessage(response.message, "success");
    } else {
      const response = await requestApi(state.mode === "register" ? "register" : "login", state.mode === "register" ? { ...payload, privacyAccepted: payload.privacyAccepted } : { role: state.role, contact: payload.contact, password: payload.password });
      if (response.user) {
        showAccount(response.user);
        if (response.user.role !== "pharmacy" || response.user.status !== "approved") {
          setMessage(state.mode === "register" ? "تم إنشاء حساب المريض وتسجيل الدخول بنجاح." : "تم تسجيل الدخول بنجاح.", "success");
        }
      }
    }
  } catch (error) {
    setMessage(error.message || "حصلت مشكلة في الاتصال. جرّب تاني.");
  } finally {
    setBusy(false);
  }
});

document.querySelectorAll(".role-option").forEach((button) => button.addEventListener("click", () => {
  state.role = button.dataset.role;
  syncForm();
}));

document.querySelectorAll(".auth-mode [data-mode]").forEach((button) => button.addEventListener("click", () => {
  state.mode = button.dataset.mode;
  syncForm();
}));

form.elements.password.addEventListener("input", updatePasswordStrength);
form.addEventListener("input", (event) => {
  if (event.target.matches("[aria-invalid='true']")) event.target.removeAttribute("aria-invalid");
  if (event.target.name === "password") updatePasswordStrength();
});

document.querySelector(".password-toggle").addEventListener("click", (event) => {
  const input = form.elements.password;
  input.type = input.type === "password" ? "text" : "password";
  event.currentTarget.textContent = input.type === "password" ? "إظهار" : "إخفاء";
  event.currentTarget.setAttribute("aria-label", input.type === "password" ? "إظهار كلمة المرور" : "إخفاء كلمة المرور");
});

document.addEventListener("click", async (event) => {
  if (event.target.closest("#back-to-login")) restoreForm();
  if (!event.target.closest("#logout-button")) return;
  try {
    await requestApi("logout", {});
    restoreForm();
  } catch (error) {
    setMessage(error.message || "تعذر تسجيل الخروج.");
  }
});

async function initializeAuth() {
  const savedTheme = localStorage.getItem("dawaey-theme");
  if (savedTheme === "dark" || savedTheme === "light") document.documentElement.dataset.theme = savedTheme;
  syncForm();
  const errorMessage = new URLSearchParams(window.location.search).get("error");
  if (errorMessage) setMessage(errorMessage);
  try {
    const [bootstrap, session] = await Promise.all([requestApi("bootstrap"), requestApi("session")]);
    fillLocationSuggestions();
    if (session.user) showAccount(session.user);
  } catch {
    setMessage("خدمة الحسابات مش شغالة. افتح الموقع من الخادم المحلي بعد تشغيله.");
  }
}

document.querySelector("#pharmacy-register-gps")?.addEventListener("click", () => {
  if (!navigator.geolocation) { setMessage("المتصفح لا يدعم GPS."); return; }
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    form.elements.pharmacyLatitude.value = coords.latitude;
    form.elements.pharmacyLongitude.value = coords.longitude;
    form.elements.pharmacyLocationUrl.value = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    try { const response = await fetch(`/api/area?lat=${encodeURIComponent(coords.latitude)}&lon=${encodeURIComponent(coords.longitude)}`); const payload = await response.json(); if (payload.area) { const district = form.elements.pharmacyDistrict; if (![...district.options].some((option) => option.value === payload.area)) district.add(new Option(payload.area, payload.area)); district.value = payload.area; } } catch { /* coordinates are still saved */ }
    setMessage("تم تحديد موقع الصيدلية بالـ GPS.", "success");
  }, () => setMessage("الموقع غير متاح؛ اكتب المنطقة يدويًا."), { timeout: 10000, maximumAge: 60000 });
});

initializeAuth();
