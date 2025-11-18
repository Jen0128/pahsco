// 模擬數據 - 擴充版

// [新增] 詳細醫材數據結構 (只包含有特殊醫材的床位)
const detailedMaterialsAndStats = [
  // 301床: 張大明 (原張大明，但使用詳細醫材數據)
  { 
    room: '301', 
    tasks: 3,
    alert: false,
    materials: [
      { 
        id: 1, name: '密閉式抽痰管', icon: '🫁', day: 2, status: 'normal', note: '下次更換：明日08:00',
        timeline: [ { time: '14:00', type: 'record', content: '抽痰操作', detail: '痰液：白色黏稠', executor: '王小明' }, ]
      },
      { 
        id: 2, name: '鼻胃管 16Fr', icon: '💧', day: 15, status: 'warning', note: '已使用15天，建議評估更換',
        timeline: [ { time: '12:00', type: 'record', content: '灌食300ml', detail: '灌食順暢', executor: '王小明' }, ]
      },
      { 
        id: 5, name: '左手靜脈留置針 20G', icon: '💉', day: 2, status: 'normal', note: '注射部位無紅腫',
        timeline: [ { time: '14:00', type: 'check', content: '檢查注射部位', detail: '無紅腫、無滲液', executor: '王小明' }, ]
      }
    ],
    stats: { suction: { count: 2, note: '密閉式抽痰管使用2次' }, feeding: { count: 1, total: 300, note: '鼻胃管灌食1次（累積300ml）' } }
  },
  
  // 303床: 王建國 (原王建國，肺炎，有胸腔引流)
  { 
    room: '303', 
    tasks: 4, 
    alert: true,
    materials: [
      { 
        id: 3, name: '胸腔引流瓶-左側', icon: '🏺', day: 3, status: 'alert', note: '今日引流量150ml/hr，異常增加', detail: '已通知醫師，Q1H監測',
        timeline: [ { time: '15:00', type: 'alert', content: '引流液轉為血性，量增多', detail: '引流量：150ml（過去1小時）\n已通知醫師', executor: '王小明', hasPhoto: true }, ]
      },
      { 
        id: 4, name: '精密尿袋 2000ml', icon: '💧', day: 3, status: 'normal', note: '今日尿量2100ml，尿色清澈', detail: '上次記錄：14:00 (300ml)',
        timeline: [ { time: '14:00', type: 'record', content: '記錄尿量', detail: '尿量：300ml\n尿色：清澈淡黃', executor: '王小明' }, ]
      },
    ],
    stats: { drainage: { count: 1, total: 450, note: '胸腔引流瓶更換1次（引流累積450ml）' }, urine: { count: 7, total: 2100, note: '精密尿袋記錄7次（累積2100ml）' } }
  },

  // 305床: 李美華 (原李美華，高血壓、心臟病，有傷口敷料)
  { 
    room: '305', 
    tasks: 3, 
    alert: true,
    materials: [
      { 
        id: 2, name: '傷口敷料', icon: '🩹', day: 1, status: 'normal', note: '明日需更換',
        timeline: [ { time: '08:00', type: 'change', content: '更換傷口敷料', detail: '傷口5x3cm，有肉芽組織生長', executor: '王小明', hasPhoto: true } ]
      },
      { 
        id: 1, name: '左手靜脈留置針 20G', icon: '💉', day: 2, status: 'normal', note: '注射部位無紅腫',
        timeline: [ { time: '14:00', type: 'check', content: '檢查注射部位', detail: '無紅腫、無滲液', executor: '王小明' }, ]
      }
    ],
    stats: { dressing: { count: 1, note: '傷口敷料更換1次' }, catheter: { count: 1, note: '點滴部位檢查1次' } }
  },
  
  // 308床: 吳建華 (原吳建華，癌症化療，有抽痰管)
  { 
    room: '308', 
    tasks: 3, 
    alert: true,
    materials: [
      { 
        id: 1, name: '密閉式抽痰管', icon: '🫁', day: 2, status: 'warning', note: '將於22:00到期需更換',
        timeline: [
          { time: '14:00', type: 'record', content: '抽痰操作', detail: '痰液：白色黏稠', executor: '王小明' },
        ]
      },
      { 
        id: 2, name: '鼻胃管 16Fr', icon: '💧', day: 7, status: 'normal', note: '使用正常',
        timeline: [
          { time: '12:00', type: 'record', content: '灌食300ml', detail: '灌食順暢', executor: '王小明' },
        ]
      }
    ],
    stats: { suction: { count: 2, note: '密閉式抽痰管使用2次' }, feeding: { count: 2, total: 550, note: '鼻胃管灌食2次（累積550ml）' } }
  }
];

