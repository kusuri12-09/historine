import type { ApiResponse } from "@/types/api/common";

export type TimelineResponseData = {
  id: number;
  year: number;
  type: "KOREA" | "WORLD";
  content: string;
  status: "active" | "hidden" | "deleted";
};

export type GetTimelinesResponse = ApiResponse<TimelineResponseData[]>;

export type GetTimelineResponse = ApiResponse<TimelineResponseData>;
