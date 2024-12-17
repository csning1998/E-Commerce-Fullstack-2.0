import express, { NextFunction, Response, Router } from "express";
import moment from "moment";
import {
    Merchant,
    CreditOneTimePayment,
    ATMPayment,
    TradeInfoQuery,
    CreditCardPeriodAction,
} from "node-ecpay-aio";

const router: Router = express.Router();

router.get(
    "/:orderId",
    async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Step 1: 建立特店
            const merchant = new Merchant("Test", {
                // 生產環境請記得將 'Test' 改成 'Production'
                MerchantID: "3002607",
                HashKey: "pwFHCqoQZGmho4w6",
                HashIV: "EkRm7iFT261dpevs",
                ReturnURL: "https://api.e-commerce-miia.com/",
                // OrderResultURL: 'http://localhost:5173/'
            });

            // [使用情境一] Step 2: 特店建立 payment => Step 3: 前端重導至綠界結帳
            // @ts-ignore
            const payment = merchant.createPayment(CreditOneTimePayment, {
                MerchantTradeNo: "EMCMIIA" + new Date().getTime(),
                // MerchantTradeDate: '2022/04/25 18:26:12',
                MerchantTradeDate: moment().format("YYYY/MM/DD HH:mm:ss"),
                TotalAmount: 500,
                TradeDesc:
                    "Imagine you have made a purchase",
                ItemName: "Something",
            });
            const htmlRedirectPostForm: string = await payment.checkout();
            res.send(htmlRedirectPostForm);
        } catch (error) {
            next(error);
        }
    },
);

export default router;
