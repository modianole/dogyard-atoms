export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular?: boolean;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  items: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  gardenId: number;
  logo?: string;
  phone?: string;
  deliveryNote?: string;
  menu: MenuItem[];
  deals?: Deal[];
}
