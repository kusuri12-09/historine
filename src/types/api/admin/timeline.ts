import type { ApiResponse } from "@/types/api/common";
import type { TimelineResponseData } from "@/types/api/timeline";

export type CreateTimelineRequest = {
  year: number;
  type: "KOREA" | "WORLD";
  content: string;
};

export type UpdateTimelineRequest = CreateTimelineRequest;

export type CreateTimelineResponse = ApiResponse<TimelineResponseData>;

export type UpdateTimelineResponse = ApiResponse<TimelineResponseData>;

export type DeleteTimelineResponse = ApiResponse<TimelineResponseData>;
