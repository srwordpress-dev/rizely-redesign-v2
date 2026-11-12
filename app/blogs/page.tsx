import type { Metadata } from "next";
import Footer from "@/components/footer";
import Link from "next/link";
import { PostFeature, PostRow } from "@/components/blog/post-list";
import PageHero from "@/components/page-hero";
import Motion from "@/components/motion";
import { BRAND, OG_IMAGE, SITE_URL } from "@/lib/site";
import { getArticles } from "@/lib/strapi";

const TITLE = `Blog — ${BRAND}`;
const DESCRIPTION =
  "Practical writing on event lead capture and follow-up: what actually shortens the gap between collecting a card and getting a reply.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blogs" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blogs`,
    siteName: BRAND,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

export default async function BlogIndex() {
  const posts = await getArticles();

  const [first, ...rest] = posts;

  return (
    <main className="flex min-h-dvh flex-col">
      <PageHero
        kicker={`${BRAND} blog`}
        title={
          <>
            Notes on turning event conversations into customers<span className="text-spark">.</span>
          </>
        }
        lede={DESCRIPTION}
      />

      <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 pb-24 md:px-8">
        {posts.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border-t border-hairline pt-10">
            <p className="font-serif-display text-2xl leading-snug">The first notes are being written.</p>
            <p className="max-w-xl text-muted-foreground">
              Meanwhile, the homepage shows how one card becomes a follow-up in about a minute.
            </p>
            <Link href="/#how" className="blog-more">
              See how it works <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <PostFeature post={first} />
            {rest.length > 0 ? (
              <ul className="border-b border-hairline">
                {rest.map((post) => (
                  <li key={post.documentId ?? post.slug}>
                    <PostRow post={post} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </section>
      <Footer />
      <Motion />
    </main>
  );
}
