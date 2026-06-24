<script lang="ts">
  import { Motion } from "svelte-motion";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
</script>

<section
  id="hero"
  class="section text-ink h-screen flex flex-col justify-center"
>
  <!-- Removed the global opacity-25 so text stays fully opaque -->
  <div class="relative max-w-5xl mx-auto w-full bottom-15">
    <!-- Decorative square: Changed from bg-accent to iMessage blue -->
    <div
      class="hidden md:block absolute -right-4 -bottom-4 w-28 h-28 bg-[#007AFF] rounded-card-lg border-ink shadow-lg"
      aria-hidden="true"
    ></div>

    <!-- Glass Card: Added background transparency, blur, and a subtle border -->
    <article
      class="card rounded-card-sm relative z-10 bg-white/30 backdrop-blur-md border border-white/40 shadow-2xl p-8 sm:p-12"
    >
      <span class="pill absolute -top-3 left-6 md:left-10 bg-white"
        >Hello!!</span
      >

      <Motion
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        let:motion
      >
        <div use:motion class="flex flex-col gap-6 md:gap-8 pt-4">
          <Motion variants={itemVariants} let:motion>
            <h1
              use:motion
              class="font-display text-ink text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight drop-shadow-sm"
            >
              Gabe Sanders
            </h1>
          </Motion>

          <Motion variants={itemVariants} let:motion>
            <p
              use:motion
              class="font-display text-ink text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight"
            >
              Software Engineer
              <span class="text-ink/70">&amp; Backend Specialist</span>
            </p>
          </Motion>

          <Motion variants={itemVariants} let:motion>
            <p
              use:motion
              class="text-ink-blue text-lg md:text-xl max-w-prose font-medium"
            >
              I build scalable systems and products that feel alive.
            </p>
          </Motion>

          <Motion variants={itemVariants} let:motion>
            <!-- Button: Changed hover states to use iMessage blue and white text -->
            <a
              use:motion
              href="#projects"
              class="inline-flex self-start items-center gap-2 bg-ink text-canvas rounded-pill border-3 border-ink font-mono text-sm font-semibold tracking-wide px-6 py-3 transition-all duration-300 hover:bg-[#007AFF] hover:border-[#007AFF] hover:text-white hover:shadow-lg"
            >
              View Projects
              <span aria-hidden="true" class="text-base">&rarr;</span>
            </a>
          </Motion>
        </div>
      </Motion>
    </article>
  </div>
</section>
