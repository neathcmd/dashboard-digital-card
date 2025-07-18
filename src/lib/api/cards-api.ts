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

    // const url = `/card/get-cards-by-admin?is_deleted=false&sortOrder=DESC`;
    // const url = `/card/get-cards?is_deleted=false?${query.toString()}`;
    return await request({
      url: "/card/get-cards-by-admin?is_deleted=false&sortOrder=DESC",
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
  const DELETE_CARD = async (id: string) => {
    return await request({
      url: `/card/delete-card-by-admin/${id}`,
      method: "DELETE",
    });
  };

  return {
    CARDS,
    UPDATE_CARD,
    DELETE_CARD,
  };
};
