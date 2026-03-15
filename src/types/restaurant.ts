export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  gardenId: number;
  logo?: string;
  phone?: string;
  deliveryNote?: string;
  menu: MenuItem[];
}
