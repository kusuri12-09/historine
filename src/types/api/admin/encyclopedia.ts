import type { ApiResponse } from "@/types/api/common";
import type { EncyclopediaResponseData } from "@/types/api/encyclopedia";

export type CreateEncyclopediaRequest = {
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
};

export type UpdateEncyclopediaRequest = CreateEncyclopediaRequest;

export type UpdateEncyclopediaResponse = ApiResponse<EncyclopediaResponseData>;

export type DeleteEncyclopediaResponse = ApiResponse<EncyclopediaResponseData>;
