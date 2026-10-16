export interface LinkItem {
  name: string;
  handle: string;
  href: string;
  desc?: string;
  avatar?: string;
}

export const LINKS: LinkItem[] = [
  {
    name: "原阿",
    handle: "來世所及，皆為體驗",
    href: " https://github-io-sigma-ten.vercel.app/ ",
    desc: "一個測試",
    avatar: " https://github-io-sigma-ten.vercel.app/assets/brand/avatar.webp ",
  },
  {
    name: "吳鑽",
    handle: "不為了迎合別人委屈自己",
    href: "  https://wuzuantw.com ",
    desc: "30歲高中生",
    avatar: " /assets/likes/wuzuan.png ",
  },
  {
    name: "ChenArnold",
    handle: "總會有地上的生靈，敢於直面雷霆的威光",
    href: "  https://arnold-e9b.pages.dev/",
    desc: "學治大佬",
    avatar: "https://arnold-e9b.pages.dev/assets/img/my-profile-img.jpg",
  },
  
];
