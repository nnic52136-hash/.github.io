import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { pageMetadata, SITE_DESCRIPTION } from "./lib/seo";
import { ROLES } from "./data";
import GithubGlyph from "./components/GithubGlyph";
import GithubContributionCard from "./components/home/GithubContributionCard";
import {
  LanyardProvider,
  ProfileStatus,
  ProfileStatusDot,
} from "./components/status/LanyardCards";
import AvatarEasterEgg from "./components/easter-eggs/AvatarEasterEgg";
import HeroFace from "./components/home/HeroFace";
import HomeQuoteFont from "./components/home/HomeQuoteFont";
import BadgeShape from "./components/home/BadgeShape";
import NameRotator from "./components/home/NameRotator";
import DecorativeImage from "./components/DecorativeImage";

// 👈 關鍵修正：將會用到 window 的 TagCloudWidget 改為動態載入並關閉 SSR
const TagCloudWidget = dynamic(
  () => import("./components/home/TagCloudWidget"),
  { ssr: false }
);

export const metadata: Metadata = pageMetadata({
  title: "Yase Origin",
  description: SITE_DESCRIPTION,
  path: "/",
  absolute: true,
});

export default function HomePage() {
  return (
    <LanyardProvider>
      <HomeQuoteFont />
      <HomeContent />
    </LanyardProvider>
  );
}

function HomeContent() {
  return (
    <section className="home-grid">
      {/* Profile card */}
      <aside className="profile">
        <div className="profile-card">
          <div className="profile-banner">
            <img
              src="/assets/brand/banner-400.webp"
              srcSet="/assets/brand/banner.webp 768w, /assets/brand/banner-400.webp 400w"
              sizes="400px"
              width={400}
              height={150}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="profile-body">
            <div className="avatar-row">
              <div className="avatar-wrap">
                <AvatarEasterEgg
                  className="avatar"
                  src="/assets/brand/avatar.webp"
                  alt="李中原 / 亞瑟原 / Yase"
                  href="https://github.com/nnic52136-hash"
                />
                <ProfileStatusDot />
              </div>
              <div className="badges">
                <BadgeShape kind="circle" color="var(--blue)" />
                <BadgeShape kind="triangle" color="var(--purple)" />
                <BadgeShape kind="square" color="var(--dim)" />
                <BadgeShape kind="diamond" color="var(--blue)" />
              </div>
            </div>
            <div className="name-row">
              <span className="name">李中原</span>
              <span className="sr-only"> · </span>
              <span className="alias">亞瑟原</span>
            </div>
            <div className="handle">來世所及，皆為體驗</div>
            <ProfileStatus />
            <div className="divider" />
            <div className="label">關於我</div>
            <div className="field">自學生 · 地球online玩家</div>
            <div className="label mt16">身分組</div>
            <div className="roles">
              <div className="role-row">
                {ROLES.filter((r) => r.color === "blue").map((r) => (
                  <span className="role-chip" key={r.label}>
                    <span className={`role-dot ${r.color}`} />
                    {r.label}
                  </span>
                ))}
              </div>
              <div className="role-row">
                {ROLES.filter((r) => r.color === "purple").map((r) => (
                  <span className="role-chip" key={r.label}>
                    <span className={`role-dot ${r.color}`} />
                    {r.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="label mt16">成為成員時間</div>
            <div className="field">2010/06/26</div>
          </div>
        </div>
      </aside>

      {/* Right column */}
      <div className="right-col">
        {/* Hero card */}
        <div className="card hero">
          <div className="hero-main">
            <div className="hero-greet">ciallo (∠·ω )⌒★</div>
            <h1 className="hero-title">
              I&apos;m <NameRotator />
            </h1>
            <div className="hero-sub">喜歡體驗世界的人</div>
            <div className="hero-actions">
              <Link
                className="btn-primary"
                href="/about"
                style={{ textDecoration: "none" }}
              >
                關於我 <span className="btn-arrow dark">→</span>
              </Link>
            </div>
          </div>
          <div className="hero-side">
            <HeroFace />
          </div>
        </div>
        
        {/* 訪客留印牆 */}
        <div
          className="card quote-card tag-cloud-card"
          style={{
            minHeight: "unset",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "8px",
            padding: "20px 24px",
            boxSizing: "border-box",
          }}
        >
          <div>
            <div className="card-kicker">IMPRESSIONS</div>
            <div className="nav-card-title">訪客留印牆</div>
          </div>
          <TagCloudWidget />
        </div>
        {/* Bento: nav cards */}
        <div className="bento">
          <Link
            className="bento-thoughts nav-card"
            href="/writing"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div className="card-kicker">WRITING</div>
              <div className="nav-card-title">隨筆</div>
            </div>
            <span className="nav-card-ghost" aria-hidden>
              念
            </span>
            <span className="nav-card-arrow">↗</span>
          </Link>

          <Link
            className="bento-likes card-likes"
            href="/likes"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <DecorativeImage
              className="card-likes-img"
              src="/assets/likes/art-miku.webp"
              loading="eager"
              fetchPriority="high"
            />
            <div className="card-body">
              <div className="card-kicker">LIKES</div>
              <div className="card-title-lg">
                I saw,
                <br />
                I loved,
                <br />
                I lived.
              </div>
            </div>
            <span className="card-arrow-lg">↗</span>
          </Link>

          <Link
            className="bento-friends nav-card"
            href="/links"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div className="card-kicker">LINKS</div>
              <div className="nav-card-title">知交</div>
            </div>
            <span className="nav-card-ghost" aria-hidden>
              友
            </span>
            <span className="nav-card-arrow">↗</span>
          </Link>

          <Link
            className="bento-experience nav-card"
            href="/experience"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div className="card-kicker">JOURNEY</div>
              <div className="nav-card-title">閱歷</div>
            </div>
            <span className="nav-card-ghost" aria-hidden>
              歷
            </span>
            <span className="nav-card-arrow">↗</span>
          </Link>

          <Link
            className="bento-projects card-projects"
            href="/projects"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <GithubGlyph className="card-projects-glyph" fill="var(--tx)" />
            <div className="card-body-sm">
              <div className="card-kicker">PROJECTS</div>
              <div className="card-title-md">一些成果</div>
            </div>
            <span className="card-arrow-sm">↗</span>
          </Link>
        </div>

        {/* GitHub contribution graph */}
        <GithubContributionCard />
      </div>
    </section>
  );
}