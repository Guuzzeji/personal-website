<script lang="ts">
  import { navItems } from "../types";
  import ABOUT_ICON from "../../assets/icons/Winking Face With Tongue.svg";
  import WORK_ICON from "../../assets/icons/Necktie.svg";
  import PROJECT_ICON from "../../assets/icons/Open File Folder.svg";
  import CONTACT_ICON from "../../assets/icons/Open Mailbox With Raised Flag.svg";

  interface Props {
    currentPage: string;
    onNavigate: (page: string) => void;
    onAIChatToggle: () => void;
  }

  let {
    currentPage,
    onNavigate,
    onAIChatToggle,
  }: Props = $props();

  const iconMap: Record<string, string> = {
    "about-me": ABOUT_ICON,
    "work-experience": WORK_ICON,
    "projects": PROJECT_ICON,
    "contacts": CONTACT_ICON,
  };

  let menuExpanded = $state(false);

  $effect(() => {
    const check = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        menuExpanded = true;
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  });

  function toggleMenu() {
    menuExpanded = !menuExpanded;
  }

  function handleNavigate(id: string) {
    onNavigate(id);
    menuExpanded = false;
  }
</script>

<nav
  class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
  aria-label="Primary"
>
  <div
    class="flex items-center gap-3 px-4 h-12 bg-black/90 backdrop-blur-xl rounded-full shadow-lg shadow-black/50 border border-white/10 text-white text-sm"
  >
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="md:hidden flex items-center gap-2"
        aria-label="Toggle menu"
        aria-expanded={menuExpanded}
        onclick={toggleMenu}
      >
        <span
          class="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_#fde047]"
          aria-hidden="true"
        ></span>
        <span class="text-xs text-white/70">Menu</span>
        <span class="relative w-4 h-3" aria-hidden="true">
          <span
            class="absolute left-0 top-1/2 h-0.5 w-full bg-white rounded-full transition-transform duration-300"
            style:transform={menuExpanded ? "rotate(45deg)" : "translateY(-5px)"}
            style:transform-origin="center"
          ></span>
          <span
            class="absolute left-0 top-1/2 h-0.5 w-full bg-white rounded-full transition-transform duration-300"
            style:transform={menuExpanded ? "rotate(-45deg)" : "translateY(5px)"}
            style:transform-origin="center"
          ></span>
        </span>
      </button>

      {#each navItems as item (item.id)}
        <button
          type="button"
          aria-label={item.label}
          aria-current={currentPage === item.id ? "page" : undefined}
          onclick={() => handleNavigate(item.id)}
          class="relative flex items-center gap-1 {currentPage === item.id
            ? "text-orange-500"
            : "text-white/60 hover:text-white transition-colors"}"
        >
          <img
            src={iconMap[item.id]}
            alt=""
            class="h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span class="{menuExpanded ? "inline" : "hidden"} md:inline">{item.label}</span>
          {#if currentPage === item.id}
            <span
              class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-orange-500"
              aria-hidden="true"
            ></span>
          {/if}
        </button>
      {/each}
    </div>

    <button
      type="button"
      class="ml-auto flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-full text-black text-xs font-medium transition-colors"
      aria-label="Toggle AI chat"
      onclick={() => onAIChatToggle()}
    >
      <svg
        viewBox="0 0 24 24"
        class="w-3 h-3"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        />
      </svg>
      AI
    </button>
  </div>
</nav>
