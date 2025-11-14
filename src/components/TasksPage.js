import React, { useState } from 'react';
import { Clock, Check, ChevronRight, ChevronDown } from 'lucide-react';

const TasksPage = ({ tasks }) => {
  const [expandedSection, setExpandedSection] = useState(tasks[0]?.id);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="card-title">📅 今日任務清單</h2>
        <p className="card-subtitle">113/12/15 (五) 早班</p>
        
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
              {section.items.map(item => (
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

      <div style={{ backgroundColor: '#dbeafe', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: '0.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
          💡 <strong>系統說明：</strong>任務由醫囑系統、護理計畫自動生成。完成後掃碼/NFC確認即可。
        </p>
      </div>
    </div>
  );
};

export default TasksPage;