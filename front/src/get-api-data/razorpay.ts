'use server';

import axiosInstance from "@/lib/axios";

export async function createRazorpayOrderAction(salesOrderId: string, amount: number) {
    try {
        const response = await axiosInstance.post("/api/method/myecom.api.razorpay.create_order", {
            sales_order_id: salesOrderId,
            amount: amount.toString()
        });
        return response.data.message;
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        throw new Error("Failed to create Razorpay order");
    }
}

export async function verifyRazorpayPaymentAction(razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string, salesOrderId: string) {
    try {
        const response = await axiosInstance.post("/api/method/myecom.api.razorpay.verify_payment", {
            razorpay_payment_id: razorpayPaymentId,
            razorpay_order_id: razorpayOrderId,
            razorpay_signature: razorpaySignature,
            sales_order_id: salesOrderId
        });
        return response.data.message;
    } catch (error) {
        console.error("Razorpay Payment Verification Error:", error);
        throw new Error("Failed to verify payment");
    }
}
