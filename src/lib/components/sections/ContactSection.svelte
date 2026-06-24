<script lang="ts">
  import { Motion } from "svelte-motion";

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 17,
  };

  const contactData = [
    {
      href: "mailto:gabe.business.code@outlook.com",
      icon: "📧",
      title: "Email",
      subtitle: "gabe.business.code@outlook.com",
    },
    {
      href: "https://www.reddit.com/user/Guuzzeji/",
      icon: "🌐",
      title: "Reddit",
      subtitle: "@Guuzzeji",
    },
    {
      href: "https://www.youtube.com/@guuzzeji",
      icon: "📺",
      title: "YouTube",
      subtitle: "@Guuzzeji",
    },
    {
      href: "https://github.com/Guuzzeji",
      icon: "🐙",
      title: "GitHub",
      subtitle: "@Guuzzeji",
    },
    {
      href: "https://twitter.com/Guuzzeji",
      icon: "🐦",
      title: "Twitter/X",
      subtitle: "@Guuzzeji",
    },
    {
      href: "https://backr00m.xyz/",
      icon: "👨‍💻",
      title: "Blog",
      subtitle: "backr00m.xyz",
    },
  ];
</script>

<section id="contact" class="section bg-canvas text-ink">
  <div class="max-w-2xl mx-auto">
    <h2
      class="text-center font-display text-ink text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-12 md:mb-16"
    >
      Contacts &amp; Socials
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
      {#each contactData as contact}
        <Motion
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={springTransition}
          let:motion
        >
          <a
            use:motion
            href={contact.href}
            class="group rounded-4xl flex items-center gap-4 p-5 rounded-card-sm bg-white/10 backdrop-blur-2xl border border-white/20 shadow-sm transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-md"
          >
            <!-- Optional: You can add 'text-accent' here if you want the icon to be iMessage blue -->
            <span class="text-2xl drop-shadow-sm" aria-hidden="true"
              >{contact.icon}</span
            >

            <div>
              <h3
                class="font-display text-ink text-lg md:text-xl font-semibold leading-tight tracking-tight"
              >
                {contact.title}
              </h3>
              <p class="text-ink-soft text-sm mt-0.5">
                {contact.subtitle}
              </p>
            </div>
          </a>
        </Motion>
      {/each}
    </div>
  </div>
</section>
