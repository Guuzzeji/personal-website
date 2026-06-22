<script lang="ts">
  import { Motion } from 'svelte-motion';

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

<section id="hero" class="section text-ink h-screen">
  <div class="relative max-w-5xl mx-auto">
    <div
      class="hidden md:block absolute -right-4 -bottom-4 w-28 h-28 bg-accent rounded-card-lg border-3 border-ink"
      aria-hidden="true"
    ></div>

    <article class="card rounded-card-sm relative z-10 top-25">
      <span class="pill absolute -top-3 left-6 md:left-10">Hello!!</span>

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
              class="font-display text-ink text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight"
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
              <span class="text-ink-soft">&amp; Backend Specialist</span>
            </p>
          </Motion>

          <Motion variants={itemVariants} let:motion>
            <p use:motion class="text-ink-soft text-lg md:text-xl max-w-prose">
              I build scalable systems and products that feel alive.
            </p>
          </Motion>

          <Motion variants={itemVariants} let:motion>
            <a
              use:motion
              href="#projects"
              class="inline-flex self-start items-center gap-2 bg-ink text-canvas rounded-pill border-3 border-ink font-mono text-sm font-semibold tracking-wide px-6 py-3 transition-colors duration-200 hover:bg-accent hover:text-ink"
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
