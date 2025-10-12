'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { selectCartItems, removeFromCart, updateQuantity } from '@/redux/features/cart-slice';
import { CartItem } from '@/types/cart';
import Link from 'next/link';
import { Button } from '@/ui/button';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { selectSettings } from '@/redux/features/settings-slice';
import { selectSession } from '@/redux/features/session-slice';
import { Trash2, Plus, Minus } from 'lucide-react';
import InfoIcon from '@/ui/infoIcon';

const CartItemRow: React.FC<{ item: CartItem; currency: string }> = ({ item, currency }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const session = useAppSelector(selectSession);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (item.priceChanged) {
      setIsShaking(true);
      interval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Animation duration
      }, 5000); // Shake every 5 seconds
    } else {
      setIsShaking(false);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [item.priceChanged]);

  const identifiers = {
    user: session.isLoggedin ? session.user?.email : undefined,
    guestUid: session.uid,
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await dispatch(removeFromCart({ productId: item.product, ...identifiers }));
    } finally {
      setIsRemoving(false);
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (newQty > 0) {
      setLoading(true);
      try {
        await dispatch(updateQuantity({ productId: item.product, qty: newQty, ...identifiers }));
      } finally {
        setLoading(false);
      }
    }
  };

  const newPriceMessage = (
    <div>
      <div>Price has changed from</div>
      <div>
        from{' '}
        <span className="line-through">
          {currency}
          {(item.oldPrice || 0).toFixed(0)}
        </span>{' '}
        to{' '}
        {currency}
        {item.price.toFixed(0)}
      </div>
    </div>
  );

  if (item.deleted) {
    return (
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium italic text-gray-500">{item.productName || 'Deleted Product'}</p>
            <p className="text-red-500 text-sm">This item is no longer available.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isRemoving} className="cursor-pointer">
            <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile View - Card Layout */}
      <div className="md:hidden bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={item.productImage || '/placeholder.svg'}
              alt={item.productName}
              fill
              className="object-cover rounded-md"
              sizes="96px"
            />
          </div>

          {/* Info and Price */}
          <div className="flex-grow flex flex-col">
            <Link href={`/products/${item.slug}`} className="text-sm min-h-[2.5em] cursor-pointer hover:underline block overflow-hidden text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {item.productName}
            </Link>
            <div className="font-semibold text-gray-800 flex items-center mt-1">
              {item.priceChanged && (
                <div className="flex-shrink-0 z-10 inline-flex items-center">
                  <InfoIcon
                    message={newPriceMessage}
                    popupSize="sm"
                    className={`mr-3 ${isShaking ? 'shake-animation' : ''}`}
                    popupClassName={
                      item.price < (item.oldPrice || item.price)
                        ? 'bg-green-100 border border-green-600 text-green-800'
                        : 'bg-yellow-100 border border-yellow-600 text-yellow-800'
                    }
                    iconClassName={
                      item.price < (item.oldPrice || item.price)
                        ? 'text-green-700 h-5 w-5'
                        : 'text-red-700 h-5 w-5'
                    }
                  />
                </div>
              )}
              {currency}{(item.price * item.qty).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          {item.stock === 0 ? (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.qty - 1)} disabled={loading} className="cursor-pointer h-6 w-6">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-semibold text-sm">{item.qty}</span>
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.qty + 1)} disabled={loading} className="cursor-pointer h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button variant="ghost" className="text-red-500 hover:bg-red-50 cursor-pointer" onClick={handleRemove} disabled={isRemoving} size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-6 gap-4 items-center py-2 px-3 border-b">
        <div className="col-span-2 flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={item.productImage || '/placeholder.svg'}
              alt={item.productName}
              fill
              className="object-cover rounded"
              sizes="64px"
            />
          </div>
          <Link href={`/products/${item.slug}`} className="font-medium cursor-pointer hover:underline">
            <span>{item.productName}</span>
          </Link>
        </div>
        <div className="col-span-1 text-center flex items-center justify-center">
          {item.priceChanged && (
            <InfoIcon
              message={newPriceMessage}
              popupSize="sm"
              className={`mr-2 ${isShaking ? 'shake-animation' : ''}`}
              popupClassName={
                item.price < (item.oldPrice || item.price)
                  ? 'bg-green-100 border border-green-600 text-green-800'
                  : 'bg-yellow-100 border border-yellow-600 text-yellow-800'
              }
              iconClassName={
                item.price < (item.oldPrice || item.price)
                  ? 'text-green-700 h-5 w-5'
                  : 'text-red-700 h-5 w-5'
              }
            />
          )}
          {currency}{item.price.toFixed(0)}
        </div>
        <div className="col-span-1 flex justify-center items-center gap-2">
          {item.stock === 0 ? (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(item.qty - 1)}
                disabled={loading}
                className="cursor-pointer h-7 w-7"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{item.qty}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(item.qty + 1)}
                disabled={loading}
                className="cursor-pointer h-7 w-7"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        <div className="col-span-1 text-center font-semibold">
          {currency}{(item.price * item.qty).toFixed(0)}
        </div>
        <div className="col-span-1 text-center">
          <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isRemoving} className="cursor-pointer">
            <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const allCartItems = useAppSelector(selectCartItems);
  const cartItems = allCartItems.filter(item => !item.deleted);
  const { currency } = useAppSelector(selectSettings);
  const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const hasOutOfStockItem = allCartItems.some(item => item.stock === 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-xl text-gray-500 mb-4">Your Cart is Empty</p>
        <Link href="/" passHref>
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="flex flex-col items-end gap-8">
          {/* Cart Items */}
          <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <div className="hidden md:grid grid-cols-6 gap-4 items-center pb-4 border-b font-semibold text-gray-600">
              <div className="col-span-2">Product</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-1 text-center">Subtotal</div>
              <div className="col-span-1 text-center">Action</div>
            </div>
            <div>
              {cartItems.map(item => (
                <CartItemRow key={item.product} item={item} currency={currency} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map(item => (
                  <div key={item.product} className="flex justify-between">
                    <span className="text-gray-600">{item.productName}</span>
                    <span className="font-medium">{currency}{(item.price * item.qty).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">{currency}{grandTotal.toFixed(0)}</span>
              </div>
              <Link href="/checkout" passHref>
                <Button size="lg" className="w-full mt-6" disabled={hasOutOfStockItem}>
                  {hasOutOfStockItem ? (
                    <span className="text-sm">Out of Stock </span>
                  ) : (
                    "Process to Checkout"
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
