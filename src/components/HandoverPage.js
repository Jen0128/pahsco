import React, { useState } from 'react';
import { Package, Check, AlertTriangle, MessageSquare, List, Zap, ChevronUp } from 'lucide-react';
import { mockData } from '../data/mockData';
import './HandoverPage.css'; 

// --------------------------------------------------------
// [模擬 AI 核心邏輯]：根據輸入數據生成結構化的交班報告
// --------------------------------------------------------
const generateAIPriorityReport = (patients, tasks, supplies, handover) => {
  const patientReports = [];
  const totalSummary = {
      observe: [], // 需下一班繼續觀察 (綠色)
      handle: [],  // 需下一班處理 (黃色)
      supply: [],  // 需下一班補貨 (棕色)
  };

  // 1. 生成個別病患報告
  const priorityPatients = patients.filter(p => p.alert || p.tasks > 0);

  priorityPatients.forEach(p => {
    const criticalPoints = [];
    const materialActions = [];

    // --- 提取資訊 ---
    const patientTasks = tasks.flatMap(t => t.items).filter(i => i.room === p.room);
    const criticalHandover = handover.filter(h => h.room === p.room && (h.type === 'critical' || h.type === 'warning'));

    // a. 重點關注 (Alert/Critical)
    const alertMaterials = p.materials.filter(m => m.status === 'alert');
    if (alertMaterials.length > 0) {
      alertMaterials.forEach(m => {
        criticalPoints.push(`${m.name}：今日引流量 ${m.note.split('：')[1] || '異常增加'}`);
        // 總結：需觀察
        totalSummary.observe.push(`床號${p.room} ${p.name}：${m.name} (${m.note})`);
      });
    }

    criticalHandover.forEach(h => {
        criticalPoints.push(`🚨 ${h.type === 'critical' ? '危急' : '警告'}：${h.note} (記錄於 ${h.time})`);
        // 總結：需觀察
        totalSummary.observe.push(`床號${p.room} ${p.name}：${h.note}`);
    });
    
    // b. 醫材使用紀錄 (Completed Tasks & Warning Materials)
    const completedTasks = patientTasks.filter(i => i.status === 'completed' && (i.type === 'medication' || i.type === 'care'));
    completedTasks.forEach(t => {
        materialActions.push(`[${t.time}] 完成 ${t.task}`);
    });
    
    const warningMaterials = p.materials.filter(m => m.status === 'warning');
    warningMaterials.forEach(m => {
        materialActions.push(`[D${m.day}提醒] ${m.name}：${m.note}`);
        // 總結：需處理
        totalSummary.handle.push(`床號${p.room} ${p.name}：${m.name} (${m.note})`);
    });

    // c. 需下一班處理的任務 (Pending tasks/Procedures)
    const pendingProcedures = patientTasks.filter(i => i.status === 'pending' && i.type === 'procedure');
    pendingProcedures.forEach(t => {
        totalSummary.handle.push(`床號${p.room} ${p.name}：${t.task}`);
    });

    // d. 確保只有有內容的病患才加入報告
    if (criticalPoints.length > 0 || materialActions.length > 0) {
      patientReports.push({
        bed: p.room,
        patient: p.name, 
        diagnosis: p.diagnosis,
        age: p.age,
        criticalPoints,
        materialActions,
        manualNote: '', 
        isNoteExpanded: false,
      });
    }
  });

  // 2. 彙整公共事項提醒 (補貨)
  const lowStock = supplies.filter(s => s.status === 'low');
  lowStock.forEach(s => {
      totalSummary.supply.push(`${s.name} 剩餘 ${s.stock}${s.unit} (安全庫存 ${s.safetyStock}${s.unit})`);
  });

  return { patientReports: patientReports, totalSummary };
};

