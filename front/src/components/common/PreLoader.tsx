"use client";
import React, { useState, useEffect } from "react";

interface PreLoaderProps {
  color?: string;
}

const PreLoader = ({ color = "#3C50E0" }: PreLoaderProps) => { // Default to blue if no color is provided
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 100);
  }, []);

  return (
    loading && (
      <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-black/20">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-t-transparent" style={{ borderColor: color }}></div>
      </div>
    )
  );
};

export default PreLoader;
