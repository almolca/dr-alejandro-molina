import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="font-display text-2xl text-foreground">Not found</h1>
      <p className="text-sm text-muted-foreground">
        The item you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link href="/admin" className="text-sm font-medium text-foreground underline underline-offset-4">
        Back to admin
      </Link>
    </div>
  );
}
