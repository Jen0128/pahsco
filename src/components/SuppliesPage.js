import React, { useState } from 'react';
// 確保所有使用的 Lucide-React 圖示都被正確導入：
import { Camera, Search, ChevronRight, X, AlertTriangle, Plus, Trash2, RefreshCw, Calendar, Check, List } from 'lucide-react';
import { mockData } from '../data/mockData';

// --------------------------------------------------------
// 新增的「跨科室庫存調撥」和「效期智慧管理」的模擬數據
// --------------------------------------------------------

// 模擬跨科室庫存數據 (本單位缺貨，需要調借)
const crossDepartmentData = [
  { 
    name: '密閉式抽痰管', 
    spec: '14Fr', 
    currentStatus: 'low', 
    units: '支',
    // 友科室庫存狀態
    borrowStatus: [
      { dept: 'ICU病房', stock: '充足', quantity: 15, available: true },
      { dept: '呼吸照護', stock: '普通', quantity: 8, available: true },
    ],
  },
];

// 模擬調借請求（本單位收到）
const incomingRequests = [
    // localSupplyId 用於查找 mockData.supplies 中的本地庫存
    { fromDept: '外科病房', item: '精密尿袋', spec: '2000ml', quantity: 3, unit: '個', localSupplyId: 'S013' } 
];

// 模擬效期智慧管理數據 (包含所有狀態)
const allExpiryManagementData = [
    {
        name: '20x20cm 紗布',
        spec: '',
        status: 'expiring', // 紅色警告
        expiryDays: 15,
        stock: 50,
        unit: '片',
        note: '建議用於床號301、205的傷口換藥'
    },
    {
        name: '精密尿袋',
        spec: '2000ml',
        status: 'warning', // 黃色警告
        expiryDays: 45,
        stock: 30,
        unit: '個',
        note: '預計30天內可用完，無浪費風險'
    },
    {
        name: '生理食鹽水',
        spec: '500ml',
        status: 'expiring', // 紅色警告
        expiryDays: 30,
        stock: 15,
        unit: '瓶',
        note: '效期：2025/12/20，請優先使用'
    },
    {
        name: '密閉式抽痰管',
        spec: '14Fr',
        status: 'normal', // 正常，初始不顯示
        expiryDate: '2026/08',
        stock: 23,
        unit: '支',
        note: '庫存健康，無需特別關注'
    }
];

// 中英種類名稱映射 (用於篩選器顯示)
const categoryMap = {
    all: '全部種類',
    injection: '注射類',
    wound: '敷料/傷口類',
    lab: '檢驗用品',
    medication: '藥物相關',
    catheter: '管/導管類',
    protective: '防護用品',
    other: '其他'
};

