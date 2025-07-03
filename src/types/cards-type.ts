export interface ICard {
  id: string;
  card_name: string;
  card_number: string;
  card_type: string;
  card_expiry_date: string;
  card_cvv: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  user: string;
}

export interface ICardResponse {
  data: ICard[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ISocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface IUser {
  id: string;
  full_name: string;
  email: string;
}

export interface ApiResponse {
  data: ICard[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetCardsParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  is_deleted?: boolean;
  title?: string;
}