// 基礎病患資料 (所有 301-308 床位)
const basePatients = [
  { id: 'P301', room: '301', name: '張大明', age: 72, gender: '男', diagnosis: '糖尿病、高血壓', tasks: 3, alert: false, admissionDate: '2025/11/01', diet: '糖尿病飲食', isolation: false },
  { id: 'P302', room: '302', name: '林秀英', age: 65, gender: '女', diagnosis: '骨折術後', tasks: 2, alert: false, admissionDate: '2025/11/03', diet: '一般飲食', isolation: false },
  { id: 'P303', room: '303', name: '王建國', age: 80, gender: '男', diagnosis: '肺炎', tasks: 4, alert: true, admissionDate: '2025/10/28', diet: '軟質飲食', isolation: true },
  { id: 'P304', room: '304', name: '黃小玉', age: 58, gender: '女', diagnosis: '中風復健', tasks: 3, alert: false, admissionDate: '2025/10/25', diet: '一般飲食', isolation: false },
  { id: 'P305', room: '305', name: '李美華', age: 68, gender: '女', diagnosis: '高血壓、心臟病', tasks: 3, alert: true, admissionDate: '2025/11/02', diet: '低鹽飲食', isolation: false },
  { id: 'P306', room: '306', name: '陳志明', age: 75, gender: '男', diagnosis: '糖尿病足', tasks: 2, alert: false, admissionDate: '2025/10/30', diet: '糖尿病飲食', isolation: false },
  { id: 'P307', room: '307', name: '劉婉如', age: 62, gender: '女', diagnosis: '腎臟病', tasks: 2, alert: false, admissionDate: '2025/11/04', diet: '低蛋白飲食', isolation: false },
  { id: 'P308', room: '308', name: '吳建華', age: 70, gender: '男', diagnosis: '癌症化療', tasks: 3, alert: true, admissionDate: '2025/10/29', diet: '高蛋白飲食', isolation: false },
];

// 將詳細數據合併回 basePatients
const detailedPatientsData = basePatients.map(patient => {
  const detailed = detailedMaterialsAndStats.find(d => d.room === patient.room);
  
  // 為沒有詳細數據的病人生成合理的默認值
  const defaultMaterials = [{ 
    id: 99, 
    name: '點滴 IV G22', 
    icon: '💉',
    day: patient.alert ? 3 : 1, 
    status: patient.alert ? 'alert' : 'normal', 
    note: patient.alert ? '請密切注意生命徵象' : '點滴部位無紅腫',
    timeline: [{ time: '15:00', type: 'check', content: '檢查點滴', detail: '流速正常', executor: '陳護理師' }]
  }];
  
  const defaultStats = { care: { count: 1, note: '生命徵象紀錄1次' } };
  
  return {
    ...patient,
    bed: patient.room, // 為了相容 PatientsPage.js 的 bed 屬性
    patient: patient.name,
    gender: patient.gender,
    age: patient.age,
    diagnosis: patient.diagnosis,
    alert: patient.alert,
    tasks: patient.tasks,
    materials: detailed ? detailed.materials : defaultMaterials,
    stats: detailed ? detailed.stats : defaultStats,
  };
});


