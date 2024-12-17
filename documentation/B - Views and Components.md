# 專案架構

```text
src
├── App.vue
├── components
│   ├── common
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   ├── Spinner.vue
│   │   └── Pagination.vue
│   │
│   ├── auth
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   │
│   ├── cart
│   │   ├── CartItem.vue
│   │   └── CartSummary.vue
│   │
│   ├── product
│   │   ├── ProductCard.vue
│   │   ├── ProductDetail.vue
│   │   ├── ProductImageSlider.vue
│   │   └── AddToCartButton.vue
│   │
│   ├── user
│   │   ├── UserProfile.vue
│   │   ├── FavoritesList.vue
│   │   └── RecentlyViewed.vue
│   │
│   └── seller
│       ├── SellerDashboard.vue
│       ├── SellerProductList.vue
│       ├── SellerOrderList.vue
│       ├── ProductForm.vue
│       └── OrderStatus.vue
│
└── views
    ├── HomeView.vue
    ├── ProductListView.vue
    ├── ProductDetailView.vue
    ├── CartView.vue
    ├── CheckoutView.vue
    ├── UserProfileView.vue
    ├── FavoritesView.vue
    ├── LoginView.vue
    ├── RegisterView.vue
    ├── SellerDashboardView.vue
    ├── SellerProductManagementView.vue
    └── SellerOrderManagementView.vue
```

## **`src/components`** 目錄

---

### **`./common`**

這個資料夾包含了常用的元件，這些元件可以在多個頁面中重複使用。

- **Navbar.vue**：網站的導覽列元件，包含網站標誌、搜尋欄、登入/登出按鈕、購物車圖示等。這個元件會出現在所有頁面中，並根據使用者的登入狀態顯示不同內容。
- **Footer.vue**：網站的頁尾元件，通常包含網站資訊、聯絡方式、隱私政策等。這也是一個全域元件，會出現在每個頁面底部。
- **Button.vue**：通用按鈕元件，可接受 `type`、`color`、`size` 等 `props` 來調整外觀，方便在不同場景中重複使用。
- **Input.vue**：通用輸入框元件，可在不同表單中使用，接受 `type`（如 text、password）等 `props`，方便統一樣式和行為。
- **Modal.vue**：彈出視窗元件，用於顯示額外資訊或進行確認操作，例如顯示商品詳細資訊或結帳確認等。該元件通常包含 `open` 和 `close` 方法來控制顯示狀態。
- **Spinner.vue**：載入動畫元件，用於資料載入時的過渡效果，例如在 API 請求時顯示，讓使用者知道系統正在處理請求。
- **Pagination.vue**：分頁元件，用於分頁顯示長列表（如商品列表或訂單列表），接受目前頁碼、總頁數等 `props`，並發出 `pageChange` 事件以便切換頁面。


### **`./auth`**

包含與身份驗證相關的元件，主要用於登入和註冊頁面。

- **LoginForm.vue**：登入表單元件，包括使用者名稱和密碼的輸入框以及登入按鈕，負責處理使用者登入操作，驗證使用者資訊並觸發登入流程。
- **RegisterForm.vue**：註冊表單元件，包括使用者名稱、電子郵件、密碼等輸入框，並進行基本的表單驗證，處理新使用者的註冊。


### **`./cart`**

與購物車相關的元件，用於顯示和管理購物車中的商品。

- **CartItem.vue**：購物車商品項目元件，顯示單個商品在購物車中的詳細資訊，例如圖片、名稱、數量、價格，以及修改數量或刪除該商品的功能。
- **CartSummary.vue**：購物車摘要元件，顯示購物車中的商品總數量和總金額，並包含前往結帳的按鈕，通常位於購物車頁面或購物車彈出視窗的底部。


### **`./product`**

與商品相關的元件，用於展示商品資訊和與商品的互動操作。

