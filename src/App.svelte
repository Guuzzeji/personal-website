<script lang="ts">
  // Pages
  import AboutMe from "./lib/pages/AboutMe.svelte";
  import WorkExperience from "./lib/pages/WorkExperience.svelte";
  import Projects from "./lib/pages/Projects.svelte";
  import Contact from "./lib/pages/Contact.svelte";

  // Components
  import IPod from "./lib/components/IPod.svelte";
  import BottomNav from "./lib/components/BottomNav.svelte";

  let currentPage = $state("about-me");
  let contentSection = $state<HTMLElement>();

  function handlePageChange(page: string) {
    if (page === currentPage) return;
    currentPage = page;
    contentSection?.scrollIntoView({ behavior: "smooth" });
  }
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

  <!-- iPod Hero Section -->
  <section class="h-screen h-[100dvh] sticky top-0 flex items-center justify-center">
    <IPod />
  </section>

  <!-- Content Section -->
  <section
    bind:this={contentSection}
    class="relative z-10 min-h-screen bg-black/80 px-4 md:px-8 lg:px-12 pb-24"
  >
    {#if currentPage === "about-me"}
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
  <BottomNav
    currentPage={currentPage}
    onNavigate={handlePageChange}
    showMusicToggle={false}
  />
</main>
