(() => {
  const translations = {
    "دوائي": "Dawaey", "الصفحة الرئيسية": "Home", "إزاي بيشتغل": "How it works", "للمريض": "For patients", "تبرّع": "Donate", "تبرع": "Donate", "مساعد دوائي": "Medicine assistant", "للصيدلية": "For pharmacies", "أسئلة شائعة": "FAQ", "طوارئ": "Emergency", "دخول / حساب جديد": "Log in / Sign up", "استخدم GPS للبحث القريب": "Use GPS for nearby search", "ابحث بصوتك": "Search by voice", "صوّر العلبة": "Scan medicine box", "ابحث على الويب بالعربي": "Search the web in Arabic", "دوّر دلوقتي": "Search now", "اكتب اسم الدواء.. حتى لو مش متأكد من الإملاء": "Type a medicine name...", "نتائج البحث": "Search results", "نتائج:": "Results:", "معلومة الدواء": "Medicine information", "المادة الفعالة": "Active ingredient", "الاستخدام العام": "General use", "حالة السجل": "Record status", "الكود": "Code", "أدويتي المحفوظة": "Saved medicines", "أدويتي": "My medicines", "تبرعاتي": "My donations", "تبرع جديد": "New donation", "مساحتك الإنسانية": "Your giving space", "لسه مفيش تبرعات": "No donations yet", "ابدأ تبرعك الأول": "Start your first donation", "التبرعات": "Donations", "التوريد": "Supply", "طلبات التبرع": "Donation requests", "الأدوية والمخزون": "Medicines & inventory", "دليل الصيدليات": "Pharmacy directory", "نظرة عامة": "Overview", "تقارير الاستهلاك": "Consumption reports", "خروج": "Log out", "تسجيل الخروج": "Log out", "تصدير التقرير": "Export report", "اليوم": "Today", "الصيدليات القريبة": "Nearby pharmacies", "صيدليات منطقتك": "Pharmacies in your area", "استخدم GPS للصيدليات القريبة": "Use GPS for nearby pharmacies", "حدد المحافظة أو المنطقة عشان نجيب الصيدليات القريبة": "Choose a governorate or area to find nearby pharmacies", "حدد المنطقة": "Choose area", "الصيدليات القريبة من موقعك": "Pharmacies near your location", "للمريض": "For patients", "المادة الفعالة": "Active ingredient", "أدويتي المحفوظة": "Saved medicines", "دواءك الزيادة ينفع غيرك": "Your extra medicine can help someone", "تبرّع بعلاج سليم لأقرب صيدلية.": "Donate safe medicine to a nearby pharmacy.", "اسم الدواء أو الكود": "Medicine name or code", "الكمية": "Quantity", "نوع العبوة": "Package type", "المنطقة أو المحافظة": "Area or governorate", "الرقم القومي": "National ID", "مساعدك الدوائي": "Your medicine assistant", "ابدأ تبرعك الأول": "Start your first donation", "المظهر الليلي": "Dark theme", "المظهر النهاري": "Light theme", "تغيير المظهر": "Change theme", "تغيير اللغة": "Change language", "English": "English", "العربية": "Arabic", "حالة الحساب": "Account status", "حساب مريض": "Patient account", "حساب صيدلية": "Pharmacy account", "بيانات محلية": "Local data", "بحث وأدوية محفوظة": "Search and saved medicines", "تسجيل فرع جديد": "Register a branch", "اختار نوع حسابك": "Choose your account type", "مريض": "Patient", "صيدلية": "Pharmacy", "تسجيل الدخول": "Log in", "حساب جديد": "New account", "رجوع للبحث": "Back to search", "الاسم بالكامل": "Full name", "الموبايل أو البريد الإلكتروني": "Phone or email", "كلمة المرور": "Password", "إنشاء الحساب": "Create account", "سجّل دخولك": "Log in", "اختار طريقة المتابعة": "Choose how to continue", "حفظ": "Save", "حذف": "Delete", "متاح": "Available", "قارب على النفاد": "Low stock", "غير متاح": "Unavailable", "تحت الطلب": "On order", "حالة التوريد": "Supply status", "الكمية الحالية": "Current quantity", "حد الطلب": "Reorder level", "الكمية المقترحة": "Suggested quantity", "وحدة القياس": "Unit", "الصنف والفئة": "Item & category", "كل الحالات": "All statuses", "خطر": "Critical", "على وشك الخطر": "Low stock", "لا توجد أصناف مطابقة": "No matching items", "اكتب اسم المنطقة": "Type an area", "استخدم GPS": "Use GPS", "الإشعارات": "Notifications", "إشعارات": "Notifications", "بحث وأدوية محفوظة": "Search and saved medicines",
    "التنقل الرئيسي": "Main navigation",
    "تنبيه الطوارئ - اتصل بالإسعاف 123": "Emergency alert - call ambulance 123",
    "إشعارات الحساب": "Account notifications",
    "التبديل للمظهر الليلي": "Switch to dark theme",
    "التبديل للمظهر النهاري": "Switch to light theme",
    "مساحتك في دوائي": "Your Dawaey space",
    "حالة الحساب": "Account status",
    "أدويتي المحفوظة": "Saved medicines",
    "اكتب اسم الدواء": "Type the medicine name",
    "ابحث عن دواء": "Search for a medicine",
    "جرّب:": "Try:",
    "معاينة توضيحية لبيانات دوائي": "Illustrative Dawaey data preview",
    "ابدأ بحثك من هنا": "Start your search here",
    "واجهة رقمية توضيحية للبحث عن الدواء": "Digital medicine search preview",
    "ابحث باسم الدواء أو الكود": "Search by medicine name or code",
    "بيانات الصنف": "Item data",
    "الكمية والفئة من ملف المصدر": "Quantity and category from the source file",
    "في السجل": "In the record",
    "صيدليات منطقتك": "Pharmacies in your area",
    "اتصل بالصيدلية للتأكد": "Call the pharmacy to confirm",
    "نتائج دواءك": "Your medicine results",
    "فلاتر البحث": "Search filters",
    "في سجل المخزون": "In the inventory record",
    "الأقرب حسب منطقتك": "Nearest by your area",
    "المصدر لا يحتوي مواعيد العمل": "The source has no opening hours",
    "المصدر لا يحتوي أسعارًا": "The source has no prices",
    "ترتيب حسب المنطقة": "Sort by area",
    "الصيدليات القريبة من موقعك": "Pharmacies near your location",
    "اكتب أي مكان أو استخدم GPS لعرض الصيدليات القريبة": "Type a place or use GPS to show nearby pharmacies",
    "حدد المحافظة أو المنطقة عشان نجيب الصيدليات القريبة": "Choose a governorate or area to find nearby pharmacies",
    "مثال: القاهرة، المعادي، الدقي": "Example: Cairo, Maadi, Dokki",
    "عند استخدام الموقع، تُرسل إحداثياتك إلى OpenStreetMap لتحويلها لاسم المنطقة. لا نحفظ الإحداثيات.": "When you use location, your coordinates are sent to OpenStreetMap to find the area name. We do not save coordinates.",
    "المشكلة واضحة": "The problem is clear",
    "وقت المرض مش وقت": "When you are sick, you should not",
    "لفّ على الصيدليات.": "waste time searching pharmacies.",
    "سؤال واحد": "One question",
    "اسم الدواء أو الكود يكفي لتبدأ البحث في سجل الأصناف.": "A medicine name or code is enough to start searching the catalog.",
    "بيانات مفهومة": "Clear data",
    "الكمية والفئة والحالة تظهر بوضوح، من غير وعود بتوفر غير مؤكد.": "Quantity, category, and status are clear, without unconfirmed availability promises.",
    "خطوة تالية": "Next step",
    "تواصل مع الصيدليات القريبة، أو احفظ دواءك للرجوع له على نفس الجهاز.": "Contact nearby pharmacies or save your medicine for later on the same device.",
    "ببساطة": "Simply",
    "من البحث لخطوتك الجاية": "From search to your next step",
    "واجهة واحدة تجمع اللي نعرفه، وتوضح اللي لسه محتاج ربط.": "One interface that gathers what we know and clarifies what still needs connection.",
    "ابحث بالاسم أو الكود، واستخدم اقتراحات الكتابة لتوصل للصنف بسرعة.": "Search by name or code and use suggestions to find the item quickly.",
    "راجع سجل المصدر": "Review the source record",
    "شوف الكمية والفئة وحد الطلب كما وردت في ملف البيانات.": "See the quantity, category, and reorder level from the data file.",
    "كل طرف له": "Everyone has",
    "مساحته.": "their own space.",
    "المريض يبحث بهدوء. والصيدلية تقدر تتابع بياناتها لما تتربط الخدمة بمخزون حي.": "Patients search calmly, while pharmacies can follow their data when connected to live stock.",
    "مميزات دوائي": "Dawaey features",
    "اختار نتيجة عشان تعرف المادة الفعالة والاستخدامات.": "Choose a result to see the active ingredient and uses.",
    "لسه ما اخترتش دواء": "No medicine selected yet",
    "ابحث عن دواء من الأعلى واضغط على النتيجة لعرض التفاصيل.": "Search for a medicine above and click a result to see details.",
    "مساحتك على الجهاز": "Your space on this device",
    "اختار نجمة من نتيجة البحث. القائمة دي محفوظة في حسابك وتقدر ترجع لها من أي جهاز.": "Choose the star on a result. This list is saved to your account and available from any device.",
    "دواءك الزيادة ينفع غيرك": "Your extra medicine can help someone",
    "تبرّع بعلاج سليم لأقرب صيدلية.": "Donate safe medicine to a nearby pharmacy.",
    "اكتب اسم الدواء ومنطقتك، ونساعدك تلاقي صيدليات قريبة للتواصل معها.": "Enter the medicine and area, and we will help you find nearby pharmacies to contact.",
    "لا تسلّم أي دواء منتهي الصلاحية أو مفتوح": "Never donate expired or opened medicine",
    "غير منتهي الصلاحية": "Not expired",
    "العبوة واضحة وسليمة": "Packaging is clear and intact",
    "التسليم بعد التواصل مع الصيدلية": "Delivery after contacting the pharmacy",
    "اختار العبوة": "Choose package type",
    "علبة": "Box",
    "شريط": "Strip",
    "شراب": "Syrup",
    "قلم": "Pen",
    "أنبوبة مرهم": "Ointment tube",
    "أمبول": "Ampoule",
    "بخاخ": "Spray",
    "حذف الدواء": "Remove medicine",
    "+ إضافة دواء آخر": "+ Add another medicine",
    "اكتب أي محافظة أو مكان في مصر": "Enter any governorate or place in Egypt",
    "صورة اختيارية للدواء أو العبوة": "Optional medicine or package photo",
    "الصورة هتتبعت للصيدلية مع بيانات التبرع.": "The photo will be sent to the pharmacy with the donation details.",
    "اكتب 14 رقمًا.": "Enter 14 digits.",
    "اعثر على صيدليات قريبة وأرسل التبرع": "Find nearby pharmacies and send donation",
    "مساحتك الإنسانية": "Your giving space",
    "هنا هتلاقي التبرعات اللي سجلتها وحالتها.": "Here you will find your donations and their status.",
    "تفاصيل الصيدلية ورقم التواصل تظهر داخل الإشعارات عند القبول.": "Pharmacy details and contact number appear in notifications after acceptance.",
    "+ تبرع جديد": "+ New donation",
    "أهلًا، أنا مساعد دوائي.": "Hello, I am the Dawaey assistant.",
    "اسألني عن اسم دواء، مادته الفعالة، أو البحث عن صيدلية حسب المنطقة.": "Ask me about a medicine, its active ingredient, or a pharmacy by area.",
    "اسأل عن الدواء أو خطوات البحث.": "Ask about a medicine or search steps.",
    "مساعد محلي يعتمد على بيانات الموقع الحالية.": "A local assistant based on the current site data.",
    "لا يقدم تشخيصًا أو جرعات، ويطلب منك الرجوع للصيدلي عند الحاجة.": "It does not diagnose or provide doses; consult a pharmacist when needed.",
    "اكتب سؤالك هنا...": "Type your question here...",
    "إرسال السؤال": "Send question",
    "إزاي أتأكد إن الدواء متوفر؟": "How do I check if a medicine is available?",
    "إزاي أستخدم دليل الصيدليات؟": "How do I use the pharmacy directory?",
    "ابدأ البحث": "Start searching",
    "طريقة العمل": "How it works",
    "الخصوصية والبيانات": "Privacy & data",
    "دخول الصيدليات": "Pharmacy login",
    "بحث سريع": "Quick search",
    "بتدور على إيه؟": "What are you looking for?",
    "إغلاق": "Close",
    "دواء، كود، أو فئة": "Medicine, code, or category",
    "سلامتك أولًا": "Your safety comes first",
    "محتاج الدواء حالًا؟": "Need the medicine now?",
    "تخطي": "Skip",
    "التالي": "Next",
    "البحث الصوتي مش مدعوم في المتصفح ده": "Voice search is not supported by this browser",
    "ما قدرناش نسمع بوضوح، جرّب تكتب اسم الدواء": "We could not hear clearly. Try typing the medicine name",
    "سامعينك.. قول اسم الدواء": "Listening... say the medicine name",
    "مش لاقيين تطابق": "No match found",
    "جرّب الاسم العلمي أو الكود": "Try the generic name or code",
    "نتيجة من سجل دوائي": "Result from the medicine catalog",
    "محفوظ في أدويتي": "Saved in My medicines",
    "أضف لأدويتي": "Add to My medicines",
    "اكتب اسم المنطقة عشان نرتّب الصيدليات الأقرب.": "Type an area to sort the nearest pharmacies.",
    "لم نجد صيدليات في النطاق الحالي؛ جرّب مكانًا أقرب أو GPS": "No pharmacies found nearby; try a closer place or GPS",
    "اكتب اسم المنطقة لعرض الصيدليات القريبة": "Type an area to show nearby pharmacies",
    "اتصل للتأكد من توفر الدواء": "Call to confirm availability",
    "اتصال": "Call",
    "رقم غير مدرج": "No number listed",
    "تعذر حفظ الدواء.": "Could not save the medicine.",
    "لا توجد إشعارات جديدة.": "No new notifications.",
    "لسه مفيش أدوية محفوظة.": "No saved medicines yet.",
    "قيد المراجعة": "Under review",
    "تم قبول التبرع": "Donation accepted",
    "تم التسليم": "Delivered",
    "لم يتم القبول": "Not accepted",
    "جديد": "New",
    "دواء غير محدد": "Unspecified medicine",
    "مكان غير محدد": "Unspecified location",
    "اكتب اسم الدواء الأول": "Enter a medicine name first",
    "ملقيناش الاسم ده في الكتالوج الحالي.": "This name was not found in the current catalog.",
    "لقينا": "Found",
    "تطابق في سجل الأصناف.": "matches in the item catalog.",
    "دي معاينة محدودة.": "This is a limited preview.",
    "سجّل كمريض لعرض نتائج أكتر.": "Sign in as a patient to see more results.",
    "ابدأ": "Start",
    "قربنا نخلص قراءة العلبة...": "Almost done reading the package...",
    "بنقرأ اسم الدواء من الصورة بالعربي والإنجليزي...": "Reading the medicine name in Arabic and English...",
    "الصورة اتقرت لكن الاسم مش واضح في سجل الأدوية؛ قرّب العلبة وصوّر الاسم أو اكتب الاسم يدويًا.": "The image was read, but the name was not clear in the catalog. Move closer, photograph the name, or type it manually.",
    "تعذر قراءة العلبة. استخدم إضاءة أفضل وصوّر اسم الدواء كاملًا.": "Could not read the package. Use better lighting and photograph the full medicine name.",
    "بيانات الصيدلية": "Pharmacy data",
    "فتح موقع الصيدلية على الخريطة": "Open pharmacy location on map",
    "بيانات التواصل": "Contact details",
    "العنوان": "Address",
    "رقم التواصل": "Contact number",
    "غير مسجل": "Not registered",
    "ابدأ بكتابة اسم الدواء": "Start typing a medicine name"
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
