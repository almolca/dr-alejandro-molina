import type { InsightVideo } from "@/content/insights/articles";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Optional physician-video block for an Insights article — Phase C.
 * Renders nothing when the article has no `video` field, exactly like
 * `AuthorityStripSection`'s empty-metrics guard. Never fabricates a
 * thumbnail or embed — if `thumbnailUrl` is absent, the card falls back
 * to a plain text link rather than a broken image.
 */
export function ArticleVideoBlock({ video }: { video?: InsightVideo }) {
  if (!video) return null;

  return (
    <Reveal>
      <div className="border-y border-border py-8">
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">
          Watch
        </p>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          {video.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-auto w-full max-w-xs rounded-md border border-border sm:w-48"
            />
          )}
          <div>
            <h3 className="font-display text-lg text-foreground underline decoration-accent-strong underline-offset-4">
              {video.title}
            </h3>
            {video.summary && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {video.summary}
              </p>
            )}
            {video.durationMinutes && (
              <p className="mt-1 text-xs text-muted-foreground">
                {video.durationMinutes} min
              </p>
            )}
          </div>
        </a>
        {video.transcript && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Read transcript
            </summary>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {video.transcript}
            </p>
          </details>
        )}
      </div>
    </Reveal>
  );
}
