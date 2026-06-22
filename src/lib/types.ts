export type Project = {
  name: string;
  description: string;
  html_url: string;
  language: string;
  license: {
    name: string;
    spdx_id: string;
  };
};

export type NavItem = {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
};

export const navItems: NavItem[] = [
  {
    id: "about-me",
    label: "About Me",
    shortLabel: "About",
    icon: "src/assets/icons/Winking Face With Tongue.svg",
  },
  {
    id: "work-experience",
    label: "Work Experience",
    shortLabel: "Work",
    icon: "src/assets/icons/Necktie.svg",
  },
  {
    id: "projects",
    label: "Projects",
    shortLabel: "Projects",
    icon: "src/assets/icons/Open File Folder.svg",
  },
  {
    id: "contacts",
    label: "Contact",
    shortLabel: "Contact",
    icon: "src/assets/icons/Open Mailbox With Raised Flag.svg",
  },
];
