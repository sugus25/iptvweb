// ==============================================
// 📱 เปิดในแอปอื่น — แก้ไขลิงก์ให้ถูกต้องก่อนส่ง
// ==============================================
document.getElementById('openInAppBtn').addEventListener('click', () => {
  let url = currentUrl || document.getElementById('urlInput').value.trim();
  if (!url) return alert('⚠️ ไม่มีลิงก์วิดีโอครับ กดทดสอบเล่นก่อนหรือใส่ลิงก์ก่อนครับ');

  // ✅ 1. ถอดรหัส URL ก่อน (แก้ปัญหา %3A → : , %2F → /)
  let cleanUrl = decodeURIComponent(url);

  // ✅ 2. ตัดส่วนเกินออก: |referer=... ซ้ำๆ และ #Intent;... ท้ายสุด
  // แยกเอาเฉพาะส่วนลิงก์หลักก่อน | หรือ #
  cleanUrl = cleanUrl.split('|')[0].split('#')[0];

  // ✅ 3. ถ้ามี |referer= อยู่ ให้แยกออกมาเป็นพารามิเตอร์ถูกต้อง
  let refererValue = '';
  const refererMatch = decodeURIComponent(url).match(/[?&|]referer=([^&|#]+)/);
  if (refererMatch) {
    refererValue = decodeURIComponent(refererMatch[1]);
  }

  // ✅ 4. สร้าง Intent ที่สะอาด ไม่มีส่วนเกิน
  let intentUrl = `intent:${encodeURI(cleanUrl)}#Intent;action=android.intent.action.VIEW;type=video/*;`;
  
  // ถ้ามี Referer ให้ส่งไปด้วยแบบถูกต้อง
  if (refererValue) {
    intentUrl += `S.referer=${encodeURIComponent(refererValue)};`;
  }
  
  intentUrl += `end`;

  // 🚀 ส่งไปยังระบบ
  window.location.href = intentUrl;

  // ⏱️ ถ้าไม่มีแอปเปิดได้ → แจ้งเตือน + คัดลอกลิงก์สะอาด
  setTimeout(() => {
    if (confirm('❌ ไม่สามารถเปิดแอปได้ หรือไม่มีแอปที่รองรับ\n✅ ต้องการคัดลอกลิงก์ไปวางในแอปเองไหม?')) {
      navigator.clipboard.writeText(cleanUrl).then(() => {
        alert('✅ คัดลอกลิงก์แล้วครับ!\n' + (refererValue ? `(มี Referer ด้วย)\n` : '') + 'เปิดแอปฯ → วางลิงก์เพื่อเล่นได้เลยครับ');
      });
    }
  }, 1200);
});