export const mockData = {
  nurse: {
    id: 'N001',
    name: '陳護理師',
    shift: 'morning',
    ward: '3樓西側',
    rooms: ['301', '302', '303', '304', '305', '306', '307', '308']
  },
  
  // [修改] 將原 patients 替換為新的詳細數據
  patients: detailedPatientsData, 
  
  // 擴充任務資料 (保持原樣)
  tasks: [
    { 
      id: 'T001', 
      time: '07:00-09:00', 
      title: '晨間護理', 
      items: [
        { id: 'T001-1', type: 'care', room: '301', patient: '張大明', task: '測量生命徵象', time: '07:15', status: 'completed', notes: 'BP: 135/85, HR: 78' },
        { id: 'T001-2', type: 'care', room: '302', patient: '林秀英', task: '測量生命徵象', time: '07:20', status: 'completed', notes: 'BP: 128/82, HR: 72' },
        { id: 'T001-3', type: 'care', room: '303', patient: '王建國', task: '測量生命徵象與體溫', time: '07:25', status: 'completed', notes: 'BP: 142/88, HR: 85, T: 37.8°C' },
        { id: 'T001-4', type: 'care', room: '304', patient: '黃小玉', task: '協助盥洗', time: '07:30', status: 'completed', notes: '已完成' },
        { id: 'T001-5', type: 'medication', room: '305', patient: '李美華', task: '更換點滴', time: '08:30', status: 'inProgress', notes: '抗生素點滴' },
        { id: 'T001-6', type: 'care', room: '306', patient: '陳志明', task: '傷口換藥', time: '08:45', status: 'pending', notes: '右足傷口' },
        { id: 'T001-7', type: 'care', room: '307', patient: '劉婉如', task: '測量生命徵象', time: '07:35', status: 'completed', notes: 'BP: 132/80, HR: 70' },
        { id: 'T001-8', type: 'care', room: '308', patient: '吳建華', task: '協助翻身', time: '08:00', status: 'completed', notes: '左側臥位' },
      ]
    },
    { 
      id: 'T002', 
      time: '10:00-12:00', 
      title: '治療時段', 
      items: [
        { id: 'T002-1', type: 'medication', room: '301', patient: '張大明', task: '口服藥（降血糖）', time: '10:00', status: 'pending', notes: 'Metformin 500mg' },
        { id: 'T002-2', type: 'care', room: '303', patient: '王建國', task: '抽血檢查', time: '10:30', status: 'pending', notes: 'CBC, CRP' },
        { id: 'T002-3', type: 'care', room: '304', patient: '黃小玉', task: '復健陪同', time: '10:45', status: 'pending', notes: '物理治療室' },
        { id: 'T002-4', type: 'care', room: '305', patient: '李美華', task: '心電圖檢查', time: '11:00', status: 'pending', notes: '定期追蹤' },
        { id: 'T002-5', type: 'medication', room: '306', patient: '陳志明', task: '注射胰島素', time: '11:30', status: 'pending', notes: 'Regular 8U' },
        { id: 'T002-6', type: 'care', room: '308', patient: '吳建華', task: '化療副作用評估', time: '11:15', status: 'pending', notes: '噁心嘔吐程度' },
      ]
    },
    { 
      id: 'T003', 
      time: '13:00-15:00', 
      title: '下午照護', 
      items: [
        { id: 'T003-1', type: 'care', room: '301', patient: '張大明', task: '血糖測量', time: '13:00', status: 'pending', notes: '午餐後2小時' },
        { id: 'T003-2', type: 'care', room: '303', patient: '王建國', task: '協助翻身拍背', time: '13:30', status: 'pending', notes: '預防褥瘡' },
        { id: 'T003-3', type: 'medication', room: '305', patient: '李美華', task: '口服藥（降血壓）', time: '14:00', status: 'pending', notes: 'Amlodipine 5mg' },
        { id: 'T003-4', type: 'care', room: '306', patient: '陳志明', task: '傷口觀察記錄', time: '14:15', status: 'pending', notes: '記錄傷口狀況' },
        { id: 'T003-5', type: 'care', room: '307', patient: '劉婉如', task: '量測尿量', time: '14:00', status: 'pending', notes: '每日記錄' },
        { id: 'T003-6', type: 'document', room: 'all', patient: '全病患', task: '護理記錄完成', time: '14:30前', status: 'pending', notes: '交班準備' },
        { id: 'T003-7', type: 'document', room: 'all', patient: '全病患', task: '準備小夜班交班事項', time: '14:45', status: 'pending', notes: '交班單整理' },
      ]
    }
  ],
  
  // 擴充警報資料 (保持原樣)
  alerts: [
    { id: 'A001', type: 'urgent', room: '305', patient: '李美華', message: '抗生素點滴即將打完（剩15分鐘）', time: '14:30', priority: 'high' },
    { id: 'A002', type: 'urgent', room: '303', patient: '王建國', message: '下次翻身時間已到', time: '14:45', priority: 'high' },
  ],
  
  // 大幅擴充物料資料 (保持原樣)
  supplies: [
    { id: 'S001', name: '5ml注射器', brand: '太平洋醫材', category: 'injection', stock: 14, safetyStock: 20, unit: '支', status: 'low', weeklyUsage: 28, expiryDate: '2026/12/01' },
    { id: 'S002', name: '10ml注射器', brand: '太平洋醫材', category: 'injection', stock: 85, safetyStock: 30, unit: '支', status: 'normal', weeklyUsage: 15, expiryDate: '2026/10/15' },
    { id: 'S003', name: '20ml注射器', brand: '太平洋醫材', category: 'injection', stock: 45, safetyStock: 25, unit: '支', status: 'normal', weeklyUsage: 12, expiryDate: '2026/11/20' },
    { id: 'S004', name: '1ml胰島素注射器', brand: '太平洋醫材', category: 'injection', stock: 18, safetyStock: 20, unit: '支', status: 'low', weeklyUsage: 21, expiryDate: '2026/09/30' },
    { id: 'S005', name: '親水性敷料 10x10cm', brand: '太平洋醫材', category: 'wound', stock: 8, safetyStock: 15, unit: '片', status: 'low', weeklyUsage: 12, expiryDate: '2026/06/15' },
    { id: 'S006', name: '泡棉敷料 15x15cm', brand: '太平洋醫材', category: 'wound', stock: 35, safetyStock: 10, unit: '片', status: 'normal', weeklyUsage: 8, expiryDate: '2026/08/20' },
    { id: 'S007', name: '透明敷料 10x12cm', brand: '太平洋醫材', category: 'wound', stock: 22, safetyStock: 15, unit: '片', status: 'normal', weeklyUsage: 10, expiryDate: '2026/07/10' },
    { id: 'S008', name: '紗布 4x4', brand: '太平洋醫材', category: 'wound', stock: 150, safetyStock: 100, unit: '片', status: 'normal', weeklyUsage: 80, expiryDate: '2027/01/15' },
    { id: 'S009', name: '彈性繃帶 3吋', brand: '太平洋醫材', category: 'wound', stock: 12, safetyStock: 10, unit: '卷', status: 'normal', weeklyUsage: 5, expiryDate: '2026/12/30' },
    { id: 'S010', name: '採血管-紫頭', brand: '太平洋醫材', category: 'lab', stock: 18, safetyStock: 20, unit: '支', status: 'low', weeklyUsage: 15, expiryDate: '2026/05/10' },
    { id: 'S011', name: '採血管-紅頭', brand: '太平洋醫材', category: 'lab', stock: 25, safetyStock: 20, unit: '支', status: 'normal', weeklyUsage: 12, expiryDate: '2026/04/20' },
    { id: 'S012', name: '採血針 21G', brand: '太平洋醫材', category: 'lab', stock: 32, safetyStock: 25, unit: '支', status: 'normal', weeklyUsage: 18, expiryDate: '2026/08/15' },
    { id: 'S013', name: '尿液收集杯', brand: '太平洋醫材', category: 'lab', stock: 40, safetyStock: 30, unit: '個', status: 'normal', weeklyUsage: 20, expiryDate: '2027/02/01' },
    { id: 'S014', name: '生理食鹽水 500ml', brand: '台灣生技', category: 'medication', stock: 15, safetyStock: 10, unit: '瓶', status: 'expiring', weeklyUsage: 8, expiryDate: '2025/12/20' },
    { id: 'S015', name: '生理食鹽水 1000ml', brand: '台灣生技', category: 'medication', stock: 28, safetyStock: 20, unit: '瓶', status: 'normal', weeklyUsage: 15, expiryDate: '2026/03/15' },
    { id: 'S016', name: '葡萄糖液 5% 500ml', brand: '台灣生技', category: 'medication', stock: 22, safetyStock: 15, unit: '瓶', status: 'normal', weeklyUsage: 12, expiryDate: '2026/02/28' },
    { id: 'S017', name: '酒精棉片', brand: '潔康', category: 'medication', stock: 8, safetyStock: 15, unit: '盒', status: 'low', weeklyUsage: 10, expiryDate: '2026/10/10' },
    { id: 'S018', name: '優碘棉棒', brand: '潔康', category: 'medication', stock: 12, safetyStock: 10, unit: '盒', status: 'normal', weeklyUsage: 8, expiryDate: '2026/09/20' },
    { id: 'S019', name: '靜脈留置針 20G', brand: '美康', category: 'catheter', stock: 9, safetyStock: 15, unit: '支', status: 'low', weeklyUsage: 10, expiryDate: '2026/11/25' },
    { id: 'S020', name: '靜脈留置針 22G', brand: '美康', category: 'catheter', stock: 18, safetyStock: 15, unit: '支', status: 'normal', weeklyUsage: 12, expiryDate: '2026/10/30' },
    { id: 'S021', name: '鼻胃管 14Fr', brand: '美康', category: 'catheter', stock: 6, safetyStock: 8, unit: '支', status: 'low', weeklyUsage: 4, expiryDate: '2026/12/15' },
    { id: 'S022', name: '導尿管 16Fr', brand: '美康', category: 'catheter', stock: 10, safetyStock: 8, unit: '支', status: 'normal', weeklyUsage: 5, expiryDate: '2026/11/10' },
    { id: 'S023', name: '外科口罩', brand: '潔康', category: 'protective', stock: 250, safetyStock: 200, unit: '個', status: 'normal', weeklyUsage: 150, expiryDate: '2026/06/30' },
    { id: 'S024', name: 'N95口罩', brand: '潔康', category: 'protective', stock: 45, safetyStock: 40, unit: '個', status: 'normal', weeklyUsage: 25, expiryDate: '2026/08/15' },
    { id: 'S025', name: '檢診手套 M', brand: '潔康', category: 'protective', stock: 180, safetyStock: 150, unit: '雙', status: 'normal', weeklyUsage: 120, expiryDate: '2026/09/30' },
    { id: 'S026', name: '檢診手套 L', brand: '潔康', category: 'protective', stock: 95, safetyStock: 100, unit: '雙', status: 'low', weeklyUsage: 80, expiryDate: '2026/09/30' },
    { id: 'S027', name: '隔離衣', brand: '潔康', category: 'protective', stock: 35, safetyStock: 30, unit: '件', status: 'normal', weeklyUsage: 20, expiryDate: '2026/12/31' },
    { id: 'S028', name: '體溫計套', brand: '一般', category: 'other', stock: 200, safetyStock: 150, unit: '個', status: 'normal', weeklyUsage: 100, expiryDate: '2027/03/01' },
    { id: 'S029', name: '血壓計袖帶-成人', brand: '歐姆龍', category: 'other', stock: 5, safetyStock: 3, unit: '個', status: 'normal', weeklyUsage: 1, expiryDate: '2028/01/01' },
    { id: 'S030', name: '尿布-成人 L', brand: '安安', category: 'other', stock: 25, safetyStock: 30, unit: '片', status: 'low', weeklyUsage: 35, expiryDate: '2026/11/30' },
    { id: 'S031', name: '濕紙巾', brand: '一般', category: 'other', stock: 18, safetyStock: 15, unit: '包', status: 'normal', weeklyUsage: 10, expiryDate: '2026/10/20' },
    { id: 'S032', name: '點滴架', brand: '醫療設備', category: 'other', stock: 8, safetyStock: 5, unit: '支', status: 'normal', weeklyUsage: 2, expiryDate: '2030/01/01' },
  ],
  
  // 擴充交班記錄 (保持原樣)
  handover: [
    { id: 'H001', type: 'critical', room: '305', patient: '李美華', note: '血壓持續偏高 150/95，已聯繫醫師調整藥物，小夜班需每2小時測量', recorder: '陳護理師', time: '14:30', confirmed: true },
    { id: 'H002', type: 'critical', room: '303', patient: '王建國', note: '體溫38.2°C，已給予退燒藥，需持續監測體溫變化', recorder: '陳護理師', time: '14:45', confirmed: false },
    { id: 'H003', type: 'normal', room: '301', patient: '張大明', note: '傷口換藥完成，傷口癒合良好', recorder: '陳護理師', time: '14:20', confirmed: true },
    { id: 'H004', type: 'critical', room: '308', patient: '吳建華', note: '化療後出現輕微噁心，已給予止吐藥，需觀察食慾狀況', recorder: '陳護理師', time: '13:45', confirmed: true },
    { id: 'H005', type: 'normal', room: '304', patient: '黃小玉', note: '今日復健進度良好，可自行翻身，繼續鼓勵活動', recorder: '陳護理師', time: '14:15', confirmed: true },
    { id: 'H006', type: 'warning', room: '306', patient: '陳志明', note: '右足傷口有輕微滲液，已更換敷料，請小夜班密切觀察', recorder: '陳護理師', time: '14:00', confirmed: false },
    { id: 'H007', type: 'normal', room: '302', patient: '林秀英', note: '疼痛指數2分，活動良好，預計明日可出院', recorder: '陳護理師', time: '13:30', confirmed: true },
    { id: 'H008', type: 'warning', room: '307', patient: '劉婉如', note: '尿量偏少 800ml/24hr，已通知醫師，注意輸出入量平衡', recorder: '陳護理師', time: '14:10', confirmed: false },
    { id: 'H009', type: 'normal', room: '305', patient: '李美華', note: '抗生素療程第3天，點滴注射部位無紅腫', recorder: '陳護理師', time: '12:00', confirmed: true },
    { id: 'H010', type: 'critical', room: '303', patient: '王建國', note: '氧氣濃度需維持3L/min，SpO2監測維持在95%以上', recorder: '陳護理師', time: '11:30', confirmed: true },
  ],
  
  // 新增：藥物清單 (保持原樣)
  medications: [
    { id: 'M001', patient: 'P301', patientName: '張大明', room: '301', drugName: 'Metformin 500mg', dosage: '1tab', frequency: 'TID AC', route: 'PO', time: ['08:00', '12:00', '18:00'], status: 'active' },
    { id: 'M002', patient: 'P301', patientName: '張大明', room: '301', drugName: 'Amlodipine 5mg', dosage: '1tab', frequency: 'QD', route: 'PO', time: ['08:00'], status: 'active' },
    { id: 'M003', patient: 'P305', patientName: '李美華', room: '305', drugName: 'Ceftriaxone 1g', dosage: '1vial', frequency: 'Q12H', route: 'IV', time: ['08:00', '20:00'], status: 'active' },
    { id: 'M004', patient: 'P305', patientName: '李美華', room: '305', drugName: 'Furosemide 40mg', dosage: '1tab', frequency: 'QD', route: 'PO', time: ['08:00'], status: 'active' },
    { id: 'M005', patient: 'P303', patientName: '王建國', room: '303', drugName: 'Amoxicillin 500mg', dosage: '1cap', frequency: 'TID', route: 'PO', time: ['08:00', '14:00', '20:00'], status: 'active' },
    { id: 'M006', patient: 'P308', patientName: '吳建華', room: '308', drugName: 'Ondansetron 8mg', dosage: '1tab', frequency: 'PRN', route: 'PO', time: ['PRN'], status: 'active' },
    { id: 'M007', patient: 'P306', patientName: '陳志明', room: '306', drugName: 'Regular Insulin', dosage: '8U', frequency: 'AC+HS', route: 'SC', time: ['07:30', '11:30', '17:30', '21:00'], status: 'active' },
    { id: 'M008', patient: 'P304', patientName: '黃小玉', room: '304', drugName: 'Aspirin 100mg', dosage: '1tab', frequency: 'QD', route: 'PO', time: ['08:00'], status: 'active' },
  ],
  
  // 新增：檢驗檢查紀錄 (保持原樣)
  labReports: [
    { id: 'L001', patient: 'P303', patientName: '王建國', room: '303', testName: 'CBC', date: '2025/11/08', time: '10:30', status: 'pending', orderBy: '張醫師' },
    { id: 'L002', patient: 'P303', patientName: '王建國', room: '303', testName: 'CRP', date: '2025/11/08', time: '10:30', status: 'pending', orderBy: '張醫師' },
    { id: 'L003', patient: 'P301', patientName: '張大明', room: '301', testName: '血糖AC', date: '2025/11/08', time: '07:00', result: '126 mg/dL', status: 'completed', orderBy: '陳醫師' },
    { id: 'L004', patient: 'P305', patientName: '李美華', room: '305', testName: 'EKG', date: '2025/11/08', time: '11:00', status: 'scheduled', orderBy: '王醫師' },
    { id: 'L005', patient: 'P307', patientName: '劉婉如', room: '307', testName: 'Cr', date: '2025/11/07', time: '08:00', result: '1.8 mg/dL', status: 'completed', orderBy: '李醫師' },
    { id: 'L006', patient: 'P308', patientName: '吳建華', room: '308', testName: 'CBC', date: '2025/11/07', time: '08:00', result: 'WBC 3.2k', status: 'completed', orderBy: '張醫師' },
  ]
};

