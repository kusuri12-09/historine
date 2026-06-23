export type ApiResponse<TData> = {
  success: boolean;
  data: TData | null;
  error: string | null;
};
