import type { ExperienceItem } from "../../data";
import { experienceImageThumb } from "../../lib/imageThumb";

export default function ExperienceDetailBody({
  item,
}: {
  item: ExperienceItem;
}) {
  const renderMultiValue = (val?: string | string[]) => {
    if (!val) return null;
    return Array.isArray(val) ? val.join(" / ") : val;
  };

  const renderMultiTags = (val?: string | string[], prefix = "#") => {
    if (!val) return null;
    const list = Array.isArray(val) ? val : val.split(/[,，]/).map(s => s.trim()).filter(Boolean);
    return list.map((itemVal) => (
      <span className="proj-tag" key={itemVal}>
        {prefix}{itemVal}
      </span>
    ));
  };

  const roleText = renderMultiValue(item.role);
  const orgVal = item.organization || item.org;
  const orgText = renderMultiValue(orgVal);

  return (
    <>
      {/* 灰色標籤列：顯示時間、角色與各維度標籤 */}
      <div
        className="proj-tags"
        style={{ marginTop: 4, display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}
      >
        {item.period && <span className="proj-tag">{item.period}</span>}
        {orgText && <span className="proj-tag" style={{ color: "var(--purple)" }}>{orgText}</span>}
        {roleText && <span className="proj-tag" style={{ color: "var(--blue)" }}>{roleText}</span>}
        {renderMultiTags(item.type)}
        {renderMultiTags(item.domain)}
        {item.tags?.map((tag) => (
          <span className="proj-tag" key={tag} style={{ color: "var(--blue)" }}>
            #{tag}
          </span>
        ))}
      </div>

      {item.desc && (
        <div className="proj-detail-section">
          <p className="about-p">{item.desc}</p>
        </div>
      )}

      {/* 🖼️ 圖片庫：外框隨圖片比例自動貼合，且將整體大小縮減為約 2/3 */}
      {item.images && item.images.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            marginTop: "16px",
          }}
        >
          {item.images.map((src, i) => (
            <a
              key={src + i}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid var(--bd)",
                boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                backgroundColor: "var(--panel)",
              }}
            >
              <img
                src={experienceImageThumb(src)}
                alt={`${item.title} 圖片 ${i + 1}`}
                loading="lazy"
                decoding="async"
                style={{
                  display: "block",
                  maxHeight: "260px", // 💡 縮小為約 2/3 大小 (260px)
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </a>
          ))}
        </div>
      )}

      {item.longDesc && (
        <div className="proj-detail-section" style={{ marginTop: "16px" }}>
          <div className="card-kicker">詳細心得與內容</div>
          <p className="about-p" style={{ whiteSpace: "pre-line" }}>
            {item.longDesc}
          </p>
        </div>
      )}

      {item.href && (
        <div className="proj-detail-actions" style={{ marginTop: "20px" }}>
          <a
            className="btn-primary"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            相關連結 <span className="btn-arrow dark">→</span>
          </a>
        </div>
      )}
    </>
  );
}