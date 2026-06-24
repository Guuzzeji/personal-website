<script lang="ts">
  import { onMount } from "svelte";
  import { fly, crossfade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  // Creates the fluid "magic move" effect for our blue bubble
  const [send, receive] = crossfade({
    duration: 400, // Slightly slower for that smooth liquid feel
    easing: quintOut,
  });

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
    class="flex justify-between lg:items-center gap-1.5 p-2.5 rounded-pill bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl"
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
          class="relative z-0 flex items-center justify-center min-h-11 min-w-11 px-4 rounded-pill font-mono text-xs sm:text-sm font-semibold transition-colors duration-300 {activeId ===
          s.id
            ? 'text-white'
            : 'text-ink-soft hover:bg-white/10 hover:text-ink'}"
        >
          <!-- The Liquid Blue Bubble -->
          {#if activeId === s.id}
            <div
              in:receive={{ key: "nav-bubble" }}
              out:send={{ key: "nav-bubble" }}
              class="absolute inset-0 bg-accent rounded-pill shadow-md -z-10"
            ></div>
          {/if}

          <!-- Text sits on top -->
          <span>{s.label}</span>
        </button>
      {/each}

      <a
        href={`mailto:${EMAIL}`}
        class="flex items-center justify-center min-h-11 min-w-11 px-4 rounded-pill font-mono text-xs sm:text-sm font-semibold text-accent transition-all duration-300 hover:text-link hover:bg-white/10"
      >
        Email
      </a>

      <span class="w-px h-10 bg-white/20 mx-1" aria-hidden="true"></span>

      <span class="w-[60%]"></span>
    {:else}
      <!-- Mobile -->
      {#if isOpen}
        <div
          transition:fly={{ y: 20, duration: 250 }}
          class="absolute bottom-full mb-3 left-2 min-w-25 flex flex-col p-2 bg-[#1c1c1e]/80 backdrop-blur-3xl rounded-2xl shadow-2xl border border-white/20"
        >
          {#each sections as s (s.id)}
            <button
              type="button"
              aria-label={s.label}
              aria-current={activeId === s.id ? "true" : undefined}
              onclick={() => handleMenuClick(s.id)}
              class="relative z-0 flex items-center justify-start w-full min-h-11 px-4 font-mono text-sm font-semibold rounded-2xl transition-colors duration-300 {activeId ===
              s.id
                ? 'text-white'
                : 'text-ink hover:bg-white/10'}"
            >
              <!-- The Liquid Blue Bubble (Mobile Version) -->
              {#if activeId === s.id}
                <div
                  in:receive={{ key: "mobile-nav-bubble" }}
                  out:send={{ key: "mobile-nav-bubble" }}
                  class="absolute inset-0 bg-accent rounded-2xl shadow-md -z-10"
                ></div>
              {/if}

              <span class="relative z-10">{s.label}</span>
            </button>
          {/each}

          <div class="h-px w-full bg-white/20 my-2" aria-hidden="true"></div>

          <a
            href={`mailto:${EMAIL}`}
            class="flex items-center justify-start w-full min-h-11 px-4 rounded-pill font-mono text-sm font-semibold text-accent transition-all duration-300 hover:text-white hover:bg-white/10"
          >
            Email
          </a>
        </div>
      {/if}

      <!-- Animated Hamburger Button -->
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onclick={toggleMenu}
        class="flex flex-col items-center justify-center gap-[5px] min-h-11 min-w-11 rounded-pill transition-colors duration-300 hover:bg-white/10 z-10"
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
      class="flex items-center justify-center min-h-11 px-4 rounded-pill bg-white/10 text-ink font-mono text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-white/20 shadow-sm"
    >
      ✨
    </button>
  </div>
</nav>
