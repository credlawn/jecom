"use server";

import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

export async function setSession(sid: string) {
  const cookieStore = await cookies();
  
  
  cookieStore.set("user_session", sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  
  
}

export async function clearSession() {
  const cookieStore = await cookies();
  
  cookieStore.set("user_session", "", {
    path: "/",
    maxAge: 0,
  });
  
}

export async function ensureUid() {
  const cookieStore = await cookies();
  const newUid = uuidv4();
  
  cookieStore.set("uid", newUid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return newUid;
}