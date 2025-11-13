<script lang="ts">
  // Assets
  import ABOUT_ME_ICON from "./assets/icons/Winking Face With Tongue.svg";
  import FUN_ICON from "./assets/icons/Unicorn.svg";
  import WORK_ICON from "./assets/icons/Necktie.svg";
  import CONTACT_ICON from "./assets/icons/Open Mailbox With Raised Flag.svg";
  import PROJECT_ICON from "./assets/icons/Open File Folder.svg";

  // Pages
  import AboutMe from "./lib/pages/AboutMe.svelte";
  import WorkExperience from "./lib/pages/WorkExperience.svelte";
  import Projects from "./lib/pages/Projects.svelte";
  import Contact from "./lib/pages/Contact.svelte";

  // Components
  import DockIcon from "./lib/components/DockIcon.svelte";
  import Dock from "./lib/components/Dock.svelte";
  import IPod from "./lib/components/IPod.svelte";
  import SpinningText from "./lib/components/SpinningText.svelte";
  import { fade, blur } from "svelte/transition";

  let currentPage = $state("about-me");
  function handlePageChange(page: string) {
    if (page === currentPage) return;
    currentPage = page;
  }

  let showIPodPlayer = $state(true);
</script>

<main>
  <!-- Background -->
  <div>
    <img
      class="absolute z-1 w-full h-full p-40vh object-cover"
      src="/background/main.jpg"
      alt="Background"
    />
  </div>
  <!-- Foreground -->
  <div class="flex h-screen p-5 overflow-hidden">
    {#if showIPodPlayer}
      <div
        out:blur={{ duration: 500 }}
        in:blur={{ duration: 500 }}
        class="grid z-2 pointer-events-none place-items-center absolute -translate-x-5 -translate-y-5 md:translate-y-1 md:-translate-x-1 md:w-[97%] md:h-[95%] w-full h-full overflow-hidden"
      >
        <SpinningText
          class="text-7xl text-orange-500 font-weight-800"
          radius={8.5}
          children="click me • learn about me • click me • do something • bruh just be cool"
        />
      </div>
      <div
        in:blur={{ duration: 500 }}
        out:blur={{ duration: 500 }}
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:h-2/3 min-w-full max-w-full md:min-w-2/3 md:max-w-2/3 drop-shadow-xl/50 bg-[rgba(255,255,255,0.5)] backdrop-blur p-5 z-1 md:rounded-4xl overflow-hidden grid content-center place-content-center"
      >
        <IPod onHomeBtnClick={() => (showIPodPlayer = false)} />
      </div>
    {:else}
      <div
        class="absolute drop-shadow-xl/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-10/16 grid place-items-center m-auto h-2/3 min-w-14/16 max-w-1/2 md:min-w-2/3 md:max-w-2/3 bg-[rgba(255,255,255,0.5)] backdrop-blur p-4 z-1 rounded-md overflow-hidden"
        in:blur={{ delay: 500, duration: 1000 }}
      >
        <div class="h-full w-full border rounded-md overflow-hidden">
          {#if currentPage === "about-me"}
            <div
              class="h-full w-full"
              in:fade={{ duration: 1000 }}
              out:fade={{ duration: 400 }}
            >
              <AboutMe />
            </div>
          {:else if currentPage === "work-experience"}
            <div
              class="h-full w-full"
              in:fade={{ duration: 1000 }}
              out:fade={{ duration: 400 }}
            >
              <WorkExperience />
            </div>
          {:else if currentPage === "projects"}
            <div
              class="h-full w-full"
              in:fade={{ duration: 1000 }}
              out:fade={{ duration: 400 }}
            >
              <Projects />
            </div>
          {:else if currentPage === "contacts"}
            <div
              class="h-full w-full"
              in:fade={{ duration: 1000 }}
              out:fade={{ duration: 400 }}
            >
              <Contact />
            </div>
          {/if}
        </div>
      </div>
      <div
        in:blur={{ delay: 500, duration: 1000 }}
        class="drop-shadow-xl/50 absolute md:inset-x-6/16 bottom-10 flex justify-center items-center bg-[rgba(255,255,255,0.5)] backdrop-blur h-3/32 md:min-h-3/32 md:max-h-3/32 min-w-14/16 max-w-1/2 md:min-w-4/16 md:max-w-4/16 p-4 z-1 rounded-md overflow-hidden"
      >
        <Dock
          let:magnification
          let:distance
          let:mouseX
          magnification={60}
          distance={110}
          direction="bottom"
          class="align-bottom overflow-hidden"
        >
          <DockIcon {mouseX} {magnification} {distance}>
            <button
              class="cursor-pointer"
              onclick={() => handlePageChange("projects")}
            >
              <img class="h-7 w-7" src={PROJECT_ICON} alt="Projects" />
            </button>
          </DockIcon>
          <DockIcon {mouseX} {magnification} {distance}>
            <button
              class="cursor-pointer"
              onclick={() => handlePageChange("work-experience")}
            >
              <img class="h-7 w-7" src={WORK_ICON} alt="Work Experience" />
            </button>
          </DockIcon>
          <DockIcon {mouseX} {magnification} {distance}>
            <button
              class="cursor-pointer"
              onclick={() => handlePageChange("about-me")}
            >
              <img class="h-7 w-7" src={ABOUT_ME_ICON} alt="About me" />
            </button>
          </DockIcon>
          <DockIcon {mouseX} {magnification} {distance}>
            <button
              class="cursor-pointer"
              onclick={() => handlePageChange("contacts")}
            >
              <img class="h-7 w-7" src={CONTACT_ICON} alt="Contact" />
            </button>
          </DockIcon>
          <DockIcon {mouseX} {magnification} {distance}>
            <a
              class="cursor-pointer"
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            >
              <img class="h-7 w-7" src={FUN_ICON} alt="Fun" />
            </a>
          </DockIcon>
        </Dock>
      </div>
    {/if}
  </div>
</main>
