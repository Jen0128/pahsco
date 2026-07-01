# 🏥 Pahsco 護理智慧交班與病房管理系統

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)]()

> 這是一個專為護理人員設計的臨床管理系統雛形，旨在簡化繁瑣的交班流程、提升醫材管理效率，並提供清晰的病患狀態視覺化介面。

🔗 **[點此查看線上 Live Demo](https://pahsco.vercel.app)** 

---

## ✨ 核心功能 (Features)

* **🔄 智慧交班系統 (Smart Handover)**
    * 自動統整病患清單，將交接事項依照輕重緩急分類（需觀察、需處理、需補貨）。
    * 支援護理師針對個別病患手動新增補充筆記。
* **📦 醫材與物料管理 (Supplies Management)**
    * 追蹤各病床的醫材使用狀況與消耗進度。
    * 庫存低於安全水位時自動警示，方便下一班護理人員進行補貨。
* **📸 臨床拍照記錄 (Photo Capture)**
    * 支援快速啟動相機進行患部或傷口拍攝記錄，並可即時上傳與標註。
* **📇 病患資訊儀表板 (Patient Profile)**
    * 整合病患基本資料、今日排程與醫囑，提供直覺的 UI 介面。

## 🛠️ 技術棧 (Tech Stack)

* **前端框架:** React.js (Create React App)
* **樣式與 UI:** 原生 CSS3, `lucide-react` (圖示庫)
* **部署平台:** Vercel

## 🚀 本地端安裝與執行 (Getting Started)

如果您希望在本地端運行此專案，請依照以下步驟操作：

1. **Clone 專案到本地端**
   ```bash
   git clone [https://github.com/Jen0128/pahsco.git](https://github.com/Jen0128/pahsco.git)

2. **進入專案目錄**
   ```bash
   cd pahsco

3. **安裝相依套件**
   ```bash
   npm install

4. **啟動開發伺服器**
   ```bash
   npm start
伺服器啟動後，請打開瀏覽器並前往 http://localhost:3000 預覽。
