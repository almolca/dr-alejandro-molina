"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { getPrimaryNav, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

const linkClassName =
  "whitespace-nowrap text-[0.8125rem] leading-snug font-medium aria-[current=page]:underline underline-offset-8 text-foreground/80 transition-colors duration-150 hover:text-foreground";

/**
 * Click-toggled disclosure, not a hover menu — hover-open across the gap
 * between trigger and panel is a classic flicker/"leave" bug, and a
 * click-only trigger stays fully keyboard- and touch-operable without it
 * (R11 navigation-polish brief: "no hover-only trap").
 */
function DesktopNavDropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Reset during render (not an effect) on route change — the React-recommended
  // pattern for "adjust state when a prop changes" without an extra render pass.
  const [openedForPathname, setOpenedForPathname] = useState(pathname);
  if (pathname !== openedForPathname) {
    setOpenedForPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(linkClassName, "inline-flex items-center gap-0.5")}
      >
        {item.label}
        <ChevronDown
          aria-hidden
          size={13}
          className={cn("shrink-0 transition-transform duration-150 ease-out", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute start-0 top-full z-10 mt-2 w-64 rounded-sm border border-border bg-background py-2 shadow-md"
        >
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-foreground/80 transition-colors duration-150 hover:bg-surface hover:text-foreground"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function DesktopNav({ locale = "en" }: { locale?: "en" | "ar" }) {
  const pathname = usePathname();
  const items = getPrimaryNav(locale);
  return (
    <nav aria-label="Primary" className="hidden items-center gap-1.5 xl:flex 2xl:gap-5">
      {items.map((item) =>
        item.children?.length ? (
          <DesktopNavDropdown
            key={item.href}
            item={item}
            active={pathname === item.href || item.children.some((c) => c.href === pathname)}
          />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={linkClassName}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
