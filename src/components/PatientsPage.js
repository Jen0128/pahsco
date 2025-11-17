import React, { useState } from 'react';
// 引入所有需要的 Lucide-React 圖標
import { Package, AlertCircle, Clock, Check, ChevronDown, ChevronUp, BookOpen, RefreshCw, TrendingUp } from 'lucide-react'; 

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
  // [修改] 使用從 mockData 導入的詳細病人數據
  const myBedsData = mockData.patients;
    
  // 設置 state
  const [selectedBed, setSelectedBed] = useState('301'); // 預設展開第一個病床
  // 設置一個物件來追蹤單獨展開的醫材記錄，這裡預設展開 305床 的第一個醫材，以便顯示詳細資料
  const [selectedMaterial, setSelectedMaterial] = useState({ bedId: '305', matId: 2 }); 

  return (
    <div className="main-content">
      {/* 頂部區域 - 我的病房標題 + 拍照記錄按鈕 */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="card-title">🏥 我的病房</h1>
            {/* [修正] 使用 mockData 中的病房資訊 */}
            <p className="card-subtitle">{mockData.nurse.ward} {myBedsData[0].room}-{myBedsData[myBedsData.length - 1].room}床</p> 
          </div>
          {/* 拍照記錄按鈕 - 使用圖片中的藍色 */}
          <button className="btn btn-primary" style={{ backgroundColor: '#449CE7', borderColor: '#449CE7', fontSize: '0.875rem' }}>
             📸 拍照記錄
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {myBedsData.map((bedData) => {
          const isExpanded = selectedBed === bedData.bed;
          return (
            <div key={bedData.bed} className={`patient-card ${bedData.alert ? 'alert' : ''}`}>
              {/* 病患基本資訊 (類似圖中上方的標題列) */}
              <div className="patient-card-header" style={{ marginBottom: isExpanded ? '0.5rem' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  {/* 病床號碼 Badge */}
                  <div className="bed-number-badge">
                    {bedData.bed}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="patient-name" style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 500 }}>
                      {bedData.patient} ({bedData.gender}/{bedData.age}歲)
                      {/* 需特別注意標籤 - 使用圖片中的紅色 */}
                      {bedData.alert && (
                        <span className="patient-alert-badge" style={{ marginLeft: '0.75rem', background: '#ffebeb', color: '#dc2626' }}>
                          🔴 需特別注意
                        </span>
                      )}
                    </div>
                    {/* 診斷資訊 */}
                    <div className="patient-diagnosis" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      診斷：{bedData.diagnosis}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                  {/* 待辦任務徽章 - 使用圖片中的藍綠色 */}
                  <span className="patient-tasks-badge" style={{ background: '#e0f2f1', color: '#14b8a6', padding: '0.3rem 0.7rem' }}>
                    <Clock size={14} style={{ marginRight: '0.25rem' }} /> {bedData.tasks}項待辦
                  </span>
                  {/* 查看詳情/收起詳情按鈕 - 使用圖片中的淺藍色 */}
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

              {/* 醫材配置內容 - 僅在展開時顯示 */}
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
                              {/* 醫材圖示 */}
                              <span style={{ fontSize: '1.25rem' }}>{mat.icon}</span> 
                              
                              <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                                <span className="material-name" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                  {mat.name} <span className="status-badge-small" style={{ marginLeft: '0.5rem', background: '#dbeafe', color: '#3b82f6' }}>D{mat.day}</span>
                                </span>
                                {/* 醫材備註/狀態描述 */}
                                <div style={{ fontSize: '0.875rem', color: mat.status === 'alert' ? '#dc2626' : 'var(--text-secondary)' }}>
                                  {mat.note}
                                </div>
                              </div>
                            </div>

                            {/* 右側箭頭/圓點 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                              {/* 狀態指示點 - 紅黃綠點 */}
                              <div 
                                className={`material-status-dot`} 
                                style={{ 
                                  backgroundColor: mat.status === 'alert' ? '#dc2626' : mat.status === 'warning' ? '#f59e0b' : '#10b981'
                                }}
                              ></div>
                              {isMaterialExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </button>

                          {/* 醫材使用記錄 (時間軸) */}
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

                  {/* 今日太平洋醫材使用統計 */}
                  <div className="detail-section" style={{ background: '#f5f7f8', padding: '1rem', border: '1px solid var(--color-sand)', borderRadius: '0.5rem' }}>
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

                  {/* 底部按鈕 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                    {/* 拍照記錄 - 圖片中的藍色 */}
                    <button className="btn btn-primary" style={{ backgroundColor: '#449CE7', borderColor: '#449CE7' }}>📸 拍照記錄</button>
                    {/* 新增記錄 - 圖片中的綠色 */}
                    <button className="btn btn-primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}>➕ 新增記錄</button>
                  </div>
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