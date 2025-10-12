'use server';

import axiosInstance from "@/lib/axios";
import { WishlistItem } from "@/types/wishlist";
import { cookies } from 'next/headers';

const getSid = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('user_session')?.value;
}

export async function getWishlistAction(identifiers: { user?: string; guestUid?: string }): Promise<WishlistItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post(
            "/api/method/myecom.api.wishlist.get_wishlist_items",
            identifiers,
            { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {
        console.error("Error in getWishlistAction:", error);
        return [];
    }
}

export async function addToWishlistAction(payload: { productId: string; user?: string; guestUid?: string }): Promise<WishlistItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post(
            "/api/method/myecom.api.wishlist.add_to_wishlist",
            payload,
            { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {
        console.error("Error in addToWishlistAction:", error);
        throw new Error("Failed to add item to wishlist.");
    }
}

export async function removeFromWishlistAction(payload: { productId: string; user?: string; guestUid?: string }): Promise<WishlistItem[]> {
    try {
        const sid = await getSid();
        const response = await axiosInstance.post(
            "/api/method/myecom.api.wishlist.remove_from_wishlist",
            payload,
            { headers: { Cookie: sid ? `sid=${sid}` : '' } }
        );
        return response.data.message || [];
    } catch (error) {
        console.error("Error in removeFromWishlistAction:", error);
        throw new Error("Failed to remove item from wishlist.");
    }
}
