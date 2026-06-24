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
    <!-- <video autoplay muted loop playsinline class="w-full h-full object-cover">
      <source src="/background/v0.mp4" type="video/mp4" />
    </video> -->
    <img
      class="w-full h-full object-cover"
      src="/background/Raphael_School_of_Athens.jpg"
      alt="background"
    />
  </div>
  <HeroSection />
  <AboutSection />
  <WorkSection />
  <ProjectsSection />
  <ContactSection />
  <FooterSection />
  <BottomNav />
</main>
