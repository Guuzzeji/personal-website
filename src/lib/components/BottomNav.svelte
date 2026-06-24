<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  // Handle onload for small screens
  let deviceSmall = $state<boolean>(false);
  const smallScreenBreakpoint = 640;
  onMount(() => {
    if (window.innerWidth <= smallScreenBreakpoint) deviceSmall = true;
    console.log(deviceSmall);
  });

  interface Section {
    id: string;
    label: string;
  }

  const sections: Section[] = [
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const EMAIL = "gabe.business.code@outlook.com";

  let activeId = $state<string>(sections[0].id);

  $effect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          activeId = visible[0].target.id;
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.25] },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  });

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      activeId = id;
    }
  }

  function handleResize() {
    const mediaQuery = window.matchMedia(
      `(width <= ${smallScreenBreakpoint}px)`,
    );
    mediaQuery.addEventListener("change", ({ matches }) => {
      deviceSmall = matches;
      console.log(deviceSmall);
    });
  }

  let isOpen = $state<boolean>(false);

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function handleMenuClick(id: string) {
    scrollToSection(id);
    isOpen = false; // Automatically close the menu after clicking a section
  }
</script>

<svelte:window on:resize={handleResize} />

<nav
  class="fixed left-1/2 -translate-x-1/2 z-50 w-screen lg:w-[72vw] px-2"
  style="bottom: calc(env(safe-area-inset-bottom, 0px) + 3rem)"
  aria-label="Primary"
>
  <div
    class="flex justify-between lg:items-center gap-1.5 p-1 bg-surface rounded-pill border-3 border-ink shadow-lg shadow-ink/20"
  >
    {#if !deviceSmall}
      <!-- Desktop -->
      {#each sections as s (s.id)}
        <button
          type="button"
          aria-label={s.label}
          aria-current={activeId === s.id ? "true" : undefined}
          data-section={s.id}
          onclick={() => scrollToSection(s.id)}
          class="flex items-center justify-center min-h-11 min-w-11 px-3 rounded-pill font-mono text-xs sm:text-sm font-semibold transition-colors duration-200 {activeId ===
          s.id
            ? 'bg-accent text-ink'
            : 'text-ink hover:bg-muted'}"
        >
          {s.label}
        </button>
      {/each}

      <a
        href={`mailto:${EMAIL}`}
        class="flex items-center justify-center min-h-11 min-w-11 px-3 rounded-pill font-mono text-xs sm:text-sm font-semibold transition-colors duration-200 hover:text-accent"
      >
        Email
      </a>

      <span class="w-px h-7 bg-ink/20 mx-1" aria-hidden="true"></span>

      <span class="w-[60%]"></span>
    {:else}
      <!-- Mobile -->
      {#if isOpen}
        <div
          transition:fly={{ y: 20, duration: 250 }}
          class="absolute bottom-full mb-3 left-3 min-w-48 flex flex-col p-2 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-ink/10"
        >
          {#each sections as s (s.id)}
            <button
              type="button"
              aria-label={s.label}
              aria-current={activeId === s.id ? "true" : undefined}
              onclick={() => handleMenuClick(s.id)}
              class="flex items-center justify-start w-full min-h-11 px-4 rounded-pill font-mono text-sm font-semibold transition-colors duration-200 {activeId ===
              s.id
                ? 'bg-accent text-ink'
                : 'text-ink hover:bg-muted'}"
            >
              {s.label}
            </button>
          {/each}

          <div class="h-px w-full bg-ink/20 my-2" aria-hidden="true"></div>

          <a
            href={`mailto:${EMAIL}`}
            class="flex items-center justify-start w-full min-h-11 px-4 rounded-pill font-mono text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent hover:bg-muted"
          >
            Email
          </a>
        </div>
      {/if}

      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onclick={toggleMenu}
        class="flex flex-col items-center justify-center gap-[5px] min-h-11 min-w-11 rounded-pill transition-colors duration-200 hover:bg-muted z-10"
      >
        <span
          class="w-5 h-0.5 bg-ink rounded-full transition-transform duration-300 origin-center {isOpen
            ? 'translate-y-[7px] rotate-45'
            : ''}"
        ></span>

        <span
          class="w-5 h-0.5 bg-ink rounded-full transition-opacity duration-300 {isOpen
            ? 'opacity-0'
            : 'opacity-100'}"
        ></span>

        <span
          class="w-5 h-0.5 bg-ink rounded-full transition-transform duration-300 origin-center {isOpen
            ? '-translate-y-[7px] -rotate-45'
            : ''}"
        ></span>
      </button>
    {/if}

    <button
      class="flex items-center justify-center min-h-11 px-4 rounded-pill bg-ink text-canvas font-mono text-xs sm:text-sm font-semibold transition-colors duration-200 hover:bg-accent hover:text-ink"
    >
      ✨
    </button>
  </div>
</nav>
