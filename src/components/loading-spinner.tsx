type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({ label = "처리 중" }: LoadingSpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      <span>{label}</span>
    </span>
  );
}
