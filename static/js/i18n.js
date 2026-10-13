(() => {
  const translations = {
    "دوائي": "Dawaey", "الصفحة الرئيسية": "Home", "إزاي بيشتغل": "How it works", "للمريض": "For patients", "تبرّع": "Donate", "تبرع": "Donate", "مساعد دوائي": "Medicine assistant", "للصيدلية": "For pharmacies", "أسئلة شائعة": "FAQ", "طوارئ": "Emergency", "دخول / حساب جديد": "Log in / Sign up", "استخدم GPS للبحث القريب": "Use GPS for nearby search", "ابحث بصوتك": "Search by voice", "صوّر العلبة": "Scan medicine box", "ابحث على الويب بالعربي": "Search the web in Arabic", "دوّر دلوقتي": "Search now", "اكتب اسم الدواء.. حتى لو مش متأكد من الإملاء": "Type a medicine name...", "نتائج البحث": "Search results", "نتائج:": "Results:", "معلومة الدواء": "Medicine information", "المادة الفعالة": "Active ingredient", "الاستخدام العام": "General use", "حالة السجل": "Record status", "الكود": "Code", "أدويتي المحفوظة": "Saved medicines", "أدويتي": "My medicines", "تبرعاتي": "My donations", "تبرع جديد": "New donation", "مساحتك الإنسانية": "Your giving space", "لسه مفيش تبرعات": "No donations yet", "ابدأ تبرعك الأول": "Start your first donation", "التبرعات": "Donations", "التوريد": "Supply", "طلبات التبرع": "Donation requests", "الأدوية والمخزون": "Medicines & inventory", "دليل الصيدليات": "Pharmacy directory", "نظرة عامة": "Overview", "تقارير الاستهلاك": "Consumption reports", "خروج": "Log out", "تسجيل الخروج": "Log out", "تصدير التقرير": "Export report", "اليوم": "Today", "الصيدليات القريبة": "Nearby pharmacies", "صيدليات منطقتك": "Pharmacies in your area", "استخدم GPS للصيدليات القريبة": "Use GPS for nearby pharmacies", "حدد المحافظة أو المنطقة عشان نجيب الصيدليات القريبة": "Choose a governorate or area to find nearby pharmacies", "حدد المنطقة": "Choose area", "الصيدليات القريبة من موقعك": "Pharmacies near your location", "للمريض": "For patients", "المادة الفعالة": "Active ingredient", "أدويتي المحفوظة": "Saved medicines", "دواءك الزيادة ينفع غيرك": "Your extra medicine can help someone", "تبرّع بعلاج سليم لأقرب صيدلية.": "Donate safe medicine to a nearby pharmacy.", "اسم الدواء أو الكود": "Medicine name or code", "الكمية": "Quantity", "نوع العبوة": "Package type", "المنطقة أو المحافظة": "Area or governorate", "الرقم القومي": "National ID", "مساعدك الدوائي": "Your medicine assistant", "ابدأ تبرعك الأول": "Start your first donation", "المظهر الليلي": "Dark theme", "المظهر النهاري": "Light theme", "تغيير المظهر": "Change theme", "تغيير اللغة": "Change language", "English": "English", "العربية": "Arabic", "حالة الحساب": "Account status", "حساب مريض": "Patient account", "حساب صيدلية": "Pharmacy account", "بيانات محلية": "Local data", "بحث وأدوية محفوظة": "Search and saved medicines", "تسجيل فرع جديد": "Register a branch", "اختار نوع حسابك": "Choose your account type", "مريض": "Patient", "صيدلية": "Pharmacy", "تسجيل الدخول": "Log in", "حساب جديد": "New account", "رجوع للبحث": "Back to search", "الاسم بالكامل": "Full name", "الموبايل أو البريد الإلكتروني": "Phone or email", "كلمة المرور": "Password", "إنشاء الحساب": "Create account", "سجّل دخولك": "Log in", "اختار طريقة المتابعة": "Choose how to continue", "حفظ": "Save", "حذف": "Delete", "متاح": "Available", "قارب على النفاد": "Low stock", "غير متاح": "Unavailable", "تحت الطلب": "On order", "حالة التوريد": "Supply status", "الكمية الحالية": "Current quantity", "حد الطلب": "Reorder level", "الكمية المقترحة": "Suggested quantity", "وحدة القياس": "Unit", "الصنف والفئة": "Item & category", "كل الحالات": "All statuses", "خطر": "Critical", "على وشك الخطر": "Low stock", "لا توجد أصناف مطابقة": "No matching items", "اكتب اسم المنطقة": "Type an area", "استخدم GPS": "Use GPS", "الإشعارات": "Notifications", "إشعارات": "Notifications", "بحث وأدوية محفوظة": "Search and saved medicines"
  };
  const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  const originals = new WeakMap();
  const attributeOriginals = new WeakMap();
  let language = localStorage.getItem("dawaey-language") || "ar";
  const originalTitle = document.title;
  let applying = false;

  function translate(value, target) {
    let result = value;
    for (const [ar, en] of entries) {
      const from = target === "en" ? ar : en;
      const to = target === "en" ? en : ar;
      result = result.split(from).join(to);
    }
    return result;
  }
  function textNodes(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (node) => {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes = []; let node; while ((node = walker.nextNode())) nodes.push(node); return nodes;
  }
  function translateAttributes(root = document.body) {
    const attrs = ["placeholder", "title", "aria-label", "aria-description"];
    root.querySelectorAll("*").forEach((element) => {
      let saved = attributeOriginals.get(element); if (!saved) { saved = {}; attributeOriginals.set(element, saved); }
      attrs.forEach((attr) => { if (element.hasAttribute(attr)) { if (!(attr in saved)) saved[attr] = element.getAttribute(attr); element.setAttribute(attr, translate(saved[attr], language)); } });
    });
  }
  function apply() {
    if (applying) return; applying = true;
    document.documentElement.lang = language === "en" ? "en" : "ar";
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";
    textNodes().forEach((node) => { if (!originals.has(node)) originals.set(node, node.nodeValue); node.nodeValue = translate(originals.get(node), language); });
    translateAttributes();
    document.querySelectorAll("#language-toggle").forEach((button) => { button.textContent = "E"; button.setAttribute("aria-label", language === "en" ? "Switch to Arabic" : "التبديل للإنجليزية"); button.setAttribute("title", language === "en" ? "Switch to Arabic" : "تغيير اللغة"); });
    document.title = language === "en" ? "Dawaey | Find your medicine" : originalTitle;
    localStorage.setItem("dawaey-language", language); applying = false;
  }
  function toggle() { language = language === "en" ? "ar" : "en"; apply(); }
  window.dawaeyI18n = { apply, toggle, get language() { return language; }, translate };
  document.addEventListener("click", (event) => { if (event.target.closest("#language-toggle")) { event.preventDefault(); toggle(); } });
  new MutationObserver(() => { if (!applying && language === "en") apply(); }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("DOMContentLoaded", apply);
})();