- **ProductCard.vue**：商品卡片元件，簡潔展示商品資訊（如圖片、名稱、價格、折扣）的小卡片，通常在商品列表頁面使用。
- **ProductDetail.vue**：商品詳細資訊元件，用於顯示商品的完整資訊，包括圖片、詳細描述、規格、價格和購買選項等，主要用於商品詳情頁面。
- **ProductImageSlider.vue**：商品圖片輪播元件，展示商品的多張圖片，讓使用者可以滑動瀏覽，通常嵌入在 `ProductDetail.vue` 中。
- **AddToCartButton.vue**：加入購物車按鈕元件，通常包含「加入購物車」操作邏輯，並根據加入狀態更新按鈕樣式（例如加入成功後顯示「已加入購物車」）。


### **`./user`**

與使用者相關的元件，用於展示使用者的個人資訊、收藏和最近瀏覽等。

- **UserProfile.vue**：使用者個人資料元件，展示和編輯使用者的個人資訊，包括帳號資料、密碼變更等操作。
- **FavoritesList.vue**：收藏清單元件，顯示使用者收藏的商品和賣家，包含取消收藏和快速存取商品或賣家頁面的功能。
- **RecentlyViewed.vue**：最近瀏覽元件，顯示使用者最近查看過的商品，方便使用者快速返回先前的商品頁面。


### **`./seller`**

賣家專用的管理元件，用於商品和訂單的管理。

- **SellerDashboard.vue**：賣家主畫面元件，展示賣家帳戶的基本資訊和銷售數據，提供快速存取商品和訂單管理頁面的入口。
- **SellerProductList.vue**：賣家商品列表元件，展示賣家所有的商品，並提供上架、下架和編輯商品的操作。
- **SellerOrderList.vue**：賣家訂單列表元件，展示賣家收到的所有訂單，並可根據訂單狀態篩選（如「待處理」、「已出貨」等）。
- **ProductForm.vue**：商品表單元件，用於賣家上架或編輯商品，包含名稱、描述、價格、圖片上傳等輸入框，並執行資料驗證。
- **OrderStatus.vue**：訂單狀態元件，展示訂單的目前狀態（如「已確認」、「已出貨」），賣家可以根據需求更改狀態並通知買家。


## **`src/views` 目錄**

---

包含對應於路由的頁面 Components，每個頁面可以是一個或多個 Components 組成。

- **HomeView.vue**：首頁，展示推薦商品、熱門分類等，通常包含 `Navbar`、`ProductCard` 等。
- **ProductListView.vue**：商品列表頁面，顯示所有商品，可根據類別、價格等篩選，使用 `ProductCard` 元件展示每個商品。
- **ProductDetailView.vue**：商品詳情頁面，展示選定商品的完整資訊，包含 `ProductDetail`、`ProductImageSlider`、`AddToCartButton` 等元件。
- **CartView.vue**：購物車頁面，顯示購物車中的商品和結帳按鈕，使用 `CartItem` 和 `CartSummary` 元件。
- **CheckoutView.vue**：結帳頁面，展示結帳所需的詳細資訊和付款選項，通常會整合 `CartSummary`。
- **UserProfileView.vue**：使用者個人資料頁面，展示和編輯使用者個人資訊，使用 `UserProfile`、`FavoritesList` 和 `RecentlyViewed`。
- **FavoritesView.vue**：使用者收藏頁面，展示收藏的商品和賣家，使用 `FavoritesList`。
- **LoginView.vue** 和 **RegisterView.vue**：分別用於登入和註冊頁面，嵌入 `LoginForm` 和 `RegisterForm`。
- **SellerDashboardView.vue**：賣家主畫面，展示賣家帳戶的基本資訊和快速存取入口，包含 `SellerDashboard`。
- **SellerProductManagementView.vue**：賣家商品管理頁面，展示所有商品列表，使用 `SellerProductList` 和 `ProductForm`。
- **SellerOrderManagementView.vue**：賣家訂單管理頁面，展示所有訂單，使用 `SellerOrderList` 和 `OrderStatus`。