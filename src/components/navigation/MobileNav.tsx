"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { InternalLink as Link } from "@/components/ui/InternalLink";
import { useState } from "react";
import { bookHref, primaryNav } from "@/config/navigation";
import { BookingCta } from "@/components/ui/BookingCta";

/**
 * Accessible mobile drawer (spec §6: "Accessible drawer. No overloaded
 * mega-menu on first implementation."). Built on Radix Dialog for focus
 * trapping, Escape-to-close, and correct aria wiring (spec §30).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-foreground xl:hidden"
        >
          <Menu aria-hidden size={22} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-stone-950/40" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background px-gutter py-6 shadow-xl"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-lg">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-foreground"
              >
                <X aria-hidden size={22} />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Primary" className="mt-10 flex flex-col gap-6">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-display text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={bookHref}
              onClick={() => setOpen(false)}
              className="text-2xl font-display text-foreground"
            >
              Book
            </Link>
          </nav>

          <div className="mt-auto pt-10">
            <BookingCta
              sourcePage="mobile-nav"
              ctaPosition="mobile-drawer"
              size="lg"
              className="w-full"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
