export const showcaseStats = [
  { label: "ยอดเข้าถึงรวม", value: "1.28M", delta: "+18% จากเดือนก่อน" },
  { label: "ข้อความลูกค้า", value: "842", delta: "+12% จากสัปดาห์ก่อน" },
  { label: "โพสต์ที่เผยแพร่", value: "126", delta: "เฉลี่ย 4 โพสต์/วัน" },
  { label: "ยอดคลิกสั่งซื้อ", value: "3,486", delta: "+9.4% จากแคมเปญล่าสุด" },
];

export const featureCards = [
  {
    title: "จัดการหลายช่องทางในที่เดียว",
    description: "ดูคอนเทนต์ ตารางโพสต์ และผลลัพธ์รวมแบบไม่ต้องสลับหลายระบบ",
  },
  {
    title: "เข้าใจง่ายสำหรับทีมขายและเจ้าของธุรกิจ",
    description: "ใช้ถ้อยคำชัดเจน อ่านตัวเลขง่าย รู้ทันทีว่าอะไรเวิร์กและอะไรควรปรับ",
  },
  {
    title: "โชว์ลูกค้าได้เหมือนระบบจริง",
    description: "มีหน้าตาและ flow ใกล้เคียง SaaS จริง เหมาะกับใช้พรีเซนต์หรือทดลองขาย",
  },
];

export const plans = [
  {
    name: "Starter",
    price: "฿1,490",
    highlight: false,
    description: "เหมาะกับร้านค้าที่เริ่มทำคอนเทนต์สม่ำเสมอ",
    items: ["1 แบรนด์", "Dashboard ภาพรวม", "Analytics พื้นฐาน", "Calendar วางแผนโพสต์"],
  },
  {
    name: "Growth",
    price: "฿2,990",
    highlight: true,
    description: "เหมาะกับธุรกิจที่ต้องการวัดผลจริงและทำงานเป็นทีม",
    items: ["3 แบรนด์", "Analytics แบบเจาะลึก", "Inbox รวมข้อความ", "รายงานพร้อมประชุม"],
  },
  {
    name: "Agency",
    price: "฿6,900",
    highlight: false,
    description: "เหมาะกับเอเจนซีหรือทีมที่ดูแลหลายลูกค้า",
    items: ["ไม่จำกัดแบรนด์", "หลาย workspace", "สิทธิ์ผู้ใช้หลายคน", "Report สำหรับลูกค้า"],
  },
];

export const onboarding = [
  "เชื่อมช่องทางที่ต้องการติดตาม",
  "ตั้งปฏิทินคอนเทนต์รายสัปดาห์",
  "เลือกชุดรายงานที่ต้องการโชว์ลูกค้า",
  "เริ่มดูผลลัพธ์และปรับแผนจากข้อมูลจริง",
];

export const activities = [
  { title: "โพสต์โปรโมชันสิ้นเดือนขึ้น Facebook และ Instagram", time: "10 นาทีที่แล้ว", status: "success" },
  { title: "ทีมขายเปิดดูรายงานแคมเปญ Live สด", time: "35 นาทีที่แล้ว", status: "info" },
  { title: "พบเวลาลงโพสต์ที่ได้ Reach สูงสุดใหม่", time: "1 ชั่วโมงที่แล้ว", status: "warning" },
];

export const analyticsBars = [4200, 5100, 4800, 6200, 7100, 6900, 7300, 7800, 8100, 7600, 8400, 8900, 9200, 9700];
export const reachSeries = [3100, 3600, 3400, 4200, 4700, 4550, 5000, 5340, 5520, 5400, 5880, 6240, 6480, 6930];
export const engagementSeries = [3.1, 3.4, 3.2, 4.1, 4.6, 4.2, 4.8, 5.1, 5.4, 5.2, 5.7, 6.1, 6.4, 6.8];

export const platformRows = [
  { name: "Facebook", posts: 32, reach: "428K", engagement: "5.8%", color: "#1877F2" },
  { name: "Instagram", posts: 27, reach: "366K", engagement: "6.4%", color: "#E4405F" },
  { name: "TikTok", posts: 18, reach: "301K", engagement: "7.1%", color: "#111111" },
  { name: "LINE OA", posts: 21, reach: "188K", engagement: "4.9%", color: "#00B900" },
];

export const topPosts = [
  { title: "โปรแรงกลางเดือน ซื้อ 1 แถม 1", reach: "92K", action: "ยอดคลิกสูงสุด" },
  { title: "คลิปรีวิวลูกค้าความยาว 30 วินาที", reach: "84K", action: "คอมเมนต์สูงสุด" },
  { title: "โพสต์ชุดภาพก่อน-หลังใช้สินค้า", reach: "76K", action: "บันทึกสูงสุด" },
];

export const composerIdeas = ["โปรโมชันสิ้นเดือน", "คอนเทนต์ให้ความรู้", "รีวิวจากลูกค้า", "โพสต์ชวนทักแชต"];

export const previewTabs = ["facebook", "instagram", "line", "tiktok"] as const;

export const calendarDays = [
  { day: "จ", date: 1, items: 2 },
  { day: "อ", date: 2, items: 1 },
  { day: "พ", date: 3, items: 3 },
  { day: "พฤ", date: 4, items: 2 },
  { day: "ศ", date: 5, items: 4 },
  { day: "ส", date: 6, items: 1 },
  { day: "อา", date: 7, items: 2 },
  { day: "จ", date: 8, items: 3 },
  { day: "อ", date: 9, items: 2 },
  { day: "พ", date: 10, items: 4 },
  { day: "พฤ", date: 11, items: 1 },
  { day: "ศ", date: 12, items: 3 },
  { day: "ส", date: 13, items: 2 },
  { day: "อา", date: 14, items: 1 },
];

export const inboxMessages = [
  { from: "คุณเมย์", channel: "Facebook", message: "โปรนี้ใช้ได้ถึงวันไหนคะ", tag: "ลูกค้าใหม่" },
  { from: "K. Boss", channel: "LINE OA", message: "ขอใบเสนอราคาแพ็กเกจ Growth", tag: "มีโอกาสปิดการขาย" },
  { from: "คุณอ้อม", channel: "Instagram", message: "ถ้าสั่งวันนี้ส่งพรุ่งนี้ไหม", tag: "รอตอบ" },
];

export const reportSections = [
  { title: "สรุปผู้บริหาร", value: "ยอดเข้าถึงโตต่อเนื่อง 18%" },
  { title: "แคมเปญเด่น", value: "Live Campaign ปิดยอดคลิกสูงสุดในเดือนนี้" },
  { title: "ข้อเสนอแนะ", value: "เพิ่มงบ TikTok และลงโพสต์ช่วง 19:00-20:00" },
];
