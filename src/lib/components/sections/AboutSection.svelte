<script lang="ts">
  import WAVE_ICON from "../../../assets/icons/Waving Hand.svg";

  // State to track if the text is expanded or collapsed
  let isExpanded = false;
</script>

<section id="about" class="section bg-canvas text-ink">
  <div class="max-w-5xl mx-auto flex flex-col gap-2 md:gap-0.5">
    <div
      class="rounded-4xl p-6 md:p-10 rounded-card-sm bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg transition-all duration-300 group hover:bg-white/15 hover:border-white/30 hover:shadow-xl"
    >
      <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
        <img
          class="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 origin-bottom-right"
          src={WAVE_ICON}
          alt="waving hand"
        />
        <h2
          class="font-display text-ink text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight drop-shadow-sm"
        >
          Hello Friend,
        </h2>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1">
        <span
          class="inline-flex items-center px-3 py-1 text-xs md:text-sm font-medium rounded-full bg-white/5 border border-white/10 text-ink-soft transition-colors duration-300 group-hover:bg-white/10 group-hover:text-ink"
        >
          a.k.a. Guuzzeji Online!
        </span>
      </div>

      <div class="md:pt-10 pt-5">
        <div
          class="transition-[max-height,mask-image] duration-{isExpanded
            ? 700
            : 425} ease-in-out overflow-hidden {isExpanded
            ? 'max-h-[1500px] [mask-image:linear-gradient(to_bottom,black_100%,transparent_100%)]'
            : 'max-h-48 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]'}"
        >
          <div class="flex flex-col gap-4">
            <p class="text-ink text-base md:text-lg leading-relaxed">
              Hi, my name is Gabriel (or Gabe). I am a Software Engineer at
              Microsoft with a passion for building robust, scalable technology
              and solving complex backend problems.
            </p>

            <p class="text-ink text-base md:text-lg leading-relaxed">
              My professional background is rooted in core systems. I completed
              four consecutive internships at Microsoft Xbox, where I built and
              maintained infrastructure for Xbox Live/PlayFab. More recently, I
              worked with Moment.dev to engineer a local-first reactive data
              engine, leveraging Incremental View Maintenance to power a
              conflict-aware distributed sync and table editing system for
              collaborative applications.
            </p>

            <p class="text-ink text-base md:text-lg leading-relaxed">
              Technically, I am highly comfortable with C#, Python, Node.js, and
              JavaScript, alongside foundational experience in Java, Golang, and
              C/C++/ASM. Ultimately, I thrive building things, and I am always
              open to learning a new programming language or framework to push
              my technical boundaries.
            </p>

            <p class="text-ink text-base md:text-lg leading-relaxed">
              Outside of coding, I also enjoy playing video games (I need to get
              off of World of Warcraft), watching movies (Scarface!), reading
              books (mostly sci-fi), and editing YouTube videos. I am a big fan
              of Tyler the Creator and his music.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            on:click={() => (isExpanded = !isExpanded)}
            class="relative inline-flex items-center justify-center px-6 py-2 text-sm md:text-base font-medium transition-all duration-300 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-ink hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg focus:outline-none active:scale-95"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
