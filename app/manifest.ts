import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "原 的個人網站",
    short_name: "Yase Origin",
    description: "Yase Origin",
    start_url: "/",
    display: "standalone",
    background_color: "#1b1e23",
    theme_color: "#1b1e23",
    lang: "zh-Hant",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
