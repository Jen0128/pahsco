import React, { useState, useEffect } from 'react';
import { Home, Package, RefreshCw, User, LogOut, X } from 'lucide-react';
import './App.css';

// 導入數據
import { mockData } from './data/mockData';

// 導入頁面組件
import HomePage from './components/HomePage';
import HandoverPage from './components/HandoverPage';
import SuppliesPage from './components/SuppliesPage';
import PatientsPage from './components/PatientsPage'; 
import ProfilePage from './components/ProfilePage'; // 重新啟用 ProfilePage

export default function NursingSystem() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTime, setCurrentTime] = useState(new Date());
  // [新增狀態] 控制 Profile 模態頁的顯示/隱藏
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 更新時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 登出處理
  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) {
      alert('已登出系統');
      // 這裡可以加入實際的登出邏輯
    }
  };

  // 格式化時間 - 包含日期和星期
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}`;
  };

  return (
    <div className="app-container">
      {/* 頂部導航 */}
      <div className="top-nav">
        <div className="top-nav-content">
          {/* 左側：系統名稱 */}
          <div className="top-nav-left">
            <div className="top-nav-logo">🔆</div>
            <div>
              <h1 className="top-nav-title">護理晴報</h1>
              <p className="top-nav-subtitle">護理工作系統</p>
            </div>
          </div>

          {/* 右側：護理師、時間、登出 */}
          {/* [修改] 讓 header-info 成為點擊區域，開啟 Profile Modal */}
          <div 
            className="header-info clickable-header" // 新增 clickable-header 類別
            onClick={() => setShowProfileModal(true)}
          >
            <span className="nurse-name-simple">👤 {mockData.nurse.name}</span>
            <span className="current-datetime">{formatDateTime(currentTime)}</span>
            <button className="logout-button" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="main-content">
        {currentPage === 'home' && (
          <HomePage 
            setCurrentPage={setCurrentPage} 
            alerts={mockData.alerts} 
            tasks={mockData.tasks} 
            nurse={mockData.nurse}
          />
        )}
        {currentPage === 'handover' && <HandoverPage handover={mockData.handover} />}
        {currentPage === 'supplies' && <SuppliesPage supplies={mockData.supplies} />}
        {/* 'profile' 分頁使用 PatientsPage */}
        {currentPage === 'profile' && (
          <PatientsPage /> 
        )}
      </div>
      
      {/* 底部導航 (略) */}
      <div className="bottom-nav">
        <div className="bottom-nav-content">
          <button
            onClick={() => setCurrentPage('home')}
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
          >
            <div className="nav-icon"><Home size={24} /></div>
            <span className="nav-label">首頁</span>
          </button>
          <button
            onClick={() => setCurrentPage('supplies')}
            className={`nav-button ${currentPage === 'supplies' ? 'active' : ''}`}
          >
            <div className="nav-icon"><Package size={24} /></div>
            <span className="nav-label">物料</span>
            {mockData.supplies.filter(s => s.status === 'low').length > 0 && (
              <span className="nav-notification-badge"></span>
            )}
          </button>
          <button
            onClick={() => setCurrentPage('profile')}
            className={`nav-button ${currentPage === 'profile' ? 'active' : ''}`}
          >
            <div className="nav-icon"><User size={24} /></div>
            <span className="nav-label">病患</span>
          </button>
          <button
            onClick={() => setCurrentPage('handover')}
            className={`nav-button ${currentPage === 'handover' ? 'active' : ''}`}
          >
            <div className="nav-icon"><RefreshCw size={24} /></div>
            <span className="nav-label">交班</span>
          </button>
        </div>
      </div>
      
      {/* [新增] Profile 模態頁 */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          {/* 使用 modal-content 類別來承載 ProfilePage */}
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            {/* 關閉按鈕 */}
            <button 
              onClick={() => setShowProfileModal(false)} 
              className="close-button"
            >
              <X size={24} />
            </button>

            <div className="modal-body" style={{ paddingTop: '0.5rem' }}>
              <ProfilePage 
                nurse={mockData.nurse} 
                patients={mockData.patients}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}