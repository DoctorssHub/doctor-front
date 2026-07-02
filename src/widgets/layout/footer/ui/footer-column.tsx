import Link from "next/link";

type FooterColumnItem = {
  href: string;
  label: string;
};

type FooterColumnProps = {
  className?: string;
  items: FooterColumnItem[];
  title: string;
};

export function FooterColumn({ className = "", items, title }: FooterColumnProps) {
  return (
    <div className={`pt-0 sm:pt-3.5 ${className}`}>
      <h3 className="mb-4 text-[16px] leading-5 font-medium text-(--color-text-primary) uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5 text-[14px] leading-[18px] font-light text-(--color-text-muted)">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              className="transition duration-300 hover:text-(--color-text-primary)"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
