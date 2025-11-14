import React, { useState } from 'react';
import { Camera, Search, Package, ChevronRight, X, AlertTriangle, Plus, Trash2 } from 'lucide-react';

const SuppliesPage = ({ supplies }) => {
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [manualItems, setManualItems] = useState([]);

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
              alert('掃描成功！已記錄使用');
              setShowScanner(false);
            }}
            className="btn btn-primary btn-full"
          >
            模擬掃描成功
          </button>
        </div>
      </div>
    );
  }

  // 補貨申請表單 - 優化版
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

          <form onSubmit={(e) => { e.preventDefault(); alert('補貨申請已送出'); setShowOrderForm(false); setManualItems([]); }}>
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

  // 物料詳情頁 - 優化版，更緊湊
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

  // 主頁面
  const lowStockCount = supplies.filter(s => s.status === 'low').length;
  const expiringCount = supplies.filter(s => s.status === 'expiring').length;

  return (
    <div className="space-y-4">
      {/* 本週用量統計 - 橫條圖風格，新增其他類別 */}
      <div className="card">
        <h3 className="card-title">本週用量統計</h3>
        <div style={{ marginTop: '1rem' }}>
          {/* 注射器類 */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>💉 注射器類</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B6560' }}>43支</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '68%', 
                height: '100%', 
                backgroundColor: '#6B6560',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* 敷料類 */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>🩹 敷料類</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B6560' }}>20片</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '32%', 
                height: '100%', 
                backgroundColor: '#8B7966',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* 檢驗用品 */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>🧪 檢驗用品</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B6560' }}>10支</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '16%', 
                height: '100%', 
                backgroundColor: '#B8A690',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* 其他類別 - 新增 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>📦 其他類別</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B6560' }}>7件</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '11%', 
                height: '100%', 
                backgroundColor: '#D4C4B0',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 需要關注 - 卡片加寬 */}
      {(lowStockCount > 0 || expiringCount > 0) && (
        <div className="card">
          <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
            <AlertTriangle style={{ color: '#f97316', marginRight: '0.5rem' }} size={20} />
            需要關注
          </h3>
          
          {lowStockCount > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#991b1b', marginBottom: '0.5rem' }}>🔴 庫存不足 ({lowStockCount}項)</div>
              <div className="space-y-2">
                {supplies.filter(s => s.status === 'low').map(supply => (
                  <button
                    key={supply.id}
                    onClick={() => setSelectedSupply(supply.id)}
                    style={{
                      width: '100%',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.borderColor = '#f87171';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1f2937' }}>{supply.name}</span>
                      <ChevronRight size={16} style={{ color: '#9ca3af' }} />
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                      剩{supply.stock}{supply.unit} / 安全量{supply.safetyStock}{supply.unit}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {expiringCount > 0 && (
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c2410c', marginBottom: '0.5rem' }}>🟡 即將到期 ({expiringCount}項)</div>
              <div className="space-y-2">
                {supplies.filter(s => s.status === 'expiring').map(supply => (
                  <button
                    key={supply.id}
                    onClick={() => setSelectedSupply(supply.id)}
                    style={{
                      width: '100%',
                      backgroundColor: '#fefce8',
                      border: '1px solid #fde047',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef3c7';
                      e.currentTarget.style.borderColor = '#fbbf24';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#fefce8';
                      e.currentTarget.style.borderColor = '#fde047';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1f2937' }}>{supply.name}</span>
                      <ChevronRight size={16} style={{ color: '#9ca3af' }} />
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                      效期：{supply.expiryDate}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 完整庫存 - 移除右側狀態標籤，添加圖例說明 */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>📋 完整庫存列表</h3>
            <button 
              onClick={() => setShowOrderForm(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              🛒 申請補貨
            </button>
          </div>
          {/* 圖例說明 */}
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '0.5rem'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: '#ef4444',
                display: 'inline-block'
              }}></span>
              紅色-庫存不足
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: '#f59e0b',
                display: 'inline-block'
              }}></span>
              黃色-即將到期
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: '#10b981',
                display: 'inline-block'
              }}></span>
              綠色-正常
            </span>
          </div>
        </div>
        
        <div className="search-container" style={{ marginBottom: '1rem' }}>
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="搜尋物料名稱或條碼"
            className="search-input"
          />
        </div>

        <div className="space-y-2">
          {supplies.map(supply => (
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
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
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
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {supply.name}
                </div>
                <div style={{ 
                  fontSize: '0.8125rem', 
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{supply.brand}</span>
                  <span style={{ color: '#d1d5db' }}>•</span>
                  <span>庫存 {supply.stock}{supply.unit}</span>
                </div>
              </div>

              {/* 右側箭頭 - 移除狀態標籤 */}
              <div style={{ flexShrink: 0 }}>
                <ChevronRight size={16} style={{ color: '#d1d5db' }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 浮動掃碼按鈕 */}
      <button 
        onClick={() => setShowScanner(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '1.5rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
        }}
      >
        <Camera size={28} />
      </button>
    </div>
  );
};

export default SuppliesPage;