// --------------------------------------------------------
// 交班頁面組件
// --------------------------------------------------------
const HandoverPage = () => {
  const initialReports = generateAIPriorityReport(
    mockData.patients, 
    mockData.tasks, 
    mockData.supplies, 
    mockData.handover
  );

  const [aiReports, setAiReports] = useState(initialReports.patientReports);
  const [totalSummary, setTotalSummary] = useState(initialReports.totalSummary);
  const [loading, setLoading] = useState(false);

  // 處理單一病患手動筆記輸入
  const handleManualNoteChange = (index, value) => {
    setAiReports(prevReports => prevReports.map((report, i) => 
      i === index ? { ...report, manualNote: value } : report
    ));
  };
  
  // 處理單一病患筆記區塊展開/收起 (現在在右上角)
  const handleNoteExpandToggle = (index) => {
    setAiReports(prevReports => prevReports.map((report, i) => 
      i === index ? { ...report, isNoteExpanded: !report.isNoteExpanded } : report
    ));
  };

  // 模擬 AI 重新生成數據
  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const newReports = generateAIPriorityReport(mockData.patients, mockData.tasks, mockData.supplies, mockData.handover);
      setAiReports(newReports.patientReports);
      setTotalSummary(newReports.totalSummary);
      setLoading(false);
    }, 1500);
  };
  
  // 渲染總交接清單的輔助函數
  const renderSummaryList = (title, data, icon, color) => (
    <div className="summary-section">
      <div className="summary-title" style={{ color: color }}>
        {icon} <span>{title}</span>
      </div>
      {data.length > 0 ? (
        <ul className="summary-list">
          {data.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="summary-empty">✓ 狀態正常</p>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">🔄 智慧交班系統</h2>
            <p className="card-subtitle">AI 自動整理 &amp; 交接重點彙整</p>
          </div>
          <button 
            onClick={handleRegenerate}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '生成中...' : '🤖 重新整理報告'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="card flex-center" style={{ minHeight: '200px', flexDirection: 'column', gap: '1rem' }}>
            <div className="loading-spinner"></div>
            <p className="text-secondary">AI 正在從醫囑、記錄中彙整交班重點...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* AI 自動產生交班重點 (病患個別區塊) */}
          <div className="ai-report-box">
            <div className="report-header">
              <AlertTriangle size={20} style={{ color: 'var(--color-rust)' }} />
              <h3>病患個別交班重點 (共 {aiReports.length} 位)</h3>
            </div>
            
            {aiReports.length === 0 && (
              <div className="empty-state">
                ✅ 目前所有病患狀況穩定，無須特別交班。
              </div>
            )}

            {aiReports.map((reportItem, idx) => (
              <div key={idx} className="bed-report-item" style={{ position: 'relative' }}> 
                {/* 頂部資訊區 */}
                <div className="report-patient-info-bar">
                  <div className="bed-number-badge">{reportItem.bed}</div>
                  <div className="patient-info-group">
                    <span className="patient-name-report">{reportItem.patient} ({reportItem.age}歲)</span>
                    <span className="patient-diagnosis-report">診斷: {reportItem.diagnosis}</span>
                  </div>
                </div>
                
                {/* [修改] 護理師補充按鈕 - 絕對定位於右上角 */}
                <button 
                    className="manual-note-btn"
                    onClick={() => handleNoteExpandToggle(idx)}
                    style={{ 
                        background: reportItem.manualNote ? 'var(--color-success)' : 'var(--color-earth-medium)',
                        color: 'white'
                    }}
                >
                    {reportItem.isNoteExpanded ? <ChevronUp size={16} /> : <MessageSquare size={16} />}
                    {reportItem.manualNote ? '已補充' : '補充'}
                </button>

                {/* [修改] 內容區塊 - 左右並排 */}
                <div className="report-content-group-grid"> 
                  {/* 重點關注 (左側) */}
                  <div className="content-section-grid">
                    <div className="section-title critical">
                      <AlertTriangle size={18} style={{ color: 'var(--color-rust)' }} /> 重點關注
                    </div>
                    <ul className="detail-list-compact">
                      {reportItem.criticalPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 醫材與當班行動 (右側) */}
                  <div className="content-section-grid">
                    <div className="section-title action">
                      <Package size={18} style={{ color: 'var(--color-moss)' }} /> 太平洋醫材使用紀錄
                    </div>
                    <ul className="detail-list-compact">
                      {reportItem.materialActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* 護理師補充區域 */}
                {reportItem.isNoteExpanded && (
                    <div className="form-group-note">
                        <label className="form-label">護理師補充說明</label>
                        <textarea
                            value={reportItem.manualNote}
                            onChange={(e) => handleManualNoteChange(idx, e.target.value)}
                            placeholder="輸入給下一班的額外交班重點..."
                            rows={3}
                            className="form-textarea"
                        />
                    </div>
                )}
              </div>
            ))}
          </div>
          
          {/* 底部總交接清單 (圖一結構) */}
          <div className="card handover-summary-card">
            <h3 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <List size={20} /> 總交接清單
            </h3>
            
            <div className="summary-grid">
              {/* 1. 需下一班繼續觀察 (綠色) */}
              {renderSummaryList(
                '需下一班繼續觀察',
                totalSummary.observe,
                <Check size={18} style={{ color: 'var(--color-success)' }} />,
                'var(--color-success)' // 顏色用於標題文字
              )}

              {/* 2. 需下一班處理 (黃色) */}
              {renderSummaryList(
                '需下一班處理',
                totalSummary.handle,
                <Zap size={18} style={{ color: 'var(--color-ochre)' }} />,
                'var(--color-ochre)'
              )}

              {/* 3. 需下一班補貨 (棕色) */}
              {renderSummaryList(
                '需下一班補貨',
                totalSummary.supply,
                <Package size={18} style={{ color: 'var(--color-rust)' }} />,
                'var(--color-rust)'
              )}
            </div>
            
            {/* 確認交班按鈕 */}
            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, background: '#10B981', borderColor: '#10B981' }}
                onClick={() => alert('交班報告已確認並送出給下一班')}
              >
                <Check size={18} />確認交班完成
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => alert('已匯出交班報告 PDF/檔案')}
              >
                📄 匯出交班報告
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandoverPage; 
