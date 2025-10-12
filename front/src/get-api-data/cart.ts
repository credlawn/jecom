'use server';

import axiosInstance from "@/lib/axios";
import { CartItem } from "@/types/cart";
import { cookies } from 'next/headers';

const getSid = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('user_session')?.value;
}


export async function getCartAction(identifiers: { user?: string; guestUid?: string }): Promise<CartItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.cart.get_cart_items",
            identifiers, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {console.error("Error in getCartAction:", error);
        return [];
            
    }
}

export async function addToCartAction(identifiers: { user?: string; guestUid?: string }): Promise<CartItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.cart.add_to_cart",
            identifiers, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {console.error("Error in addToCartAction:", error);
        throw new Error("Failed to add item to cart.");
            
    }
}

export async function removeFromCartAction(identifiers: { user?: string; guestUid?: string }): Promise<CartItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.cart.remove_from_cart",
            identifiers, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {console.error("Error in removeFromCartAction:", error);
        throw new Error("Failed to add item from cart.");
            
    }
}

export async function updateQuantityAction(payload: { productId: string; qty: number; user?: string; guestUid?: string }): Promise<CartItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.cart.update_cart_quantity",
            payload, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {console.error("Error in updateQuantityAction:", error);
        throw new Error("Failed to update quantity.");
    }
}

export async function clearCartAction(payload: { user?: string; guestUid?: string }): Promise<CartItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post("/api/method/myecom.api.cart.clear_cart",
            payload, { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {console.error("Error in clearCartAction:", error);
        throw new Error("Failed to clear cart.");
    }
}







