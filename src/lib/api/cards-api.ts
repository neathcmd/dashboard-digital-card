import type { ICardResponse } from "@/types/cards-type";
import request from "./request";

type CardQueryParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  email?: string;
};

export const requestCards = () => {
  const CARDS = async ({
    page,
    pageSize,
    sortBy,
    sortOrder,
    email,
  }: CardQueryParams): Promise<ICardResponse> => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
      sortBy,
      sortOrder,
      is_deleted: "false",
    });

    if (email) {
      query.append("email", email);
    }

    const url = `/card/get-cards-by-admin?${query.toString()}`;
    return await request({
      url,
      method: "GET",
    });
  };

  const UPDATE_CARD = async (id: string, isApproved: boolean) => {
    return await request({
      url: `/card/update-status/${id}`, // Replace with your real endpoint
      method: "PUT",
      data: {
        is_approved: isApproved,
      },
    });
  };

  return {
    CARDS,
    UPDATE_CARD,
  };
};