// --------------------------------------------------------
// 物料管理頁面組件
// --------------------------------------------------------
const SuppliesPage = ({ supplies }) => {
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [manualItems, setManualItems] = useState([]);
  
  // 庫存清單狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 效期管理狀態
  const [showAllExpiry, setShowAllExpiry] = useState(false);

  // 輔助函數：查找本科室庫存
  const getLocalStock = (supplyId) => {
    const supply = mockData.supplies.find(s => s.id === supplyId);
    // 這裡將 low 視為庫存不足，expiring 視為即將到期
    const statusText = supply 
        ? (supply.status === 'low' ? '不足' : (supply.status === 'expiring' ? '即將到期' : '充足'))
        : 'N/A';
    return supply ? `${supply.stock}${supply.unit} (${statusText})` : 'N/A';
  };
  
  // 1. 處理效期管理數據的篩選和排序
  let attentionItems = allExpiryManagementData.filter(item => item.status === 'expiring' || item.status === 'warning');

  // 排序：'expiring' (紅) 優先於 'warning' (黃)
  attentionItems.sort((a, b) => {
    const order = { expiring: 1, warning: 2 };
    return order[a.status] - order[b.status];
  });
  
  // 展開/收合邏輯
  const initialDisplayCount = 2; // 默认只显示前2个
  const initialDisplayItems = attentionItems.slice(0, initialDisplayCount); 
  const displayedExpiryItems = showAllExpiry ? attentionItems : initialDisplayItems;

  // 3. 處理庫存列表的篩選邏輯
  const uniqueCategories = ['all', ...new Set(supplies.map(s => s.category))];

  const filteredSupplies = supplies
      .filter(supply => 
          selectedCategory === 'all' || supply.category === selectedCategory
      )
      .filter(supply => 
          supply.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          supply.id.toLowerCase().includes(searchTerm.toLowerCase()) // 允許搜尋 ID/條碼
      );

  

  // 補貨申請表單 (保留原樣)
  if (showOrderForm) {
      const addManualItem = () => {
        setManualItems([...manualItems, { id: Date.now(), supplyId: '', quantity: '' }]);
      };
  
      const removeManualItem = (id) => {
        setManualItems(manualItems.filter(item => item.id !== id));
      };
  
      const updateManualItem = (id, field, value) => {
        setManualItems(manualItems.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
      };
  
      return (
        <div className="space-y-4">
          <div className="card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title">🛒 補貨申請</h2>
              <button onClick={() => { setShowOrderForm(false); setManualItems([]); }} className="close-button">
                <X size={24} />
              </button>
            </div>
  
            {/* 系統建議補貨清單 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 500, color: '#374151', marginBottom: '0.75rem' }}>📦 系統建議補貨清單</h3>
              <div className="space-y-3">
                {supplies.filter(s => s.status === 'low').map(supply => (
                  <div key={supply.id} style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontWeight: 500 }}>{supply.name}</span>
                      </label>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
                      現有：{supply.stock}{supply.unit} | 建議：{supply.safetyStock * 5}{supply.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* 手動添加項目區域 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 500, color: '#374151' }}>✏️ 手動添加項目</h3>
                <button 
                  onClick={addManualItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  <Plus size={16} />
                  新增項目
                </button>
              </div>
  
              {manualItems.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.5rem',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  點擊「新增項目」按鈕來添加需要補貨的物料
                </div>
              ) : (
                <div className="space-y-3">
                  {manualItems.map(item => (
                    <div key={item.id} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            物料名稱
                          </label>
                          <select 
                            value={item.supplyId}
                            onChange={(e) => updateManualItem(item.id, 'supplyId', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            <option value="">請選擇物料</option>
                            {supplies.map(supply => (
                              <option key={supply.id} value={supply.id}>
                                {supply.name} ({supply.brand})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ width: '120px' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            補貨數量
                          </label>
                          <input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateManualItem(item.id, 'quantity', e.target.value)}
                            placeholder="數量"
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                        <button
                          onClick={() => removeManualItem(item.id)}
                          style={{
                            marginTop: '1.25rem',
                            padding: '0.5rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="刪除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            <form onSubmit={(e) => { e.preventDefault(); alert('申請已送出'); setShowOrderForm(false); setManualItems([]); }}>
              <div className="form-group">
                <label className="form-label">需求日期</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">緊急程度</label>
                <select className="form-select">
                  <option>一般</option>
                  <option>緊急</option>
                  <option>特急</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">備註說明</label>
                <textarea rows={3} className="form-textarea" placeholder="請填寫補貨原因或特殊需求..."></textarea>
              </div>
  
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  ✓ 送出申請
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowOrderForm(false); setManualItems([]); }}
                  className="btn btn-secondary"
                >
                  ✗ 取消
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }

  // 物料詳情頁 (保留原樣)
  if (selectedSupply) {
    const supply = supplies.find(s => s.id === selectedSupply);
    return (
        <div className="space-y-4">
        <div className="card" style={{ padding: '1rem' }}>
          <button 
            onClick={() => setSelectedSupply(null)}
            style={{ display: 'flex', alignItems: 'center', color: '#10b981', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '0.75rem', padding: 0 }}
          >
            <ChevronRight style={{ transform: 'rotate(180deg)', marginRight: '0.25rem' }} size={20} />
            返回
          </button>

          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
              📦 {supply.name}
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {supply.brand}
            </div>
          </div>

          {/* 緊湊的警告提示 */}
          {supply.status === 'low' && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '0.5rem', 
              padding: '0.75rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>
                  庫存不足警告
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#991b1b' }}>
                  預計可用 {Math.floor(supply.stock / (supply.weeklyUsage / 7))} 天，建議立即補貨
                </div>
              </div>
            </div>
          )}

          {supply.status === 'expiring' && (
            <div style={{ 
              backgroundColor: '#fefce8', 
              border: '1px solid #fde047',
              borderRadius: '0.5rem', 
              padding: '0.75rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>🟡</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#d97706' }}>
                  即將到期提醒
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#c2410c' }}>
                  效期：{supply.expiryDate}，請優先使用
                </div>
              </div>
            </div>
          )}

          {/* 資訊網格 - 緊湊排版 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            {/* 現有庫存 */}
            <div style={{
              backgroundColor: supply.status === 'low' ? '#fef2f2' : '#f0fdf4',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              border: supply.status === 'low' ? '1px solid #fecaca' : '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                📊 現有庫存
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: supply.status === 'low' ? '#dc2626' : '#059669'
              }}>
                {supply.stock}
                <span style={{ fontSize: '0.875rem', fontWeight: 'normal', marginLeft: '0.25rem' }}>
                  {supply.unit}
                </span>
              </div>
            </div>

            {/* 安全庫存 */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                🛡️ 安全庫存
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {supply.safetyStock}
                <span style={{ fontSize: '0.875rem', fontWeight: 'normal', marginLeft: '0.25rem' }}>
                  {supply.unit}
                </span>
              </div>
            </div>

            {/* 本週用量 */}
            <div style={{
              backgroundColor: '#eff6ff',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                📈 本週用量
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                {supply.weeklyUsage}
                <span style={{ fontSize: '0.875rem', fontWeight: 'normal', marginLeft: '0.25rem' }}>
                  {supply.unit}
                </span>
              </div>
            </div>

            {/* 日均用量 */}
            <div style={{
              backgroundColor: '#f5f3ff',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              border: '1px solid #ddd6fe'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                📅 日均用量
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                {(supply.weeklyUsage / 7).toFixed(1)}
                <span style={{ fontSize: '0.875rem', fontWeight: 'normal', marginLeft: '0.25rem' }}>
                  {supply.unit}
                </span>
              </div>
            </div>
          </div>

          {/* 詳細資訊列表 - 緊湊排版 */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.5rem 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>品牌</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>{supply.brand}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.5rem 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>單位</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>{supply.unit}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.5rem 0'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>效期</span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 500, 
                color: supply.status === 'expiring' ? '#d97706' : '#1f2937'
              }}>
                {supply.expiryDate}
              </span>
            </div>
          </div>

          {/* 補貨建議 - 僅在庫存不足時顯示 */}
          {supply.status === 'low' && (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '2px solid #3b82f6',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem' }}>
                🔄 補貨建議
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.25rem'
              }}>
                <span style={{ fontSize: '0.8125rem', color: '#1e40af' }}>建議補貨量</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e3a8a' }}>
                  {supply.safetyStock * 5}{supply.unit}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.8125rem', color: '#1e40af' }}>預計可用天數</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#dc2626' }}>
                  {Math.floor(supply.stock / (supply.weeklyUsage / 7))}天 ⚠️
                </span>
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="form-actions">
            <button 
              onClick={() => setShowOrderForm(true)}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              🛒 立即補貨
            </button>
            <button className="btn btn-secondary">
              📊 匯出報表
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 主頁面 - 替換後的內容
  return (
    <div className="space-y-4">
      

      {/* 1. 跨科室庫存調撥 (修改: 調整內邊距) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={20} style={{ color: 'var(--color-earth-medium)' }} /> 跨科室庫存調撥
          </h3>
          <span className="card-subtitle">當前病房：{mockData.nurse.ward}</span>
        </div>
        <p className="card-subtitle" style={{ marginBottom: '1rem' }}>當本單位缺貨時，可快速向其他單位調借</p>

        <div className="space-y-3">
          {/* 本科室向外調借 (缺貨列表) */}
          {crossDepartmentData.map((item, idx) => (
            <div key={idx} className="p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--color-sand)', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div className="font-semibold">{item.name} {item.spec}</div>
                <span className="status-badge" style={{ background: 'rgba(184, 120, 96, 0.1)', color: 'var(--color-rust)' }}>本單位缺貨</span>
              </div>
              
              {item.borrowStatus.map((status, statusIdx) => (
                <div key={statusIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', padding: '0.25rem 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {status.dept}：庫存{status.stock}（{status.quantity}{item.units}）
                  </span>
                  <button className="btn btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem', backgroundColor: '#449CE7', borderColor: '#449CE7' }}>
                    申請調借
                  </button>
                </div>
              ))}
            </div>
          ))}

          {/* 接收到的調借請求 (修改: 調整內邊距並顯示本地庫存) */}
          {incomingRequests.map((req, idx) => (
            <div key={`req-${idx}`} className="p-4" style={{ background: 'rgba(139, 154, 142, 0.1)', border: '1px solid var(--color-success)', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-semibold" style={{ fontSize: '0.9375rem' }}>{req.fromDept} 向你們調借</div>
                  <div className="card-subtitle" style={{ marginTop: '0.25rem' }}>
                    {req.item} {req.spec} × {req.quantity}{req.unit} 
                    <span style={{ marginLeft: '0.5rem', fontWeight: 500, color: 'var(--color-earth-dark)' }}> 
                        (本科室庫存: {getLocalStock(req.localSupplyId)})
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem', backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                    同意
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}>
                    拒絕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 2. 效期智慧管理 (修改: 只顯示紅黃色，並有展開功能，調整內邊距) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} style={{ color: 'var(--color-ochre)' }} /> 效期智慧管理
          </h3>
          {/* 展開/收合按鈕 */}
          {attentionItems.length > initialDisplayCount && (
            <button 
              onClick={() => setShowAllExpiry(!showAllExpiry)}
              className="btn btn-secondary" 
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}
            >
              {showAllExpiry ? '收起注意物料' : `查看全部需注意 (${attentionItems.length}項)`}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
            {displayedExpiryItems.length > 0 ? (
                displayedExpiryItems.map((item, idx) => (
                    <div 
                        key={idx} 
                        // 調整內邊距 p-3 -> p-4 (1rem)
                        className="p-4" 
                        style={{ 
                            background: item.status === 'expiring' ? 'rgba(184, 120, 96, 0.08)' : 'rgba(212, 165, 116, 0.08)', 
                            border: item.status === 'expiring' ? '1px solid var(--color-rust)' : '1px solid var(--color-ochre)', 
                            borderRadius: '0.5rem' 
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {item.name} {item.spec}
                            </div>
                            {item.status === 'expiring' && (
                                <button className="btn btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}>
                                    優先使用
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.875rem', color: item.status === 'expiring' ? 'var(--color-rust)' : 'var(--color-ochre)' }}>
                                {item.status === 'expiring' && (
                                    <>
                                        ⚠️ 效期剩{item.expiryDays}天 - 數量：{item.stock}{item.unit}
                                    </>
                                )}
                                {item.status === 'warning' && (
                                    <>
                                        效期剩{item.expiryDays}天 - 數量：{item.stock}{item.unit}
                                    </>
                                )}
                            </div>
                            {item.status === 'warning' && <span style={{ fontSize: '1.5rem', color: 'var(--color-ochre)' }}>⏰</span>}
                            
                        </div>
                        <div className="card-subtitle" style={{ marginTop: '0.25rem' }}>
                            {item.note}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-success)', background: 'rgba(139, 154, 142, 0.1)', borderRadius: '0.5rem' }}>
                    ✅ 目前無效期需特別關注的物料。
                </div>
            )}
            
            {/* 顯示「查看全部」後的剩餘項目計數 */}
            {!showAllExpiry && attentionItems.length > initialDisplayCount && (
                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    ... 還有 {attentionItems.length - initialDisplayCount} 項需注意的物料未顯示。
                </div>
            )}
        </div>
      </div>


      {/* 3. 完整庫存 (新增標題、圖例、搜尋和篩選) */}
      <div className="card">
        {/* 新增標題和補貨按鈕 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <List size={20} style={{ color: 'var(--color-moss)' }} /> 完整庫存列表
          </h3>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}
          >
            📊 匯出報表
          </button>
        </div>
        
        {/* [新增] 顏色說明圖例 */}
        <div style={{ 
            fontSize: '0.8125rem', 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem' // 在圖例和搜尋框之間增加間距
        }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ef4444', // 庫存不足 (low)
                    display: 'inline-block'
                }}></span>
                紅色：庫存不足
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f59e0b', // 即將到期 (expiring)
                    display: 'inline-block'
                }}></span>
                黃色：即將到期
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#10b981', // 正常 (normal)
                    display: 'inline-block'
                }}></span>
                綠色：正常
            </span>
        </div>

        {/* 搜尋和篩選功能 */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="search-container" style={{ flex: 2, marginBottom: 0 }}>
                <Search className="search-icon" size={20} />
                <input 
                    type="text" 
                    placeholder="搜尋物料名稱或條碼"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* 種類篩選下拉式選單 */}
            <select
                className="form-select"
                style={{ flex: 1, paddingLeft: '0.75rem' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>
                        {categoryMap[cat] || cat}
                    </option>
                ))}
            </select>
        </div>

        <div className="space-y-2">
          {filteredSupplies.map(supply => (
            <button
              key={supply.id}
              onClick={() => setSelectedSupply(supply.id)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              className="supply-item" // 使用原有的供應物料樣式
            >
              {/* 狀態指示點 */}
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: supply.status === 'low' ? '#ef4444' : supply.status === 'expiring' ? '#f59e0b' : '#10b981',
                flexShrink: 0
              }}></div>

              {/* 主要內容 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '0.9375rem', 
                  fontWeight: 500, 
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}>
                  {supply.name}
                </div>
                <div style={{ 
                  fontSize: '0.8125rem', 
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{supply.brand}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                  <span>庫存 {supply.stock}{supply.unit}</span>
                </div>
              </div>

              {/* 右側箭頭 */}
              <div style={{ flexShrink: 0 }}>
                <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
              </div>
            </button>
          ))}
        </div>
        {filteredSupplies.length === 0 && (
             <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                找不到符合條件的物料。
            </div>
        )}
      </div>
      
      
    </div>
  );
};

export default SuppliesPage;