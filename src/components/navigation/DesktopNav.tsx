import { InternalLink as Link } from "@/components/ui/InternalLink";
import { primaryNav } from "@/config/navigation";

export function DesktopNav() {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
      {primaryNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-foreground/80 transition-colors duration-150 hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
