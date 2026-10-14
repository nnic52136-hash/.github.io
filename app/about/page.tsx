import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import { LIKES_DATA } from "../data/likes";
import { likeThumb, cardBgThumb, artistAvatarThumb } from "../lib/imageThumb";
import { pageMetadata } from "../lib/seo";

export const revalidate = 3600;

const description = "Yase（亞瑟原 / 李中原）的個人簡介 (*´з｀*)";

const INTEREST_BG = "/assets/likes/neko.webp";
const MUSIC_BG = "/assets/likes/nacho.webp";

const BOOKS_PREVIEW = LIKES_DATA.filter(
  (item) => item.category === "books"
).slice(0, 4);
const SINGERS_PREVIEW = LIKES_DATA.filter(
  (item) => item.category === "singers"
).slice(0, 4);

export const metadata: Metadata = pageMetadata({
  title: "關於我",
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="ABOUT" title="關於我" />
      <div className="about-grid">
        <div className="about-main">
          <div className="about-lead">這裡是原</div>
          <p className="about-p">
            想打一長串，但等我有空再說吧(
          </p>
          <p className="about-p">
            在這節奏快的時代，我希望自己能專注在自我的發展，就如左右銘所寫：生活沒有意義，只為探索。
          </p>
          <p className="about-p">
            我希望提升我的元能力，我的思想，我的認知，只為更好感知這世界。
          </p>
          <div className="divider" />
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-k">本名</div>
              <div className="stat-v">李中原</div>
            </div>
            <div className="stat">
              <div className="stat-k">別名</div>
              <div className="stat-v">亞瑟原 / Yase</div>
            </div>
            <div className="stat">
              <div className="stat-k">生日</div>
              <div className="stat-v mono">2010/06/26</div>
            </div>
          </div>
        </div>

        <div className="about-side">
          <img
            src="/assets/brand/banner-400.webp"
            srcSet="/assets/brand/banner.webp 768w, /assets/brand/banner-400.webp 400w"
            sizes="400px"
            width={400}
            height={150}
            alt=""
          />
          <div className="about-side-body">
            <div className="label">座右銘</div>
            <div className="about-side-quote">來世所及，皆為體驗</div>
          </div>
        </div>

        {/* 1. 書籍收藏預覽卡片（指向 /likes/books） */}
        <Link href="/likes/books" className="mini-card mini-interest">
          <img
            className="mini-interest-bg"
            src={cardBgThumb(INTEREST_BG)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="mini-kicker">愛好</div>
          <div className="mini-interest-title">書籍</div>
          <div className="mini-interest-stack">
            {BOOKS_PREVIEW.map((item, i) => (
              <img
                key={item.id || item.title}
                className="mini-interest-stack-img"
                style={{ "--i": i } as React.CSSProperties}
                src={likeThumb(item.coverImage)}
                alt={item.title}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <span className="mini-arrow">↗</span>
        </Link>

        {/* 2. 音樂/歌手收藏預覽卡片（指向 /likes/singers） */}
        <Link href="/likes/singers" className="mini-card mini-music">
          <img
            className="mini-interest-bg"
            src={cardBgThumb(MUSIC_BG)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="mini-kicker">愛好</div>
          <div className="mini-interest-title">音樂</div>
          <div className="mini-music-avatars">
            {SINGERS_PREVIEW.map((a, i) => (
              <img
                key={a.id || a.title}
                className="mini-music-avatar"
                style={{ "--i": i } as React.CSSProperties}
                src={artistAvatarThumb(a.coverImage)}
                alt={a.title}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <span className="mini-arrow">↗</span>
        </Link>
      </div>
    </section>
  );
}
