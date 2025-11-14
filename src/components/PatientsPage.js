import React, { useState } from 'react';
import { Home, Package, Users, Bed, BookOpen, Bell, Search, Camera, Plus, Check, AlertCircle, TrendingUp, Clock, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';

const PacificNursingSystem = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // 模擬數據
  const urgentTasks = [
    { id: 1, bed: '301', patient: '王先生', type: 'alert', message: '胸腔引流量突增150ml/hr', time: '10分鐘前', priority: 'high' },
    { id: 2, bed: '205', patient: '李太太', type: 'warning', message: '2小時無尿，導尿管可能阻塞', time: '30分鐘前', priority: 'high' },
    { id: 3, bed: '410', patient: '陳先生', type: 'info', message: '密閉式抽痰管使用已達48hr', time: '1小時前', priority: 'medium' }
  ];

  const todayTasks = [
    { id: 1, time: '09:00', bed: '301', task: '更換胸腔引流瓶', type: 'care', done: true },
    { id: 2, time: '10:00', bed: '205', task: '記錄尿量', type: 'record', done: false },
    { id: 3, time: '11:00', bed: '410', task: '更換密閉式抽痰管', type: 'change', done: false },
    { id: 4, time: '14:00', bed: '302', task: '拔除引流管（符合條件）', type: 'procedure', done: false }
  ];

  const materials = [
    { category: '管類', stock: 89, total: 120, status: 'normal', icon: '📦' },
    { category: '袋類', stock: 156, total: 200, status: 'normal', icon: '💧' },
    { category: '瓶類', stock: 8, total: 30, status: 'low', icon: '🏺' },
    { category: '引流類', stock: 45, total: 60, status: 'normal', icon: '💉' },
    { category: '麻醉類', stock: 78, total: 50, status: 'high', icon: '🫁' },
    { category: '手術類', stock: 234, total: 300, status: 'normal', icon: '🩺' },
    { category: '其他類', stock: 567, total: 800, status: 'normal', icon: '📋' }
  ];

  const myBeds = [
    { 
      bed: '301', 
      patient: '王先生',
      gender: '男',
      age: 65, 
      diagnosis: '胸腔手術術後D3',
      alert: true,
      tasks: 2,
      materials: [
        { 
          id: 1,
          name: '密閉式抽痰管', 
          icon: '🫁',
          day: 2, 
          status: 'normal', 
          note: '下次更換：明日08:00',
          timeline: [
            { time: '14:00', type: 'record', content: '抽痰操作', detail: '痰液：白色黏稠', executor: '王小明' },
            { time: '10:00', type: 'record', content: '抽痰操作', detail: '痰液：白色', executor: '王小明' },
            { time: '08:00', type: 'change', content: '更換抽痰管', detail: '舊管使用48小時', executor: '王小明' }
          ]
        },
        { 
          id: 2,
          name: '鼻胃管 16Fr', 
          icon: '💧',
          day: 15, 
          status: 'warning', 
          note: '已使用15天，建議評估更換',
          timeline: [
            { time: '12:00', type: 'record', content: '灌食300ml', detail: '灌食順暢', executor: '王小明' },
            { time: '08:00', type: 'record', content: '灌食250ml', detail: '灌食順暢', executor: '王小明' }
          ]
        },
        { 
          id: 3,
          name: '胸腔引流瓶-左側', 
          icon: '🏺',
          day: 3, 
          status: 'alert', 
          note: '今日引流量150ml/hr，異常增加',
          detail: '已通知醫師，Q1H監測',
          timeline: [
            { time: '15:00', type: 'alert', content: '引流液轉為血性，量增多', detail: '引流量：150ml（過去1小時）\n已通知醫師', executor: '王小明', hasPhoto: true },
            { time: '14:00', type: 'record', content: '記錄引流量', detail: '引流量：80ml（過去1小時）\n引流液：淡血性', executor: '王小明' },
            { time: '12:00', type: 'change', content: '更換引流瓶（滿瓶）', detail: '舊瓶累積引流量：450ml', executor: '王小明', hasPhoto: true },
            { time: '08:00', type: 'record', content: '記錄引流量', detail: '引流量：50ml（過去2小時）\n引流液：淡血性', executor: '王小明' }
          ]
        },
        { 
          id: 4,
          name: '精密尿袋 2000ml', 
          icon: '💧',
          day: 3, 
          status: 'normal', 
          note: '今日尿量2100ml，尿色清澈',
          detail: '上次記錄：14:00 (300ml)',
          timeline: [
            { time: '14:00', type: 'record', content: '記錄尿量', detail: '尿量：300ml\n尿色：清澈淡黃', executor: '王小明' },
            { time: '12:00', type: 'record', content: '記錄尿量', detail: '尿量：350ml\n尿色：清澈淡黃', executor: '王小明' },
            { time: '10:00', type: 'record', content: '記錄尿量', detail: '尿量：400ml\n尿色：清澈淡黃', executor: '王小明' },
            { time: '08:00', type: 'record', content: '記錄尿量', detail: '尿量：450ml\n尿色：清澈淡黃', executor: '王小明' }
          ]
        },
        { 
          id: 5,
          name: '左手靜脈留置針 20G', 
          icon: '💉',
          day: 2, 
          status: 'normal', 
          note: '注射部位無紅腫',
          timeline: [
            { time: '14:00', type: 'check', content: '檢查注射部位', detail: '無紅腫、無滲液', executor: '王小明' },
            { time: '08:00', type: 'check', content: '檢查注射部位', detail: '無紅腫、無滲液', executor: '王小明' }
          ]
        }
      ],
      stats: {
        suction: { count: 2, note: '密閉式抽痰管使用2次' },
        urine: { count: 7, total: 2100, note: '精密尿袋記錄7次（累積2100ml）' },
        drainage: { count: 1, total: 450, note: '胸腔引流瓶更換1次（引流累積450ml）' }
      }
    },
    { 
      bed: '205', 
      patient: '李太太',
      gender: '女',
      age: 72, 
      diagnosis: '糖尿病足傷口',
      alert: true,
      tasks: 1,
      materials: [
        { 
          id: 1,
          name: '導尿管 14Fr', 
          icon: '💧',
          day: 5, 
          status: 'alert', 
          note: '可能阻塞，需注意尿量',
          timeline: [
            { time: '14:00', type: 'alert', content: '2小時無尿', detail: '懷疑導尿管阻塞\n已通知醫師', executor: '王小明' },
            { time: '12:00', type: 'record', content: '記錄尿量', detail: '尿量：100ml', executor: '王小明' },
            { time: '10:00', type: 'record', content: '記錄尿量', detail: '尿量：150ml', executor: '王小明' }
          ]
        },
        { 
          id: 2,
          name: '傷口敷料', 
          icon: '🩹',
          day: 1, 
          status: 'normal', 
          note: '明日需更換',
          timeline: [
            { time: '08:00', type: 'change', content: '更換傷口敷料', detail: '傷口5x3cm，有肉芽組織生長', executor: '王小明', hasPhoto: true }
          ]
        }
      ],
      stats: {
        catheter: { count: 5, total: 800, note: '導尿管記錄5次（累積800ml）' },
        dressing: { count: 1, note: '傷口敷料更換1次' }
      }
    },
    { 
      bed: '410', 
      patient: '陳先生',
      gender: '男',
      age: 58, 
      diagnosis: '呼吸衰竭',
      alert: false,
      tasks: 1,
      materials: [
        { 
          id: 1,
          name: '密閉式抽痰管', 
          icon: '🫁',
          day: 2, 
          status: 'warning', 
          note: '將於22:00到期需更換',
          timeline: [
            { time: '14:00', type: 'record', content: '抽痰操作', detail: '痰液：白色黏稠', executor: '王小明' },
            { time: '10:00', type: 'record', content: '抽痰操作', detail: '痰液：白色', executor: '王小明' }
          ]
        },
        { 
          id: 2,
          name: '鼻胃管 16Fr', 
          icon: '💧',
          day: 7, 
          status: 'normal', 
          note: '使用正常',
          timeline: [
            { time: '12:00', type: 'record', content: '灌食300ml', detail: '灌食順暢', executor: '王小明' },
            { time: '08:00', type: 'record', content: '灌食250ml', detail: '灌食順暢', executor: '王小明' }
          ]
        }
      ],
      stats: {
        suction: { count: 2, note: '密閉式抽痰管使用2次' },
        feeding: { count: 2, total: 550, note: '鼻胃管灌食2次（累積550ml）' }
      }
    }
  ];
}
// 我的病床 - 侘寂风格版本
const MyBedsPage = () => (
  <div className="main-content">
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">🏥 我的病房</h1>
        <p className="card-subtitle">3樓西側 301-308床</p>
      </div>
      
      <button className="btn btn-primary btn-full">
        📸 拍照記錄
      </button>
    </div>
    
    <div className="space-y-4">
      {myBeds.map((bedData, idx) => (
        <div key={idx} className={`patient-card ${bedData.alert ? 'alert' : ''}`}>
          {/* 病患基本資訊 */}
          <div className="patient-card-header">
            <div>
              <div className="patient-room">
                <span className="patient-room-number">🛏️ {bedData.bed}床</span>
                {bedData.alert && (
                  <span className="patient-alert-badge">
                    🔴 需特別注意
                  </span>
                )}
              </div>
              <div className="patient-name">
                {bedData.patient} ({bedData.gender}/{bedData.age}歲)
              </div>
              <div className="patient-diagnosis">
                <span>診斷：</span>{bedData.diagnosis}
              </div>
            </div>
            {bedData.tasks > 0 ? (
              <span className="patient-tasks-badge">
                ⚠️ {bedData.tasks}項待辦
              </span>
            ) : (
              <div className="patient-status completed">
                ✅ 今日任務已完成
              </div>
            )}
          </div>

          {/* 病患醫材配置 */}
          <div className="expandable-section">
            <button 
              className="expandable-header"
              onClick={() => setSelectedBed(selectedBed === bedData.bed ? null : bedData.bed)}
            >
              <div className="expandable-title-group">
                <span>🧍</span>
                <div>
                  <div className="expandable-title">病患身上的太平洋醫材配置</div>
                  <div className="expandable-subtitle">{bedData.materials.length}項醫材使用中</div>
                </div>
              </div>
              <span>{selectedBed === bedData.bed ? '▲' : '▼'}</span>
            </button>

            {selectedBed === bedData.bed && (
              <div className="expandable-content">
                {bedData.materials.map((mat, matIdx) => (
                  <div key={matIdx} className="task-item">
                    <div className="task-item-info">
                      <div className="task-item-header">
                        <span style={{ fontSize: '1.5rem' }}>{mat.icon}</span>
                        <span className="task-name">{mat.name}</span>
                        <span className={`status-badge ${mat.status === 'alert' ? 'pending' : mat.status === 'warning' ? 'in-progress' : 'completed'}`}>
                          {mat.status === 'alert' ? '🔴 警示' :
                           mat.status === 'warning' ? '🟡 注意' : '🟢 正常'}
                        </span>
                      </div>
                      <div className="task-details">
                        使用天數：D{mat.day} | {mat.note}
                      </div>
                      {mat.detail && (
                        <div className="task-details" style={{ marginTop: '0.25rem' }}>
                          {mat.detail}
                        </div>
                      )}
                      
                      {/* 時間軸 */}
                      {selectedMaterial?.bedId === bedData.bed && selectedMaterial?.matId === mat.id && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-sand)' }}>
                          <div style={{ fontWeight: 500, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                            {mat.icon} {mat.name} 使用記錄
                          </div>
                          <div className="space-y-3">
                            {mat.timeline.map((event, eventIdx) => (
                              <div key={eventIdx} className="handover-normal-item">
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--color-earth-dark)' }}>
                                  {event.time}
                                </span>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                                    {event.type === 'alert' ? '⚠️ 警示' :
                                     event.type === 'change' ? '🔄 更換' :
                                     event.type === 'check' ? '✓ 檢查' :
                                     '📊 記錄'} - {event.content}
                                  </div>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                    {event.detail}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                    執行者：{event.executor}
                                    {event.hasPhoto && ' | 📸 有照片'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setSelectedMaterial(
                        selectedMaterial?.bedId === bedData.bed && selectedMaterial?.matId === mat.id 
                          ? null 
                          : { bedId: bedData.bed, matId: mat.id, data: mat }
                      )}
                    >
                      {selectedMaterial?.bedId === bedData.bed && selectedMaterial?.matId === mat.id ? '收起' : '查看記錄'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 使用統計 */}
          {selectedBed === bedData.bed && (
            <div className="detail-section" style={{ marginTop: '1rem' }}>
              <div className="detail-section-title">📊 今日太平洋醫材使用統計</div>
              {Object.values(bedData.stats).map((stat, statIdx) => (
                <div key={statIdx} className="detail-row">
                  <span className="detail-label">•</span>
                  <span className="detail-value">{stat.note}</span>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn btn-primary">📸 拍照記錄</button>
                <button className="btn btn-secondary">➕ 新增記錄</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);