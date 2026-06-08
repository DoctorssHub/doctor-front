import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type SectionTitleProps = {
  icon: string | StaticImport;
  title: string;
};

export function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex gap-2 items-center">
      <Image
        alt={`${title} icon`}
        src={icon}
        height={24}
        width={24}
      />

      <h2 className="text-[20px] font-semibold tracking-normal text-(--color-text-primary)">
        {title}
      </h2>
    </div>
  );
}
