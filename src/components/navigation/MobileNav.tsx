"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { useState } from "react";
import { bookHref, getBookLabel, getPrimaryNav } from "@/config/navigation";
import { BookingCta } from "@/components/ui/BookingCta";

const copy = {
  en: { openMenu: "Open menu", menuTitle: "Menu", closeMenu: "Close menu", ctaLabel: "Book a Consultation" },
  ar: {
    openMenu: "فتح القائمة",
    menuTitle: "القائمة",
    closeMenu: "إغلاق القائمة",
    ctaLabel: "احجز استشارة",
  },
} as const;

/**
 * Accessible mobile drawer (spec §6). `end-0` (logical inset) instead
 * of `right-0` so the drawer opens from the trailing edge in both
 * directions — the leading-edge/trailing-edge convention RTL layouts
 * expect (R9 Phase A spec §6/§29 mobile-nav RTL requirement).
 *
 * `Dialog.Content` gets an explicit `dir`/`lang`: Radix's `Dialog.Portal`
 * renders the drawer directly under `<body>`, outside the `/ar` root's
 * `dir="rtl"` wrapper (`src/app/ar/layout.tsx`), so without this the
 * portaled content silently falls back to the browser default direction
 * (ltr) — flipping the `end-0` inset to the wrong physical edge and
 * reversing the title/close-button order. Found via R9 Phase A task 16
 * RTL QA.
 */
export function MobileNav({ locale = "en" }: { locale?: "en" | "ar" }) {
  const [open, setOpen] = useState(false);
  const t = copy[locale];
  const items = getPrimaryNav(locale);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t.openMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-foreground xl:hidden"
        >
          <Menu aria-hidden size={22} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-stone-950/40" />
        <Dialog.Content
          dir={locale === "ar" ? "rtl" : "ltr"}
          lang={locale}
          className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-background px-gutter py-6 shadow-xl"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-lg">{t.menuTitle}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t.closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-foreground"
              >
                <X aria-hidden size={22} />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Primary" className="mt-6 flex flex-col gap-5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-display text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link href={bookHref} onClick={() => setOpen(false)} className="text-2xl font-display text-foreground">
              {getBookLabel(locale)}
            </Link>
          </nav>

          <div className="mt-auto pt-10">
            <BookingCta sourcePage="mobile-nav" ctaPosition="mobile-drawer" size="lg" className="w-full">
              {t.ctaLabel}
            </BookingCta>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
