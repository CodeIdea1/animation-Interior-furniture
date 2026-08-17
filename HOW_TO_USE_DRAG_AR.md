# 🎮 كيفية استخدام ميزة سحب المصباح

## 📱 للمستخدم النهائي

### الخطوات:
1. **افتح الموقع** في المتصفح
2. **انتظر 3 ثوانٍ** حتى ينتهي الأنيميشن الأولي
3. **حرك المؤشر** فوق المصباح الثاني (light2) - سيتحول المؤشر إلى يد ✋
4. **اضغط واسحب للأسفل** بالماوس أو الإصبع
5. **ارفع يدك** وشاهد التأرجح الجميل! 🎪

### الأجهزة المدعومة:
- ✅ **الكمبيوتر**: سحب بالماوس
- ✅ **الموبايل**: سحب باللمس
- ✅ **التابلت**: سحب باللمس

---

## 👨‍💻 للمطور

### التشغيل السريع:
```bash
npm run dev
```

### اختبار الميزة:
1. افتح المتصفح على `http://localhost:3000`
2. انتظر 3 ثوانٍ
3. اسحب المصباح الثاني للأسفل
4. لاحظ التأرجح عند الإفلات

### تعديل الإعدادات:

#### تغيير وقت التفعيل:
```typescript
// في HeroSection.tsx - السطر ~303
const timer = setTimeout(() => {
  animationCompleted = true;
}, 3000); // غير 3000 إلى المدة المطلوبة بالملي ثانية
```

#### تغيير الحد الأقصى للسحب:
```typescript
// السطر ~328
const constrainedY = Math.min(Math.max(deltaY, 0), 150); 
// غير 150 إلى القيمة المطلوبة بالبكسل
```

#### تغيير قوة الدوران:
```typescript
// السطر ~341
rotation: constrainedY * 0.05
// غير 0.05 لزيادة/تقليل الدوران
```

#### تعديل التأرجح:
```typescript
// السطر ~358-388
rotation: -swingStrength * 12  // التأرجح الأول
rotation: swingStrength * 6    // التأرجح الثاني
rotation: -swingStrength * 3   // التأرجح الثالث
// غير الأرقام 12, 6, 3 للتحكم بقوة كل تأرجحة
```

### الملفات المعنية:
```
app/components/
  ├── HeroSection.tsx          ← منطق السحب والأنيميشن
  └── HeroSection.module.css   ← الأنماط البصرية
```

### المتغيرات الرئيسية:
```typescript
isDraggingLight2      // حالة السحب (true/false)
dragStartY           // نقطة بداية السحب (Y coordinate)
currentY             // المسافة المسحوبة حالياً
animationFrameId     // معرف الإطار للتحسين
```

### الأحداث (Events):
```typescript
mousedown / touchstart   → بداية السحب
mousemove / touchmove    → حركة السحب
mouseup / touchend       → نهاية السحب + التأرجح
```

### دوال مساعدة:
```typescript
handleStart(clientY)  // بداية السحب (موحدة للماوس واللمس)
handleMove(clientY)   // حركة السحب (موحدة للماوس واللمس)
handleEnd()          // نهاية السحب + تشغيل أنيميشن التأرجح
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: الميزة لا تعمل
**الحلول:**
1. تأكد من انتظار 3 ثوانٍ بعد تحميل الصفحة
2. تحقق من Console للأخطاء
3. تأكد من تثبيت GSAP بشكل صحيح: `npm install gsap`

### المشكلة: السحب غير سلس
**الحلول:**
1. تحقق من أداء المتصفح (افتح DevTools → Performance)
2. قلل عدد العناصر المتحركة الأخرى
3. تأكد من وجود `will-change` في CSS

### المشكلة: لا يعمل على الموبايل
**الحلول:**
1. تأكد من وجود `{ passive: false }` في event listeners
2. تحقق من دعم `preventDefault()` للمتصفح
3. اختبر على متصفح مختلف

---

## 🎨 التخصيص المتقدم

### إضافة صوت عند السحب:
```typescript
const handleStart = (clientY: number) => {
  if (!animationCompleted) return;
  // أضف هنا
  const audio = new Audio('/sounds/click.mp3');
  audio.play();
  // ...
};
```

### إضافة اهتزاز (Haptic Feedback):
```typescript
const handleEnd = () => {
  // أضف قبل التأرجح
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // اهتزاز لمدة 50ms
  }
  // ...
};
```

### تغيير التأثيرات البصرية:
```css
/* في HeroSection.module.css */
.light2Container:hover {
  filter: brightness(1.1) drop-shadow(0 0 20px rgba(255,255,255,0.5));
  transform: translateX(-50%) scale(1.05);
}
```

---

## 📊 مقاييس الأداء

### الأهداف:
- ✅ **60 FPS** أثناء السحب
- ✅ **< 16ms** لكل إطار
- ✅ **سلاسة كاملة** بدون قفزات

### كيفية القياس:
1. افتح Chrome DevTools
2. اذهب إلى Performance
3. سجل أثناء السحب
4. تحقق من FPS Graph

---

## 🎉 ميزات إضافية مستقبلية (أفكار)

- [ ] إضافة صوت عند التأرجح
- [ ] تأثير ظل ديناميكي حسب موضع السحب
- [ ] إضافة particles عند الإفلات
- [ ] دعم السحب بالاتجاهات الأخرى (يمين/يسار)
- [ ] إضافة تأثير blur عند السرعة العالية
- [ ] حفظ أفضل مسافة سحب في localStorage

---

تم التنفيذ بواسطة Kiro AI ✨
