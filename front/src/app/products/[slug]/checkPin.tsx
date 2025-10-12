"use client";

import { useState, useEffect } from "react";
import { getDeliveryTime } from "@/get-api-data/pincode";
import type { PincodeData, PincodeResponse } from "@/types/pincode";
import { motion } from "framer-motion";
import { LocationPinIcon, CloseIcon, CheckIcon, CashOnDeliveryIcon, AlertIcon } from "@/icon";

export default function CheckPin() {
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState<PincodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkSavedPincode = async () => {
      const savedPincode = localStorage.getItem("pincode");
      if (savedPincode) {
        await handleCheck(savedPincode);
      }
      setInitialLoading(false);
    };

    checkSavedPincode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = async (pincodeToCheck?: string) => {
    const code = pincodeToCheck || pincode;
    setError("");
    setDelivery(null);

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    const result: PincodeResponse = await getDeliveryTime(code);
    setLoading(false);

    if ("error" in result) {
      setError(result.error || "Something went wrong. Please try again.");
      localStorage.removeItem("pincode");
    } else if (Object.keys(result).length > 0) {
      setDelivery(result as PincodeData);
      localStorage.setItem("pincode", code);
      setPincode("");
      setIsExpanded(true);
    } else {
      setError("Could not retrieve delivery information.");
      localStorage.removeItem("pincode");
    }
  };

  const clearPincode = () => {
    localStorage.removeItem("pincode");
    setDelivery(null);
    setIsExpanded(false);
    setPincode("");
    setError("");
  };

  if (initialLoading) {
    return (
      <div className="mt-4 bg-white rounded-lg border border-gray-300 shadow-sm w-full lg:max-w-sm p-3">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      {!delivery || !isExpanded ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-300 shadow-sm w-full lg:max-w-sm"
        >
          <div className="flex items-center p-3 gap-2">
            <LocationPinIcon className="h-4 w-4 text-gray-400" />
            <div className="relative flex-grow">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleCheck();
                  }
                }}
                placeholder="Enter delivery pincode"
                className="w-full border-0 px-0 py-0 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                maxLength={6}
              />
              {pincode && (
                <button
                  onClick={() => setPincode("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleCheck()}
              disabled={loading}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
            >
              {loading ? (
                <span className="text-xs">Checking...</span>
              ) : (
                <span>Check</span>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        delivery &&
        isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-lg border border-gray-300 p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-2">
                  <p className="text-base font-medium text-gray-800">
                    Delivery by {delivery.deliveryDate}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {delivery.city}, {delivery.state}
                  </p>
                </div>
              </div>
              <button
                onClick={clearPincode}
                className="text-base text-blue-600 hover:text-blue-700 font-medium"
              >
                Change
              </button>
            </div>

            {delivery.codAvailable ? (
              <div className="mt-2 ml-2 flex items-center">
                <CashOnDeliveryIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  Cash on Delivery available
                </span>
              </div>
            ) : null}

            {!delivery.serviceable && (
              <div className="mt-2 flex items-center">
                <AlertIcon className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-xs text-red-600">Not serviceable</span>
              </div>
            )}

            {delivery.extraInfo && (
              <p className="text-xs ml-3 text-gray-600 mt-1 italic">
                <span className="text-red-500 mr-1">*</span>
                {delivery.extraInfo}
              </p>
            )}
          </motion.div>
        )
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 ml-2 text-base font-medium text-red-600"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
