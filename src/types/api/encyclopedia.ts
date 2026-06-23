import type { ApiResponse } from "@/types/api/common";

export type EncyclopediaResponseData = {
  id: number;
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
};

export type GetEncyclopediasResponse = ApiResponse<EncyclopediaResponseData[]>;

export type GetEncyclopediaResponse = ApiResponse<EncyclopediaResponseData>;

export type CreateEncyclopediaResponse = ApiResponse<EncyclopediaResponseData>;
