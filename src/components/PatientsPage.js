import React, { useState } from 'react';
// [修改] 引入所需圖標，加入 FileText, Save, XCircle 以供表單使用
import { Package, AlertCircle, Clock, Check, ChevronDown, ChevronUp, BookOpen, RefreshCw, TrendingUp, Camera, X, FileText, Save, XCircle } from 'lucide-react'; 

// [修改] 從 mockData 導入數據
import { mockData } from '../data/mockData';

// Helper functions for icons
const getTimelineTypeIcon = (type) => {
  switch (type) {
    case 'record':
      return <BookOpen size={16} style={{ color: 'var(--color-moss)' }} />;
    case 'change':
      return <RefreshCw size={16} style={{ color: 'var(--color-earth-dark)' }} />;
    case 'alert':
      return <AlertCircle size={16} style={{ color: 'var(--color-rust)' }} />;
    case 'check':
    default:
      return <Check size={16} style={{ color: 'var(--color-success)' }} />;
  }
};

const PatientsPage = () => {
  // [修改] 將導入的數據轉換為 State，以便我們能新增紀錄並即時更新畫面
  const [patients, setPatients] = useState(mockData.patients.map(p => ({
    ...p,
    // 確保每個病患都有一個紀錄陣列，若 mockData 沒有則初始化為空
    records: p.records || [] 
  })));
    
  // 設置 state
  const [selectedBed, setSelectedBed] = useState('301'); // 預設展開第一個病床
  const [selectedMaterial, setSelectedMaterial] = useState({ bedId: '305', matId: 2 }); 

  // 控制拍照介面
  const [showScanner, setShowScanner] = useState(false);

  // [新增] 控制「新增紀錄」表單的展開狀態 (存儲正在編輯的床號，null 代表無)
  const [editingBedId, setEditingBedId] = useState(null);
  
  // [新增] 新紀錄的暫存內容
  const [newRecord, setNewRecord] = useState({
    type: 'record',
    content: '',
    time: ''
  });

  // [新增] 處理開始新增紀錄
  const handleStartAddRecord = (bedId) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setNewRecord({ type: 'record', content: '', time: timeString });
    setEditingBedId(bedId);
  };

  // [新增] 處理儲存紀錄
  const handleSaveRecord = (bedId) => {
    if (!newRecord.content.trim()) {
      alert("請輸入紀錄內容");
      return;
    }

    setPatients(currentPatients => currentPatients.map(p => {
      if (p.bed === bedId) {
        return {
          ...p,
          records: [
            ...p.records,
            {
              id: Date.now(),
              time: newRecord.time,
              type: newRecord.type,
              content: newRecord.content,
              executor: mockData.nurse.name // 使用登入護理師的名字
            }
          ]
        };
      }
      return p;
    }));

    setEditingBedId(null); // 關閉表單
  };

  // 掃碼介面
  if (showScanner) {
    return (
      <div className="space-y-4">
        <div className="card scanner-container" style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowScanner(false)}
            className="close-button"
          >
            <X size={24} />
          </button>
          <div className="scanner-icon">
            <Camera size={64} />
          </div>
          <h2 className="scanner-title">📷 掃描物料條碼</h2>
          <p className="scanner-desc">將相機對準物料條碼進行掃描</p>
          
          <div className="scanner-area">
            <div className="scanner-box">
              <p>掃描區域</p>
            </div>
          </div>

          <button 
            onClick={() => {
              alert('模擬掃描成功！已記錄使用');
              setShowScanner(false);
            }}
            className="btn btn-primary btn-full"
            style={{ backgroundColor: '#449CE7', borderColor: '#449CE7' }}
          >
            模擬掃描成功
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* 頂部區域 */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="card-title">🏥 我的病房</h1>
            <p className="card-subtitle">{mockData.nurse.ward} {patients[0].room}-{patients[patients.length - 1].room}床</p> 
          </div>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#449CE7', borderColor: '#449CE7', fontSize: '0.875rem' }}
            onClick={() => setShowScanner(true)}
          >
             📸 拍照記錄
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {patients.map((bedData) => {
          const isExpanded = selectedBed === bedData.bed;
          const isEditing = editingBedId === bedData.bed;

          return (
            <div key={bedData.bed} className={`patient-card ${bedData.alert ? 'alert' : ''}`}>
              {/* 病患基本資訊 */}
              <div className="patient-card-header" style={{ marginBottom: isExpanded ? '0.5rem' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div className="bed-number-badge">
                    {bedData.bed}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="patient-name" style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 500 }}>
                      {bedData.patient} ({bedData.gender}/{bedData.age}歲)
                      {bedData.alert && (
                        <span className="patient-alert-badge" style={{ marginLeft: '0.75rem', background: '#ffebeb', color: '#dc2626' }}>
                          🔴 需特別注意
                        </span>
                      )}
                    </div>
                    <div className="patient-diagnosis" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      診斷：{bedData.diagnosis}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                  <span className="patient-tasks-badge" style={{ background: '#e0f2f1', color: '#14b8a6', padding: '0.3rem 0.7rem' }}>
                    <Clock size={14} style={{ marginRight: '0.25rem' }} /> {bedData.tasks}項待辦
                  </span>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedBed(isExpanded ? null : bedData.bed)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.875rem', 
                      background: isExpanded ? 'var(--color-sand)' : '#dbeafe',
                      color: isExpanded ? 'var(--text-primary)' : '#3b82f6',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    {isExpanded ? '收起詳情' : '查看詳情'}
                  </button>
                </div>
              </div>

              {/* 展開內容 */}
              {isExpanded && (
                <div className="expanded-patient-content" style={{ marginTop: '0.5rem' }}>
                  {/* 醫材配置標題 */}
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-rust)', marginBottom: '0.75rem', fontWeight: 500, fontSize: '0.9375rem' }}>
                    <Package size={18} style={{ marginRight: '0.5rem' }} />
                    病患身上的太平洋醫材配置：
                  </div>
                  
                  {/* 病患醫材配置清單 */}
                  <div className="space-y-2">
                    {bedData.materials.map((mat) => {
                      const isMaterialExpanded = selectedMaterial?.bedId === bedData.bed && selectedMaterial?.matId === mat.id;
                      return (
                        <div key={mat.id} className={`material-item-card ${isMaterialExpanded ? 'expanded-record' : ''}`}>
                          <button 
                            className="material-item-header"
                            onClick={() => setSelectedMaterial(
                              isMaterialExpanded ? null : { bedId: bedData.bed, matId: mat.id }
                            )}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.75rem' }}>
                              <span style={{ fontSize: '1.25rem' }}>{mat.icon}</span> 
                              
                              <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                                <span className="material-name" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                  {mat.name} <span className="status-badge-small" style={{ marginLeft: '0.5rem', background: '#dbeafe', color: '#3b82f6' }}>D{mat.day}</span>
                                </span>
                                <div style={{ fontSize: '0.875rem', color: mat.status === 'alert' ? '#dc2626' : 'var(--text-secondary)' }}>
                                  {mat.note}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                              <div 
                                className={`material-status-dot`} 
                                style={{ 
                                  backgroundColor: mat.status === 'alert' ? '#dc2626' : mat.status === 'warning' ? '#f59e0b' : '#10b981'
                                }}
                              ></div>
                              {isMaterialExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </button>

                          {isMaterialExpanded && (
                            <div className="material-timeline-content">
                              {mat.timeline.map((event, eventIdx) => (
                                <div key={eventIdx} className="timeline-event">
                                  <div className="event-time">
                                    {event.time}
                                  </div>
                                  <div className="event-details">
                                    <div className="event-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      {getTimelineTypeIcon(event.type)}
                                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{event.content}</span>
                                    </div>
                                    <div className="event-detail-note" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                      {event.detail}
                                    </div>
                                    <div className="event-executor" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                      執行者：{event.executor}
                                      {event.hasPhoto && 
                                        <button className="btn btn-link" style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#449CE7', background: 'none', border: 'none', padding: 0 }}>
                                          📸 檢視照片
                                        </button>
                                      }
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* [新增] 顯示剛剛新增的護理紀錄區域 */}
                  {bedData.records && bedData.records.length > 0 && (
                    <div className="detail-section" style={{ background: '#fff', padding: '1rem', border: '1px solid var(--color-sand)', borderRadius: '0.5rem', marginTop: '1rem' }}>
                       <div className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.75rem' }}>
                        <FileText size={18} /> 
                        最新護理紀錄
                      </div>
                      <div className="space-y-3">
                        {bedData.records.map((rec) => (
                          <div key={rec.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', borderBottom: '1px dashed #e5e7eb', paddingBottom: '0.5rem' }}>
                            <div style={{ color: 'var(--text-tertiary)', minWidth: '40px' }}>{rec.time}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    {getTimelineTypeIcon(rec.type)}
                                    <span style={{ color: 'var(--text-primary)' }}>{rec.content}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>執行者：{rec.executor}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 統計區域 */}
                  <div className="detail-section" style={{ background: '#f5f7f8', padding: '1rem', border: '1px solid var(--color-sand)', borderRadius: '0.5rem', marginTop: '1rem' }}>
                    <div className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-moss)', fontWeight: 500 }}>
                      <TrendingUp size={18} /> 
                      今日太平洋醫材使用統計
                    </div>
                    {Object.values(bedData.stats).map((stat, statIdx) => (
                      <div key={statIdx} className="detail-row" style={{ padding: '0.25rem 0', fontSize: '0.9375rem' }}>
                        <span className="detail-label">•</span>
                        <span className="detail-value" style={{ flex: 1, textAlign: 'left', marginLeft: '0.5rem' }}>{stat.note}</span>
                      </div>
                    ))}
                  </div>

                  {/* 底部操作區：依狀態顯示「按鈕」或「新增表單」 */}
                  {!isEditing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                        <button 
                        className="btn btn-primary" 
                        style={{ backgroundColor: '#449CE7', borderColor: '#449CE7' }}
                        onClick={() => setShowScanner(true)}
                        >
                        📸 拍照記錄
                        </button>
                        {/* [修改] 綁定點擊事件，切換為編輯模式 */}
                        <button 
                            className="btn btn-primary" 
                            style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                            onClick={() => handleStartAddRecord(bedData.bed)}
                        >
                            ➕ 新增記錄
                        </button>
                    </div>
                  ) : (
                    /* [新增] 新增紀錄的內聯表單 */
                    <div className="add-record-form" style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        backgroundColor: '#f0fdf4', // 淺綠色背景，呼應按鈕
                        border: '1px solid #bbf7d0', 
                        borderRadius: '0.5rem',
                        animation: 'fadeIn 0.2s ease-in'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h4 style={{ margin: 0, color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                <FileText size={18} /> 新增護理紀錄
                            </h4>
                            <button onClick={() => setEditingBedId(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}>
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>時間</label>
                                <input 
                                    type="time" 
                                    className="form-input"
                                    value={newRecord.time}
                                    onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>類型</label>
                                <select 
                                    className="form-select"
                                    value={newRecord.type}
                                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                                >
                                    <option value="record">一般紀錄</option>
                                    <option value="change">更換醫材</option>
                                    <option value="alert">異常狀況</option>
                                    <option value="check">例行檢查</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>紀錄內容</label>
                            <textarea 
                                className="form-textarea"
                                rows="2" 
                                placeholder="請輸入護理紀錄..."
                                value={newRecord.content}
                                onChange={(e) => setNewRecord({...newRecord, content: e.target.value})}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', resize: 'none' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button 
                                onClick={() => setEditingBedId(null)}
                                className="btn btn-secondary"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => handleSaveRecord(bedData.bed)}
                                className="btn btn-primary"
                                style={{ flex: 1, backgroundColor: '#10B981', borderColor: '#10B981', justifyContent: 'center' }}
                            >
                                <Save size={16} style={{ marginRight: '0.25rem' }} /> 儲存紀錄
                            </button>
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientsPage;