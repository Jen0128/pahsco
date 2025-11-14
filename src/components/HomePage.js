import React, { useState } from 'react';
import './HomePage.css';
import { AlertTriangle, X, Clock, Check, ChevronRight, ChevronDown } from 'lucide-react';

const HomePage = ({ setCurrentPage, alerts, tasks, nurse }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [expandedSection, setExpandedSection] = useState(tasks[0]?.id);
  
  const completedTasks = tasks.flatMap(t => t.items).filter(i => i.status === 'completed').length;
  const totalTasks = tasks.flatMap(t => t.items).length;

  const closeAlertDetail = () => {
    setSelectedAlert(null);
  };

  // 任務排序函數：進行中 > 待執行 > 已完成
  const sortTasksByStatus = (items) => {
    const priority = {
      'inProgress': 1,
      'pending': 2,
      'completed': 3
    };
    return [...items].sort((a, b) => priority[a.status] - priority[b.status]);
  };

  return (
    <div className="space-y-4">
      {/* 主要布局：左側緊急提醒 + 右側所有任務內容 */}
      <div className={`main-layout-grid ${alerts.length === 0 ? 'single-column' : ''}`}>
        
        {/* 左側：緊急提醒 */}
        {alerts.length > 0 && (
          <div className="left-section">
            <div className="alert-box" style={{ margin: 0 }}>
              <div className="alert-header">
                <AlertTriangle size={24} />
                <h3>緊急提醒</h3>
              </div>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="alert-item">
                    <div className="alert-item-header">
                      <span className="alert-room">{alert.room}床 {alert.patient}</span>
                      <span className="alert-time">{alert.time}</span>
                    </div>
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-actions">
                      <button 
                        className="btn btn-danger"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        查看詳情
                      </button>
                      <button className="btn btn-secondary">完成確認</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 右側：任務進度 + 任務清單 */}
        <div className="right-section">
          {/* 今日任務進度 */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header">
              <h3 className="card-title">今日任務進度</h3>
              <p style={{ fontSize: '0.75rem', color: '#292929ff' }}>
                說明：任務由醫囑系統、護理計畫自動生成。完成後掃碼/NFC確認即可。
              </p>
            </div>
            
            <div className="progress-bar-container">
              <div className="progress-info">
                <span className="progress-label">完成進度</span>
                <span className="progress-value">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 完整任務清單 */}
          <div className="space-y-4">
            <div className="task-stats">
              <div className="task-stat-item completed">
                <div className="task-stat-value">
                  {tasks.flatMap(t => t.items).filter(i => i.status === 'completed').length}
                </div>
                <div className="task-stat-label">✅ 已完成</div>
              </div>
              <div className="task-stat-item in-progress">
                <div className="task-stat-value">
                  {tasks.flatMap(t => t.items).filter(i => i.status === 'inProgress').length}
                </div>
                <div className="task-stat-label">⏱️ 進行中</div>
              </div>
              <div className="task-stat-item pending">
                <div className="task-stat-value">
                  {tasks.flatMap(t => t.items).filter(i => i.status === 'pending').length}
                </div>
                <div className="task-stat-label">⏳ 待執行</div>
              </div>
            </div>

            {tasks.map(section => (
              <div key={section.id} className="expandable-section">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="expandable-header"
                >
                  <div className="expandable-title-group">
                    <Clock size={20} style={{ color: '#10b981' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="expandable-title">{section.title}</div>
                      <div className="expandable-subtitle">{section.time}</div>
                    </div>
                  </div>
                  {expandedSection === section.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                
                {expandedSection === section.id && (
                  <div className="expandable-content">
                    {/* ⭐ 新增排序：進行中 > 待執行 > 已完成 */}
                    {sortTasksByStatus(section.items).map(item => (
                      <div key={item.id} className="task-item">
                        <div className="task-item-info">
                          <div className="task-item-header">
                            <span className={`task-type-dot ${item.type}`}></span>
                            <span className="task-name">{item.task}</span>
                          </div>
                          <div className="task-details">
                            {item.room !== 'all' && `${item.room}床 `}{item.patient}
                          </div>
                          <div className="task-details">{item.time}</div>
                        </div>
                        <div>
                          {item.status === 'completed' && (
                            <span className="status-badge completed">
                              <Check size={14} /> 已完成
                            </span>
                          )}
                          {item.status === 'inProgress' && (
                            <span className="status-badge in-progress">
                              <Clock size={14} /> 進行中
                            </span>
                          )}
                          {item.status === 'pending' && (
                            <button className="status-badge pending">
                              開始執行
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 警示詳情彈窗 */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={closeAlertDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">🔴 緊急處理詳情</h3>
              <button onClick={closeAlertDetail} className="close-button">
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4 className="detail-section-title">病患資訊</h4>
                <div className="detail-row">
                  <span className="detail-label">病房：</span>
                  <span className="detail-value">{selectedAlert.room}床</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">姓名：</span>
                  <span className="detail-value">{selectedAlert.patient}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">時間：</span>
                  <span className="detail-value">{selectedAlert.time}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">狀況描述</h4>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>{selectedAlert.message}</p>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">建議處置</h4>
                <ul style={{ color: '#374151', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                  <li>立即前往病房確認病患狀況</li>
                  <li>檢查相關醫療設備運作</li>
                  <li>必要時聯繫主治醫師</li>
                  <li>完成後記錄處理過程</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-primary btn-full"
                onClick={() => {
                  alert('已標記為處理中');
                  closeAlertDetail();
                }}
              >
                確認處理
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;