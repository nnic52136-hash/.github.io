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

const BOOKS_PREVIEW = LIKES_DATA.filter((item) => item.category === "books").slice(0, 4);
const SINGERS_PREVIEW = LIKES_DATA.filter((item) => item.category === "singers").slice(0, 4);

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
            熱衷於 Web 開發、AI 自動化流程與軟硬體實驗的自學生。
          </p>
          <p className="about-p">
            專注於探索 Component-driven 系統架構、前端 UI/UX 設計與軟體建構。
          </p>
          <p className="about-p">
            除了寫程式與探索新技術外，平常也喜歡閱讀漫畫、音樂賞析與參與各類實體交流活動。
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
            <div className="about-side-quote">
              來世所及，皆為體驗
            </div>
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