// 工具函數
export const getShiftText = (shift) => {
  const shifts = {
    morning: '早班 07:00-15:00',
    evening: '小夜 15:00-23:00',
    night: '大夜 23:00-07:00'
  };
  return shifts[shift] || '早班 07:00-15:00';
};

export const getTaskStatusText = (status) => {
  const statusMap = {
    pending: '待執行',
    inProgress: '執行中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || '未知';
};

export const getTaskTypeText = (type) => {
  const typeMap = {
    care: '照護',
    medication: '給藥',
    document: '文書',
    assessment: '評估',
    procedure: '處置'
  };
  return typeMap[type] || '其他';
};

export const getAlertPriorityColor = (priority) => {
  const colorMap = {
    high: '#dc2626',
    medium: '#f59e0b',
    low: '#3b82f6'
  };
  return colorMap[priority] || '#6b7280';
};

export const getSupplyStatusText = (status) => {
  const statusMap = {
    low: '庫存不足',
    normal: '正常',
    expiring: '即將到期'
  };
  return statusMap[status] || '未知';
};

// 統計函數
export const getStatistics = () => {
  return {
    totalPatients: mockData.patients.length,
    totalTasks: mockData.tasks.reduce((sum, taskGroup) => sum + taskGroup.items.length, 0),
    pendingTasks: mockData.tasks.reduce((sum, taskGroup) => 
      sum + taskGroup.items.filter(item => item.status === 'pending').length, 0),
    completedTasks: mockData.tasks.reduce((sum, taskGroup) => 
      sum + taskGroup.items.filter(item => item.status === 'completed').length, 0),
    urgentAlerts: mockData.alerts.filter(alert => alert.type === 'urgent').length,
    lowStockItems: mockData.supplies.filter(supply => supply.status === 'low').length,
    expiringItems: mockData.supplies.filter(supply => supply.status === 'expiring').length,
    criticalHandovers: mockData.handover.filter(item => item.type === 'critical').length,
  };
};