'use server';

import axiosInstance from "@/lib/axios";

export const recordVisitorAction = async (slug: string, userEmail?: string, visitorId?: string) => {
  const payload = {
    slug,
    user: userEmail,
    visitor_id: visitorId,
  };

  console.log("[recordVisitorAction] Sending payload:", payload);
  try {
    await axiosInstance.get("/api/method/myecom.api.visitors_record.create_or_update_visitor", {
      params: payload,
    });
  } catch (error) {
    console.warn("[recordVisitorAction] Failed to send visitor info", error);
  }
};

export const updateSessionAction = async (slug: string, userEmail?: string, visitorId?: string, timeSpent?: number) => {
  const payload = {
    slug,
    user: userEmail,
    visitor_id: visitorId,
    time_spent: timeSpent,
  };

  console.log("[updateSessionAction] Sending payload:", payload);
  try {
    await axiosInstance.get("/api/method/myecom.api.visitors_record.update_session_time", {
      params: payload,
    });
  } catch (error) {
    console.warn("[updateSessionAction] Failed to update session time", error);
  }
};
