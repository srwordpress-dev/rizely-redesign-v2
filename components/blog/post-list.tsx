// Post card, shared by the /blogs grid and the "Keep reading" block under each
// post. Hover motion lives in `.post-card` in app/globals.css.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  articleDate,
  formatDate,
  readingTime,
  mediaUrl,
  type Article,
} from "@/lib/strapi";

export function PostCard({
  post,
  heading: Heading = "h2",
}: {
  post: Article;
  /** h2 on /blogs; h3 under a post's "Keep reading" h2. */
  heading?: "h2" | "h3";
}) {
  const cover = mediaUrl(post.cover?.url);
  const iso = articleDate(post);
  const date = formatDate(iso);

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="post-card group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {cover ? (
        <div className="overflow-hidden">
          <img
            src={cover}
            alt={post.cover?.alternativeText ?? ""}
            className="post-card-cover aspect-[16/9] w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {post.category ? (
          <span className="text-sm font-medium text-primary">{post.category}</span>
        ) : null}
        <Heading className="text-lg font-semibold leading-snug tracking-tight text-foreground text-balance">
          {post.title}
        </Heading>
        {post.excerpt ? (
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-sm text-muted-foreground">
          <span className="flex flex-wrap items-center gap-x-2">
            {date ? <time dateTime={iso ?? undefined}>{date}</time> : null}
            {date ? <span aria-hidden>·</span> : null}
            <span className="whitespace-nowrap">{readingTime(post)} min read</span>
          </span>
          <ArrowRight aria-hidden="true" className="post-card-arrow size-4 shrink-0 text-primary" />
        </div>
      </div>
    </Link>
  );
}

/*
  /blogs (Nov 2026 redesign): the newest post as a wide feature, the rest as
  editorial rows with a hover line and arrow, like the footer links.
*/
export function PostFeature({ post }: { post: Article }) {
  const cover = mediaUrl(post.cover?.url);
  const iso = articleDate(post);
  const date = formatDate(iso);
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="post-feature group grid gap-8 border-t border-hairline pt-10 lg:grid-cols-12 lg:items-center lg:gap-12"
    >
      {cover ? (
        <div className="overflow-hidden rounded-xl border border-border lg:col-span-7">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS image, static export */}
          <img
            src={cover}
            alt={post.cover?.alternativeText ?? ""}
            className="post-card-cover aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}
      <div className={`flex flex-col gap-4 ${cover ? "lg:col-span-5" : "lg:col-span-9"}`}>
        <span className="kicker">{post.category ?? "Latest"}</span>
        <h2 className="text-3xl font-heading font-bold leading-tight tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h2>
        {post.excerpt ? <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p> : null}
        <span className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {date ? <time dateTime={iso ?? undefined}>{date}</time> : null}
          {date ? <span aria-hidden>·</span> : null}
          <span>{readingTime(post)} min read</span>
        </span>
        <span className="blog-more">
          Read it <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export function PostRow({ post }: { post: Article }) {
  const iso = articleDate(post);
  const date = formatDate(iso);
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="post-row group grid gap-2 border-t border-hairline py-7 md:grid-cols-12 md:items-baseline md:gap-8"
    >
      <span className="text-sm text-muted-foreground md:col-span-2">
        {date ? <time dateTime={iso ?? undefined}>{date}</time> : null}
      </span>
      <span className="flex flex-col gap-1 md:col-span-8">
        <h2 className="font-serif-display text-2xl leading-snug text-balance">
          <span className="post-row-title">{post.title}</span>
        </h2>
        {post.excerpt ? <span className="text-[15px] leading-relaxed text-muted-foreground">{post.excerpt}</span> : null}
      </span>
      <span className="flex items-center justify-between gap-3 text-sm text-muted-foreground md:col-span-2 md:justify-end">
        {readingTime(post)} min read
        <ArrowRight aria-hidden="true" className="post-card-arrow size-4 shrink-0 text-primary" />
      </span>
    </Link>
  );
}
