export interface Role {
  label: string;
  color: "blue" | "purple";
}

export const ROLES: Role[] = [
  { label: "自學生", color: "blue" },
  { label: "DEVELOPER", color: "blue" },
  { label: "Creater", color: "purple" },
];

export const TILE_COLS: string[][] = [
  ["c", "cpp", "cs", "py", "html", "css"],
  ["js", "ts", "git", "github", "vscode", "docker"],
  ["unity", "godot", "linux", "dart", "flutter"],
];

export const MARQUEE: string[] = [
  "ciallo (∠·ω )⌒★",
  "I'm Yase",
  "李中原",
  "亞瑟原",
  "DEVELOPER",
  "ENFP-T",
  "Creater",
  "來世所及，皆為體驗",
  "Zzzz",
];
