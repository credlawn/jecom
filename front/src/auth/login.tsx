"use server";

import axios from "axios";
import axiosInstance from "@/lib/axios";
import { cookies } from 'next/headers';

interface LoginProps {
  email: string;
  password: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  sid?: string;
  error?: string;
}

interface CurrentUser {
  email: string;
  full_name: string;
  mobile: string;
}

export async function loginUser({ email, password }: LoginProps): Promise<ApiResponse> {
  try {
    const res = await axiosInstance.post("/api/method/login", { usr: email, pwd: password });
    const data = res.data;
    const setCookieHeader = res.headers["set-cookie"] || res.headers["Set-Cookie"];
    const sid = Array.isArray(setCookieHeader)
      ? setCookieHeader.find(cookie => cookie.includes("sid="))?.match(/sid=([^;]+)/)?.[1]
      : setCookieHeader?.match(/sid=([^;]+)/)?.[1];

    return { success: true, data, sid };
  } catch (error: unknown) {
    let message = "Unknown error";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, error: message };
  }
}

export async function logoutUser(): Promise<ApiResponse> {
  try {
    await axiosInstance.post("/api/method/logout");
    return { success: true };
  } catch (error: unknown) {
    let message = "Unknown error";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, error: message };
  }
}

export async function checkCurrentUser(): Promise<ApiResponse<CurrentUser> & { isLoggedin: boolean }> {
  try {
    const cookieStore = await cookies();
    const sidCookie = cookieStore.get('user_session')?.value;

    if (!sidCookie) {
      return {
        isLoggedin: false,
        success: false,
        error: "User not Logged in",
      };
    }

    const response = await axiosInstance.get("/api/method/myecom.api.user.user_details", {
      params: { sid: sidCookie }
    });

    const { loggedIn, details, error } = response.data.message || {};

    if (!loggedIn) {
      return {
        isLoggedin: false,
        success: false,
        error: error || "User not Logged in",
      };
    }

    const { email, full_name, mobile } = details || {};

    return {
      isLoggedin: true,
      success: true,
      data: {
        email,
        full_name,
        mobile,
      },
    };
  } catch (error: unknown) {
    let message = "Unknown error";

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        return {
          isLoggedin: false,
          success: false,
          error: "User not Logged in",
        };
      }
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      isLoggedin: false,
      success: false,
      error: message,
    };
  }
}

