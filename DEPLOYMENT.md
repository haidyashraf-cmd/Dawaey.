# دوائي — تشغيل Backend واحد

## الفكرة

الخادم الموجود في `scripts/server.py` يقدّم كل شيء من نفس المصدر:

- صفحات HTML وملفات CSS/JavaScript والصور.
- بيانات الأدوية والصيدليات من `data/dawaey-data.json` الموجود في المستودع.
- التسجيل وتسجيل الدخول والجلسات عبر `/api`.
- طلبات التبرع المشتركة عبر `/api/donations`.
- لوحة الصيدلية من نفس الخادم.

لا يحتاج هذا الوضع إلى GitHub Pages أو `localStorage` لحفظ طلبات التبرع.

## التشغيل محليًا

```bash
PORT=3000 python3 scripts/server.py
```

ثم افتح:

```text
http://localhost:3000/
```

يُنشئ الخادم قاعدة SQLite في:

```text
data/dawaey-users.sqlite3
```

يمكن تغيير مكانها بمتغير البيئة:

```bash
DAWAEY_DATABASE=/var/lib/dawaey/dawaey.sqlite3 PORT=3000 python3 scripts/server.py
```

## Docker

```bash
docker build -t dawaey .
docker run --rm -p 3000:3000 \
  -v dawaey-data:/app/data \
  dawaey
```

يجب استخدام volume دائم لملف SQLite. بدون volume ستضيع الحسابات وطلبات التبرع عند إعادة إنشاء الحاوية.

## نشر دائم

1. اربط المستودع بخدمة استضافة Backend تدعم Docker، مثل Render أو Railway أو أي VPS.
2. اجعل أمر التشغيل:

   ```text
   PORT=${PORT:-3000} python3 scripts/server.py
   ```

3. استخدم تخزينًا دائمًا للمجلد `/app/data`، أو انقل جداول الحسابات والجلسات والتبرعات إلى PostgreSQL مستضافة.
4. لا تضع كلمات المرور أو مفاتيح الخدمة داخل GitHub؛ استخدم Environment Variables في منصة الاستضافة.
5. اختبر:

   ```text
   GET /healthz
   GET /api/bootstrap
   GET /api/session
   GET /api/donations
   ```

## ملاحظة مهمة

الرابط التجريبي في بيئة Manus مؤقت. النشر الدائم يحتاج اختيار منصة استضافة وحسابًا/بيانات اتصال بها. GitHub يحفظ الكود وملف البيانات فقط، ولا يشغّل Python أو قاعدة البيانات بنفسه.

## إشعارات تسجيل الصيدليات

عند تسجيل صيدلية جديدة، يرسل الخادم إشعارًا إلى Telegram وMeta WhatsApp إذا كانت متغيرات البيئة موجودة:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
WHATSAPP_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_RECIPIENT_PHONE=201030418337
WHATSAPP_VERIFY_TOKEN
```

يحتوي الإشعار على زري **قبول** و**رفض**. Telegram يعالج الزر عبر polling. WhatsApp يستقبل الرد عبر:

```text
https://YOUR-RAILWAY-DOMAIN/webhooks/whatsapp
```

في Meta Webhooks استخدم `WHATSAPP_VERIFY_TOKEN` نفسه، واشترك في أحداث WhatsApp messages. قد تحتاج رسائل WhatsApp الأولى إلى Message Template معتمد من Meta، حسب حالة نافذة المحادثة وحساب WhatsApp Business.
