<script lang="ts">
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
</script>

<nav
  class="fixed left-1/2 -translate-x-1/2 z-50 w-screen md:w-[72vw] px-2"
  style="bottom: calc(env(safe-area-inset-bottom, 0px) + 3rem)"
  aria-label="Primary"
>
  <div
    class="flex items-center gap-1.5 p-1 bg-surface rounded-pill border-3 border-ink shadow-lg shadow-ink/20"
  >
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

    <button
      class="flex items-center justify-center min-h-11 px-4 rounded-pill bg-ink text-canvas font-mono text-xs sm:text-sm font-semibold transition-colors duration-200 hover:bg-accent hover:text-ink"
    >
      ✨
    </button>
  </div>
</nav>
