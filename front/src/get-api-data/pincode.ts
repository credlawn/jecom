'use server';

import axiosInstance from "@/lib/axios";
import type { PincodeResponse } from "@/types/pincode";

export const getDeliveryTime = async (pincode: string): Promise<PincodeResponse> => {
  if (!pincode || pincode.length !== 6) {
    return { error: "Please enter a valid 6-digit pincode." };
  }

  try {
    const response = await axiosInstance.get("/api/method/myecom.api.check_pincode.get_delivery_time", {
      params: { pincode },
    });

    return response.data?.message || {};
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching delivery time: ${error.message}`);
    } else {
      console.error("Unknown error occurred:", error);
    }

    return { error: "Something went wrong while fetching delivery time." };
  }
};
