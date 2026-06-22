type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <section className="pb-16 pt-20">
      <div className="mb-4 text-[15px] font-bold tracking-[0.35em] text-historine-side">
        {eyebrow}
      </div>
      <h1 className="text-[42px] font-extrabold leading-tight text-historine-text md:text-[48px]">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-8 text-historine-muted">{description}</p>
    </section>
  );
}
