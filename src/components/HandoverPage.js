import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

const HandoverPage = ({ handover }) => {
  const [showForm, setShowForm] = useState(false);
  const [newHandover, setNewHandover] = useState({
    type: 'critical',
    room: '',
    patient: '',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('交班記錄已送出');
    setShowForm(false);
    setNewHandover({ type: 'critical', room: '', patient: '', note: '' });
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="card-title">📝 新增交班記錄</h2>
            <button onClick={() => setShowForm(false)} className="close-button">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">交班類型</label>
              <select 
                value={newHandover.type}
                onChange={(e) => setNewHandover({...newHandover, type: e.target.value})}
                className="form-select"
              >
                <option value="critical">🔴 重點交班</option>
                <option value="normal">🟡 一般交班</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">病房</label>
              <input
                type="text"
                placeholder="例：305"
                value={newHandover.room}
                onChange={(e) => setNewHandover({...newHandover, room: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">病患姓名</label>
              <input
                type="text"
                placeholder="例：李太太"
                value={newHandover.patient}
                onChange={(e) => setNewHandover({...newHandover, patient: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">交班內容</label>
              <textarea
                placeholder="請詳細描述需要交班的內容..."
                value={newHandover.note}
                onChange={(e) => setNewHandover({...newHandover, note: e.target.value})}
                rows={4}
                className="form-textarea"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                確認送出交班
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">🔄 交班記錄</h2>
            <p className="card-subtitle">早班 → 小夜班 114/12/15</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} /> 新增
          </button>
        </div>
      </div>

      {/* 重點交班 */}
      <div className="handover-section">
        <h3 className="handover-section-title">
          🔴 重點交班
        </h3>
        <div className="space-y-3">
          {handover.filter(h => h.type === 'critical').map(item => (
            <div key={item.id} className="handover-critical-item">
              <div className="handover-item-header">
                <div className="handover-patient">
                  🛏️ {item.room}床 {item.patient}
                </div>
                <span className="alert-time">{item.time}</span>
              </div>
              <div className="handover-note">{item.note}</div>
              <div className="handover-footer">
                <span className="handover-recorder">記錄人：{item.recorder}</span>
                {item.confirmed ? (
                  <span className="handover-status confirmed">
                    <Check size={14} /> 小夜班已讀
                  </span>
                ) : (
                  <span className="handover-status pending">待小夜班確認</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 一般交班 */}
      <div className="handover-section">
        <h3 className="handover-section-title">
          🟡 一般交班
        </h3>
        <div className="space-y-2">
          {handover.filter(h => h.type === 'normal').map(item => (
            <div key={item.id} className="handover-normal-item">
              <span className="handover-bullet">•</span>
              <div style={{ flex: 1 }}>
                <span className="handover-normal-patient">{item.room}床 {item.patient}</span>
                <span> {item.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 交班歷史查詢 */}
      <button className="btn btn-secondary btn-full">
        📚 查詢歷史交班記錄
      </button>
    </div>
  );
};

export default HandoverPage;