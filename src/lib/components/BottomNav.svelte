<script lang="ts">
  import { navItems } from "../types";
  import ABOUT_ICON from "../assets/icons/Winking Face With Tongue.svg";
  import WORK_ICON from "../assets/icons/Necktie.svg";
  import PROJECT_ICON from "../assets/icons/Open File Folder.svg";
  import CONTACT_ICON from "../assets/icons/Open Mailbox With Raised Flag.svg";

  interface Props {
    currentPage: string;
    onNavigate: (page: string) => void;
    showMusicToggle?: boolean;
    isMusicPlaying?: boolean;
    onMusicToggle?: () => void;
  }

  let {
    currentPage,
    onNavigate,
    showMusicToggle = false,
    isMusicPlaying = false,
    onMusicToggle,
  }: Props = $props();

  const iconMap: Record<string, string> = {
    "about-me": ABOUT_ICON,
    "work-experience": WORK_ICON,
    "projects": PROJECT_ICON,
    "contacts": CONTACT_ICON,
  };
</script>

<nav
  class="fixed bottom-0 left-0 right-0 z-50 h-14 md:h-16 bg-[rgba(255,255,255,0.5)] backdrop-blur pb-[env(safe-area-inset-bottom)]"
  aria-label="Primary"
>
  <div class="flex h-full items-stretch justify-around">
    {#each navItems as item (item.id)}
      <button
        type="button"
        aria-label={item.label}
        aria-current={currentPage === item.id ? "page" : undefined}
        onclick={() => onNavigate(item.id)}
        class="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs md:flex-row md:gap-2 md:text-sm {currentPage ===
        item.id
          ? "border-t-2 border-orange-500 text-orange-500"
          : "border-t-2 border-transparent text-black"}"
      >
        <img
          src={iconMap[item.id]}
          alt=""
          class="h-5 w-5 md:hidden"
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </button>
    {/each}

    {#if showMusicToggle}
      <div class="flex items-center">
        <div class="mx-2 h-6 w-px bg-white/30"></div>
        <button
          type="button"
          aria-label={isMusicPlaying ? "Pause music" : "Play music"}
          onclick={() => onMusicToggle?.()}
          class="flex w-12 items-center justify-center text-xs text-black"
        >
          <span class="md:hidden">{isMusicPlaying ? "♪" : "♪"}</span>
          <span class="hidden md:inline">{isMusicPlaying ? "Pause" : "Play"}</span>
        </button>
      </div>
    {/if}
  </div>
</nav>