import React from 'react';
import { User, MapPin, Calendar, Award } from 'lucide-react';

const ProfilePage = ({ nurse, patients }) => {
  return (
    <div className="space-y-4">
      {/* 個人資料卡片 */}
      <div className="card">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div className="user-avatar" style={{ width: '5rem', height: '5rem', fontSize: '2rem', margin: '0 auto 1rem' }}>
            陳
          </div>
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>{nurse.name}</h2>
          <p className="card-subtitle">護理師 ID: {nurse.id}</p>
        </div>

        <div className="detail-section">
          <div className="detail-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
              <Calendar size={16} />
              <span>班別</span>
            </div>
            <span className="detail-value">
              {nurse.shift === 'morning' ? '早班 07:00-15:00' : 
               nurse.shift === 'evening' ? '小夜 15:00-23:00' : '大夜 23:00-07:00'}
            </span>
          </div>
          <div className="detail-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
              <MapPin size={16} />
              <span>負責病房</span>
            </div>
            <span className="detail-value">{nurse.ward}</span>
          </div>
          <div className="detail-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
              <Award size={16} />
              <span>照護病患</span>
            </div>
            <span className="detail-value">{patients.length}位</span>
          </div>
        </div>
      </div>

      {/* 統計資訊 */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-value">{nurse.rooms.length}</div>
          <div className="stat-label">負責病房數</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{patients.filter(p => !p.alert).length}</div>
          <div className="stat-label">狀況穩定</div>
        </div>
      </div>

      {/* 我的病患列表 */}
      <div className="card">
        <h2 className="card-title">🏥 我的病患</h2>
        <p className="card-subtitle" style={{ marginBottom: '1rem' }}>3樓西側 301-308床</p>
      </div>

      <div className="space-y-3">
        {patients.map(patient => (
          <div key={patient.id} className={`patient-card ${patient.alert ? 'alert' : ''}`}>
            <div className="patient-card-header">
              <div>
                <div className="patient-room">
                  <span className="patient-room-number">🛏️ {patient.room}床</span>
                  {patient.alert && (
                    <span className="patient-alert-badge">
                      🔴 需特別注意
                    </span>
                  )}
                </div>
                <div className="patient-name">{patient.name} ({patient.gender}/{patient.age}歲)</div>
              </div>
              {patient.tasks > 0 && (
                <span className="patient-tasks-badge">
                  ⚠️ {patient.tasks}項待辦
                </span>
              )}
            </div>
            
            <div className="patient-diagnosis">
              <span>診斷：</span>{patient.diagnosis}
            </div>

            {patient.tasks === 0 && (
              <div className="patient-status completed">
                ✅ 今日任務已完成
              </div>
            )}
            
            <button className="btn btn-primary btn-full">
              查看詳情
            </button>
          </div>
        ))}
      </div>

      {/* 系統資訊 */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>⚙️ 系統資訊</h3>
        <div className="detail-row">
          <span className="detail-label">版本</span>
          <span className="detail-value">v1.0.0</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">最後登入</span>
          <span className="detail-value">2025/11/07 14:30</span>
        </div>
        <button className="btn btn-secondary btn-full" style={{ marginTop: '1rem' }}>
          登出系統
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;