<script lang="ts">
  import HeroSection from "./lib/components/sections/HeroSection.svelte";
  import AboutSection from "./lib/components/sections/AboutSection.svelte";
  import WorkSection from "./lib/components/sections/WorkSection.svelte";
  import ProjectsSection from "./lib/components/sections/ProjectsSection.svelte";
  import ContactSection from "./lib/components/sections/ContactSection.svelte";
  import FooterSection from "./lib/components/sections/FooterSection.svelte";
  import BottomNav from "./lib/components/BottomNav.svelte";
</script>

<main class="relative">
  <div class="fixed inset-0 -z-10">
    <video autoplay muted loop playsinline class="w-full h-full object-cover">
      <source src="/background/main.mp4" type="video/mp4" />
    </video>
  </div>
  <HeroSection />
  <AboutSection />
  <WorkSection />
  <ProjectsSection />
  <ContactSection />
  <FooterSection />
  <BottomNav />
</main>
