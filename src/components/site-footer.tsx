import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";

export function SiteFooter() {
  return (
    <footer className="border-t border-historine-border bg-historine-bg">
      <div className="mx-auto flex h-24 w-full max-w-[1220px] items-center justify-between px-5">
        <div className="text-sm font-bold tracking-[0.18em] text-historine-muted">HISTORINE</div>
        <IconButton
          aria-label="GitHub"
          href="https://github.com/kusuri12-09/historine"
          rel="noreferrer"
          sx={{
            color: "#9CA3AF",
            "&:hover": {
              backgroundColor: "rgba(114, 152, 199, 0.1)",
              color: "#7298C7"
            }
          }}
          target="_blank"
        >
          <GitHubIcon fontSize="small" />
        </IconButton>
      </div>
    </footer>
  );
}
