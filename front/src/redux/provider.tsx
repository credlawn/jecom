"use client";

import { makeStore, AppStore, RootState } from "./store"; 
import { Provider } from "react-redux";
import React, { useRef } from "react";

export function ReduxProvider({ children, preloadedState }: { children: React.ReactNode; preloadedState?: Partial<RootState> }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    
    storeRef.current = makeStore(preloadedState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
