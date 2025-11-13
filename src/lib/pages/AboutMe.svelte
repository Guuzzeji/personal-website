<script>
  import WAVE_ICON from "../../assets/icons/Waving Hand.svg";
  import POINTER_ICON from "../../assets/icons/Index Pointing Up.svg";

  import WordRotate from "../components/WordRotate.svelte";
  import { fade } from "svelte/transition";

  let showAboutMeInfo = $state(false);
  let handleShowContent = () => {
    showAboutMeInfo = true;
    // console.log(showAboutMeInfo);
  };
</script>

<div class="w-full h-full p-3 md:overflow-y-hidden overflow-y-scroll">
  {#if !showAboutMeInfo}
    <div out:fade={{ duration: 500 }} class="w-full h-full overflow-hidden">
      <button
        onclick={handleShowContent}
        class="grid content-center w-full h-full cursor-pointer"
      >
        <WordRotate
          class="md:text-9xl text-8xl font-[time] font-bold"
          duration={1000}
          words={["Who", "is", "Gabe?", "What", "does", "Gabe", "do?"]}
        />
      </button>
      <div class="grid content-center w-full h-5">
        <div class="text-center mb-15">
          Click to learn
          <img
            class="text-md inline item-center h-5 w-5 mb-2"
            src={POINTER_ICON}
            alt="Pointer"
          />
        </div>
      </div>
    </div>
  {:else}
    <div class="w-full h-full" in:fade={{ delay: 1000, duration: 1000 }}>
      <div class="md:text-3xl text-2xl mt-3 ml-3 font-weight-500">
        <img
          class="text-md inline item-center h-10 w-10 mb-2"
          src={WAVE_ICON}
          alt="wave hand"
        />
        Hello, I'm Gabe
      </div>
      <p class="m-3 md:text-2xl text-sm">
        <i
          >(a.k.a. Guuzzeji Online! A full-stack developer and backend
          developer)</i
        >
      </p>
      <div class="md:text-xl">
        <p class="m-3">
          I am a full-stack developer with a strong focus and passion for the
          backend, specializing in architecting robust and scalable systems. I
          recently earned a B.S. in Computer Science and a minor in Data Science
          from Pacific Lutheran University. I thrive on coding, continuous
          learning, and am constantly seeking out new and complex technical
          challenges to conquer.
        </p>
        <p class="m-3">
          My practical experience includes four internships at Microsoft, where
          I was a core contributor to Xbox Live Services. In this role, I
          specialized in building and maintaining the high-performance
          leaderboard and ranking systems used by thousands of game studios and
          millions of global players. This intense experience was instrumental
          in teaching me how to deliver high reliability and performance at a
          massive, global scale.
        </p>
        <p class="m-3">
          Outside of coding, I also enjoy playing video games (I need to get off
          of World of Warcraft), watching movies (Scarface!), reading books
          (mostly sci-fi), and editing YouTube videos. I am a big fan of Tyler
          the Creator and his music.
        </p>
        <br />
      </div>
    </div>
  {/if}
</div>
