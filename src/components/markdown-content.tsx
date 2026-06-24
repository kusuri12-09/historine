import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-5 text-[30px] font-extrabold leading-tight text-historine-text">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-8 text-[24px] font-extrabold leading-tight text-historine-text">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-6 text-[20px] font-extrabold leading-tight text-historine-text">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mb-5 border-l-4 border-historine-side/60 pl-4 text-historine-muted">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-[0.92em] text-historine-side">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-5 overflow-x-auto rounded bg-black/30 p-4 text-[15px] leading-7">
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a
              className="font-extrabold text-historine-main underline underline-offset-4 transition hover:text-[#8BAFDA]"
              href={href}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-extrabold text-historine-text">{children}</strong>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
