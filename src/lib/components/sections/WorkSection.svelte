<script lang="ts">
  let visible = $state<Record<number, boolean>>({});

  function inView(node: HTMLElement, i: number) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible[i] = true;
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  const roles = [
    {
      title: "Database System Researcher Engineer",
      company: "Moment",
      date: "October 2025 – May 2026",
      description:
        "Architected a local-first, reactive data engine for collaborative applications, leveraging Incremental View Maintenance (IVM) to calculate and stream granular delta updates. Reduced network payload sizes by 85% and decreased average query latency from 120ms to under 5ms, ensuring strict real-time consistency between localized client state and the relational backend.",
    },
    {
      title: "Software Engineer Intern",
      company: "Microsoft",
      date: "June 2025 – August 2025",
      description:
        "Collaborated with the Xbox Live team (PlayFab) to architect and implement a new event-driven model for leaderboards and player statistics using PlayStream, developing both the React.js front-end and the C# back-end integration. I engineered and deployed event-driven processing via WebHooks, leveraging Azure CosmosDB and Kusto for scalable storage and analytics, and managed applications using Kubernetes and Azure DevOps. The feature was successfully released and documented, leading to rapid adoption by multiple external game studios.",
    },
    {
      title: "Software Engineer Intern",
      company: "Microsoft",
      date: "June 2024 – August 2024",
      description:
        "I partnered with the Xbox Live team (PlayFab) to engineer tools and services supporting game studios in implementing Large Language Models (LLMs) for automated task execution, focusing on Microsoft Semantic Kernel for building and optimizing AI agents. I applied advanced prompting techniques to integrate LLMs at scale into customer-facing products, designing intuitive React.js user experiences. Additionally, I drove the implementation of scalable deployment and monitoring pipelines for these LLM integrations using frameworks like Semantic Kernel and Azure OpenAI Services, ensuring reliability and performance.",
    },
    {
      title: "Explore Intern",
      company: "Microsoft",
      date: "May 2023 – August 2023",
      description:
        "I delivered scalable tools and services with the Xbox Live Leaderboards team to enhance cross-platform player engagement for both third-party and first-party game titles. I combined software engineering and project management expertise to successfully deliver a customer engagement feature that notably increased retention, utilizing a hybrid cloud stack composed of AWS and Azure services.",
    },
    {
      title: "Discovery Program Intern",
      company: "Microsoft",
      date: "July 2022 – August 2022",
      description:
        "I drove the customer-centric evolution of the Xbox Wishlist feature, prototyping enhanced UX designs in Figma and building interactive React.js mockups to align the feature with core user needs and cross-ecosystem engagement behaviors",
    },
  ];
</script>

<section id="work" class="section bg-canvas text-ink">
  <div class="relative mx-auto max-w-3xl">
    <h2
      class="font-display text-ink text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-12 md:mb-16"
    >
      Work Experience
    </h2>

    <div class="relative">
      <div
        class="hidden md:block absolute left-[10.25rem] top-0 bottom-0 w-0.5 bg-ink/15 rounded-full"
        aria-hidden="true"
      ></div>

      <ol class="flex flex-col gap-10 md:gap-12">
        {#each roles as role, i}
          <li
            use:inView={i}
            class:is-visible={visible[i]}
            class="timeline-card flex flex-col md:grid md:grid-cols-[10rem_1fr] md:gap-6 relative group"
            style="transition-delay: {i * 0.1}s"
          >
            <!-- Left Column: Date and Company -->
            <div
              class="flex md:flex-col items-start gap-2 md:items-end md:pr-0 md:pt-1 pb-5 flex-row-reverse justify-center md:justify-start"
            >
              <!-- Updated the pill to be a frosted glass badge -->
              <span
                class="inline-flex items-center justify-center w-55 px-4 py-1.5 text-sm font-medium rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-ink shadow-sm transition-colors duration-300 group-hover:bg-white/15 group-hover:border-white/30"
              >
                {role.date}
              </span>
              <span
                class="font-mono md:text-xs text-sm text-ink-soft font-semibold tracking-wide uppercase mt-1"
              >
                {role.company}
              </span>
            </div>

            <!-- Right Column: Glass Content Card -->
            <!-- Replaced the generic 'card' class with Tailwind glass utilities -->
            <article
              class="rounded-4xl p-6 md:p-8 rounded-card-sm bg-white/10 backdrop-blur-2xl border border-white/20 shadow-sm transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30 group-hover:shadow-md"
            >
              <h3
                class="font-display text-ink text-lg md:text-xl font-semibold leading-snug tracking-tight mb-2"
              >
                {role.title}
              </h3>
              <p class="text-ink-soft text-sm md:text-base leading-relaxed">
                {role.description}
              </p>
            </article>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>

<style>
  .timeline-card {
    opacity: 0;
    transform: translateY(40px);
    transition:
      opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .timeline-card.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
