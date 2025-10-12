"use client";

import { SearchIcon } from "lucide-react";
import { useState, useEffect, forwardRef, useRef, useCallback } from "react";
import { useDebounce } from "@/redux/useDebounce";
import { useResetOnNavigation } from "@/redux/useResetOnNavigation";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  name: string;
  productSlug: string;
  image: string;
  productName: string;
  price: number;
  discountedPrice?: number;
}

interface SearchBoxProps {
  className?: string;
  onFocus?: () => void;
  autoFocus?: boolean;
  isParentSearchOpen?: boolean; 
}

const SearchBox = forwardRef<HTMLDivElement, SearchBoxProps>(
  ({ className = "", onFocus, autoFocus = false, isParentSearchOpen }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
      if (isParentSearchOpen === false && searchQuery !== "") {
        setSearchQuery("");
      }
    }, [isParentSearchOpen, searchQuery]);

    const { currency } = useAppSelector((state) => state.settingsReducer);

    const debouncedQuery = useDebounce(searchQuery, 300);
    const searchInputRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const resetSearch = useCallback(() => {
      setSearchQuery("");
      setIsDropdownOpen(false);
    }, []);
    useResetOnNavigation(resetSearch);

  
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
      const placeholders = [
        "Type Here to Search...",
        "Search for Electronics...",
        "Find Gift Items...",
        "Discover Home Essentials...",
        "Explore Kids Items & Toys...",
      ];
      const handleTyping = () => {
        const current = placeholders[placeholderIndex];
        if (isDeleting) {
          setCurrentPlaceholder(current.substring(0, currentPlaceholder.length - 1));
          setTypingSpeed(75);
        } else {
          setCurrentPlaceholder(current.substring(0, currentPlaceholder.length + 1));
          setTypingSpeed(150);
        }
        if (!isDeleting && currentPlaceholder === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && currentPlaceholder === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      };
      const timer = setTimeout(handleTyping, typingSpeed);
      return () => clearTimeout(timer);
    }, [currentPlaceholder, isDeleting, placeholderIndex, typingSpeed]);

    useEffect(() => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setIsDropdownOpen(false);
        return;
      }

      const fetchResults = async () => {
        setIsLoading(true);
        setIsDropdownOpen(true);
        try {
          const response = await fetch(`/api/search?query=${debouncedQuery}`);
          const data: SearchResult[] = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
          setResults([]);
        }
        setIsLoading(false);
      };

      fetchResults();
    }, [debouncedQuery]);

    // Effect to handle clicks outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchInputRef.current &&
          !searchInputRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div ref={ref} className={`relative ${className}`}>
        <div ref={searchInputRef} className="relative flex w-full items-center gap-3 rounded-[20px] border border-solid border-gray-300_01 bg-lime-50_01 px-4 py-2 h-9">
          <input
            className="w-full text-sm font-light text-gray-700_02 outline-none bg-transparent"
            type="text"
            placeholder={currentPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              onFocus?.();
              if (searchQuery.length > 1) setIsDropdownOpen(true);
            }}
            autoComplete="off"
            autoFocus={autoFocus}
          />
          <SearchIcon className="h-4 w-4 text-gray-500" />
        </div>

        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto min-h-[100px] py-2">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              results.map((product) => {
                const hasDiscount =
                  product.discountedPrice && product.discountedPrice < product.price;
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((product.price - product.discountedPrice!) / product.price) * 100
                    )
                  : 0;

                return (
                  <Link
                    key={product.name}
                    href={`/products/${product.productSlug}`}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <Image
                      src={product.image}
                      alt={product.productName || 'Product Image'}
                      width={40}
                      height={40}
                      className="object-cover rounded-md"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{product.productName}</p>
                      {hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-800">
                            {currency}
                            {product.discountedPrice}
                          </p>
                          <del className="text-xs text-gray-500">
                            {currency}
                            {product.price}
                          </del>
                          <p className="text-xs font-bold text-green-600">
                            - {discountPercent}% Off
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {currency}
                          {product.price}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">No products found for &quot;{debouncedQuery}&quot;</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

SearchBox.displayName = "SearchBox";
export default SearchBox;
