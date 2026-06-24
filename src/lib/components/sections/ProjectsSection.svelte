<script lang="ts">
  interface CuratedProject {
    name: string;
    summary: string;
    url: string;
    tags: string[];
    accent?: boolean;
  }

  const projects: CuratedProject[] = [
    {
      name: "FreshBatch.tech",
      summary:
        "An automated job-tracking platform and Discord bot designed to help friends seamlessly find and track internships and jobs.",
      url: "https://freshbatch.tech",
      tags: ["Next.js", "Python", "Redis"],
      accent: false,
    },
    {
      name: "Go Minesweeper Multiplayer",
      summary:
        "Real-time multiplayer Minesweeper built with Go and the Gin web framework. Supports concurrent game rooms hosted in-memory.",
      url: "https://github.com/Guuzzeji/go-minesweeper-multiplayer",
      tags: ["Go", "Gin", "WebSocket"],
    },
    {
      name: "Knowledge Compiler Agents",
      summary:
        "Modular agent system that compiles and synthesises knowledge from diverse sources using LLM-driven pipelines.",
      url: "https://github.com/Guuzzeji/knowledge-compiler-agents",
      tags: ["AI", "Agents", "LLMs"],
    },
    {
      name: "AutoLeARn Backend",
      summary:
        "TreeHacks 2025 hackathon project \u2014 an adaptive learning platform backend that generates personalised exercises.",
      url: "https://github.com/Guuzzeji/AutoLeARn-backend",
      tags: ["Python", "Hackathon", "AI"],
    },
    {
      name: "Mini Napster",
      summary:
        "Lightweight peer-to-peer music discovery experiment built in Python.",
      url: "https://github.com/Guuzzeji/mini-napster",
      tags: ["Python", "Networking", "P2P"],
    },
  ];
</script>

<section id="projects" class="section bg-canvas text-ink">
  <div class="max-w-5xl mx-auto">
    <h2
      class="font-display text-ink text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-12 md:mb-16"
    >
      Projects
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
      {#each projects as project, i}
        {@const isHero = i === 0}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group block {isHero
            ? 'md:col-span-2'
            : 'md:col-span-1'} transition-transform duration-300 hover:scale-[1.02]"
        >
          <!-- Replaced .card and harsh shadows with glass utilities and padding -->
          <article
            class="rounded-4xl h-full flex flex-col gap-4 p-6 md:p-8 rounded-card-sm bg-white/10 backdrop-blur-2xl border border-white/20 shadow-sm transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30 group-hover:shadow-lg"
          >
            <!-- Softened font-extrabold to font-semibold for Apple typography -->
            <h3
              class="font-display text-ink text-xl sm:text-2xl md:text-3xl font-semibold leading-tight tracking-tight"
            >
              {project.name}
            </h3>

            <p
              class="text-ink-soft text-base md:text-lg leading-relaxed flex-1"
            >
              {project.summary}
            </p>

            <div class="flex flex-wrap gap-2 mt-auto pt-2">
              {#each project.tags as tag}
                <!-- Replaced .pill with subtle glass badges -->
                <span
                  class="inline-flex items-center justify-center px-3 py-1 text-xs md:text-sm font-medium rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-ink-soft transition-colors duration-300 group-hover:bg-white/10 group-hover:text-ink"
                >
                  {tag}
                </span>
              {/each}
            </div>
          </article>
        </a>
      {/each}
    </div>

    <div class="mt-10 md:mt-12 flex justify-center">
      <a
        href="https://github.com/Guuzzeji"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-ink-soft font-mono text-sm transition-colors duration-200 hover:text-ink"
      >
        <span class="text-base" aria-hidden="true">&nearr;</span>
        Follow me on <span class="font-semibold">GitHub @Guuzzeji</span>
      </a>
    </div>
  </div>
</section>
