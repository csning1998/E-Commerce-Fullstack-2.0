// // https://github.com/simenkid/node-ecpay-aio/wiki/API-Document#10-%E7%AF%84%E4%BE%8B

// import {
//     Merchant,
//     CreditOneTimePayment,
//     ATMPayment,
//     TradeInfoQuery,
//     CreditCardPeriodAction,
//   } from 'node-ecpay-aio';

//   // Step 1: 建立特店
//   const merchant = new Merchant('Test', {
//     // 生產環境請記得將 'Test' 改成 'Production'
//     MerchantID: '3002607',
//     HashKey: 'pwFHCqoQZGmho4w6',
//     HashIV: 'EkRm7iFT261dpevs',
//     ReturnURL: 'https://api.e-commerce-miia.com/',
//   });

//   // [使用情境一] Step 2: 特店建立 payment => Step 3: 前端重導至綠界結帳

// const payment = merchant.createPayment(CreditOneTimePayment, {});
// const htmlRedirectPostForm = await payment.checkout({
//   // 結帳時給予發票資訊即表示要開立發票
//   RelateNumber: 'rl-123456',
//   TaxType: '1',
//   Donation: '0',
//   Print: '0',
//   InvoiceItemName: '鉛筆|橡皮擦',
//   InvoiceItemCount: '10|2',
//   InvoiceItemWord: '支|顆',
//   InvoiceItemPrice: '12|18',
//   DelayDay: 0,
// });

// // res.send(htmlRedirectPostForm)

// /*
// 請使用以下資訊在測試環境介接綠界金流服務。

// 特店測試資料: 模擬銀行3D驗證
// 特店編號 (MerchantID)：3002607
// 特店後台登入帳號：stagetest3
// 特店後台登入密碼：test1234
// 特店統一編號：00000000
// 串接金鑰 HashKey：pwFHCqoQZGmho4w6
// 串接金鑰 HashIV：EkRm7iFT261dpevs
// 平台商測試資料
// 平台商編號 (PlatformID)：3003008
// 特店後台登入帳號：StageTestV3P
// 特店後台登入密碼：test1234
// 特店統一編號：10608171
// 串接金鑰 HashKey：FCnGLNS7P3xQ2q3E
// 串接金鑰 HashIV：awL5GRWRhyaybq13
// 閘道商測試資料
// 閘道商編號 (MerchantID)：3085779
// 特店後台登入帳號：gatewaytest02
// 特店後台登入密碼：test1234
// 特店統一編號：00000000
// 串接金鑰 HashKey：y6869NBszTuvhSRx
// 串接金鑰 HashIV：BMm7FmX91dE8rpdw
// */
