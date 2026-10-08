import { Fragment } from "react";
import Link from "next/link";
import { MARQUEE } from "../../data";
import VisitorCounter from "./VisitorCounter";

const NAV_LINKS = [
  { label: "首頁", href: "/" },
  { label: "關於", href: "/about" },
  { label: "收藏", href: "/likes" },
  { label: "專案", href: "/projects" },
  { label: "文章", href: "/writing" },
  { label: "友鏈", href: "/links" },
  { label: "經歷", href: "/experience" },
];

const CONTACT_LINKS = [
  { label: "電話：+886 930 333 587", href: "tel:+886930333587" },
  { label: "Email：nnic52136@gmail.com", href: "mailto:nnic52136@gmail.com" },
  { label: "Line：@yuan52136", href: "https://line.me/ti/p/Ov6_lWvKI9" },
];

const SOCIAL_LINKS = [
  {
    icon: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/dacsc_void_.0626",
  },
  {
    icon: "github",
    label: "GitHub",
    href: "https://github.com/nnic52136-hash",
  },
  {
    icon: "linkedin",
    label: "linkedin",
    href: "https://www.linkedin.com/in/%E9%98%BF-%E5%8E%9F-119932394/",
  },
  {
    icon: "discord",
    label: "Discord",
    href: "https://discord.com/users/1408816377523077301",
  },
  { icon: "telegram", label: "Telegram", href: "https://t.me/yuan52136" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="marquee">
        {[0, 1].map((g) => (
          <div
            className="marquee-group"
            key={g}
            aria-hidden={g === 1 ? true : undefined}
          >
            {MARQUEE.map((m, i) => (
              <Fragment key={i}>
                <span>{m}</span>
                <span className="star">★</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              Yase Origin
            </Link>
            <p className="footer-tagline">
              來世所及，
              <br />
              皆為體驗、
            </p>
          </div>

          <nav className="footer-col" aria-label="站內導覽">
            <div className="footer-section-label">Site Map</div>
            <div className="footer-link-list footer-link-list--two-col">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav className="footer-col" aria-label="Contact Information">
            <div className="footer-section-label">Contact Information</div>
            <div className="footer-link-list">
              {CONTACT_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="footer-col">
            <div className="footer-section-label">Social Media</div>
            <div className="footer-socials" aria-label="Social links">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.href}
                  className={`footer-si si-${s.icon}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  aria-label={s.label}
                >
                  <span className="footer-si-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="icon-copyright" />
            2026
            <span className="footer-heart">♥</span>
            <span>yuan52136</span>
          </div>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
