import Link from "next/link";
import { Like } from "../../data";
import { likeThumb, likeCircleThumb } from "../../lib/imageThumb";
import type { LiveInfo } from "../../hooks/useVtuberLiveStatus";

export default function LikeCard({
  l,
  carousel,
  layout,
  onClick,
  live,
  priority,
}: {
  l: Like;
  carousel?: boolean;
  layout?: "circle" | "square" | "portrait"; // 1. 新增 "portrait" 直向海報比例支援
  onClick?: () => void;
  live?: LiveInfo;
  priority?: boolean;
}) {
  const className = [
    "like-card",
    carousel && "like-card--carousel",
    layout === "circle" && "like-card--circle",
    layout === "square" && "like-card--square",
    layout === "portrait" && "like-card--portrait", // 2. 新增直向 CSS class
    onClick && "like-card--clickable",
    live?.live && "like-card--live",
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      <div className="like-thumb">
        <div className="like-thumb-clip">
          {l.cover ? (
            <img
              className="like-thumb-img"
              // 3. 修正原本只要有 layout 就套用圓形縮圖的 Bug
              src={layout === "circle" ? likeCircleThumb(l.cover) : likeThumb(l.cover)}
              alt={l.title}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              decoding="async"
            />
          ) : (
            <span>IMAGE</span>
          )}
        </div>
        {live?.live && <span className="like-live-badge">LIVE</span>}
      </div>
      <div className="like-body">
        <div className="like-title-row">
          <div className="like-title">{l.title}</div>
        </div>
        {layout !== "circle" && <div className="like-sub">{l.sub || " "}</div>}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {body}
      </button>
    );
  }

  // 開台時點下去跳直播間，沒開台就讀取 l.href 或 l.slug 自動產生的網址
  const href = (live?.live && live.url) || l.href;

  if (!href) {
    return <div className={className}>{body}</div>;
  }

  // 4. 判斷是否為站內網址 (例如 /likes/books/some-book)
  const isInternal = href.startsWith("/");

  // 5. 站內網址使用 Next.js <Link> 實現無縫轉場；外連才用 <a> + target="_blank"
  if (isInternal) {
    return (
      <Link className={className} href={href}>
        {body}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </a>
  );
}