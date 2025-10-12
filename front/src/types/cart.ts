export interface CartItem {
  product: string;
  productName: string;
  productImage: string;
  price: number;
  qty: number;
  slug: string;
  secondImage?: string;
  priceChanged?: boolean;
  oldPrice?: number;
  deleted?: boolean;
  productRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  unitsSold?: number;
  minPurchaseQty?: number;
  discountedPrice?: number;
  discountPercent?: number;
  discountAmount?: number;
  stock?: number;
  ndText?: string;
  shortDescription?: string;
}