'use server';

import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';
import { CartItem } from '@/types/cart';

const getSid = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('user_session')?.value;
}

export async function getEcomCustomersAction(user_email: string) {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.checkout.get_ecom_customers",
            { user_email }, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error in getEcomCustomersAction:", error);
        throw new Error("Failed to get e-commerce customers.");
    }
}

export async function createEcomCustomerAction(customerData: { user_email: string, full_name: string, mobile_no: string, address: string, city: string, state: string, pin_code: string }) {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.checkout.create_ecom_customer",
            customerData, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error in createEcomCustomerAction:", error);
        throw new Error("Failed to create e-commerce customer.");
    }
}

export async function updateEcomCustomerAction(customerData: { ecom_customer_name: string, full_name?: string, mobile_no?: string, address?: string, city?: string, state?: string, pin_code?: string }) {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.checkout.update_ecom_customer",
            customerData, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error in updateEcomCustomerAction:", error);
        throw new Error("Failed to update e-commerce customer.");
    }
}

export async function createSalesOrderAction(data: { cart_data: CartItem[], ecom_customer_name: string, user_email: string }) {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.checkout.create_sales_order",
            data, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error in createSalesOrderAction:", error);
        throw new Error("Failed to create sales order.");
    }
}

export async function createPaymentAction(data: { sales_order_id: string, payment_method: string, transaction_id: string }) {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.payment.create_payment",
            data, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error in createPaymentAction:", error);
        throw new Error("Failed to create payment.");
    }
}
