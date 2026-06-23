import type { ApiResponse } from "@/types/api/common";

export type TimelineResponseData = {
  id: number;
  year: number;
  type: "KOREA" | "WORLD";
  content: string;
};

export type GetTimelinesResponse = ApiResponse<TimelineResponseData[]>;

export type GetTimelineResponse = ApiResponse<TimelineResponseData>;
