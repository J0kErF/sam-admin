export type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
}

export type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  tags: [string];
  sizes: [string];
  location: [string];
  price: number;
  quantity: number;  
  createdAt: Date;
  updatedAt: Date;
}

export type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
}

export type OrderItemType = {
  product: ProductType
  location: string;
  size: string;
  quantity: number;
}

export type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
}

export type ReturnedPart = {
  partId: string;           // נקבל אותו כמחרוזת מהשרת
  providerBarcode: string;
  quantity: number;
  price: number;
  reason?: string;
};

export type ReturnForm = {
  providerName: string;
  contactName?: string;
  status: string;
  date?: Date;                 // אופציונלי כי נוצר אוטומטית בצד השרת
  photos: string[];
  parts: ReturnedPart[];
};
