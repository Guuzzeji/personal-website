<script lang="ts">
  import { onMount } from "svelte";

  // Pages
  import AboutMe from "./lib/pages/AboutMe.svelte";
  import WorkExperience from "./lib/pages/WorkExperience.svelte";
  import Projects from "./lib/pages/Projects.svelte";
  import Contact from "./lib/pages/Contact.svelte";
  import AIChat from "./lib/pages/AIChat.svelte";

  // Components
  import IPod from "./lib/components/IPod.svelte";
  import BottomNav from "./lib/components/BottomNav.svelte";

  // svelte-motion: scroll-linked animation
  import {
    Motion,
    AnimateSharedLayout,
    useViewportScroll,
    useTransform,
    useMotionValue,
  } from "svelte-motion";

  let currentPage = $state("about-me");
  let contentSection = $state<HTMLElement>();
  let isMusicPlaying = $state(false);
  let aiChatOpen = $state(false);
  let ipodRef:
    | { pauseAudio: () => void; togglePlay: () => void }
    | undefined = $state();

  function handlePageChange(page: string) {
    if (page === currentPage && !aiChatOpen) return;
    aiChatOpen = false;
    currentPage = page;
    contentSection?.scrollIntoView({ behavior: "smooth" });
  }

  function handlePlayStateChange(playing: boolean) {
    isMusicPlaying = playing;
  }

  function handleAIChatToggle() {
    aiChatOpen = !aiChatOpen;
  }

  // ── Scroll-Driven Morph Animation ──

  const { scrollY } = useViewportScroll();
  const heroHeight = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight : 1000
  );

  // scrollProgress: 0 → 1 over the first hero height
  const scrollProgress = useTransform(scrollY, (val: number) => {
    const hh = heroHeight.get();
    if (hh <= 0) return 0;
    return Math.min(1, Math.max(0, val / hh));
  });

  // Derived motion values for cross-fade
  const iPodScale = useTransform(scrollProgress, [0, 1], [1, 0.3]);
  const iPodOpacity = useTransform(scrollProgress, [0, 0.6], [1, 0]);
  const navOpacity = useTransform(scrollProgress, [0.4, 1], [0, 1]);

  // ── Hysteresis: prevents oscillation near the threshold ──

  let isMorphed = $state(false);
  let scrollProgressVal = $state(0);

  onMount(() => {
    if (typeof window === "undefined") return;

    // Bridge motion value changes into Svelte reactivity
    const unsub = scrollProgress.onChange((v: number) => {
      scrollProgressVal = v;
    });

    // Keep hero height in sync on resize
    const handleResize = () => {
      heroHeight.set(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      unsub();
      window.removeEventListener("resize", handleResize);
    };
  });

  $effect(() => {
    const progress = scrollProgressVal;
    if (!isMorphed && progress > 0.6) {
      isMorphed = true;
      ipodRef?.pauseAudio();
    } else if (isMorphed && progress < 0.4) {
      isMorphed = false;
      aiChatOpen = false;
      currentPage = "about-me";
    }
  });
</script>

<main class="relative">
  <!-- Background stays fixed/fullscreen -->
  <div class="fixed inset-0 -z-10">
    <img
      class="w-full h-full object-cover"
      src="/background/main.jpg"
      alt="Background"
    />
  </div>

  <AnimateSharedLayout>
    <!-- iPod Hero Section -->
    <section
      class="h-screen h-[100dvh] sticky top-0 flex items-center justify-center"
      class:pointer-events-none={isMorphed}
    >
      <Motion style={{ scale: iPodScale, opacity: iPodOpacity }} let:motion>
        <div use:motion class="will-change-transform">
          <IPod bind:this={ipodRef} onPlayStateChange={handlePlayStateChange} />
        </div>
      </Motion>
    </section>

    <!-- Content Section -->
    <section
      bind:this={contentSection}
      class="relative z-10 min-h-screen bg-black/80 px-4 md:px-8 lg:px-12 pb-[calc(6rem+env(safe-area-inset-bottom))]"
    >
      {#if aiChatOpen}
        <AIChat />
      {:else if currentPage === "about-me"}
        <AboutMe />
      {:else if currentPage === "work-experience"}
        <WorkExperience />
      {:else if currentPage === "projects"}
        <Projects />
      {:else if currentPage === "contacts"}
        <Contact />
      {/if}
    </section>

    <!-- Bottom Navigation -->
    <Motion style={{ opacity: navOpacity }} let:motion>
      <div use:motion>
        <BottomNav
          currentPage={currentPage}
          onNavigate={handlePageChange}
          onAIChatToggle={handleAIChatToggle}
        />
      </div>
    </Motion>
  </AnimateSharedLayout>
</main>
