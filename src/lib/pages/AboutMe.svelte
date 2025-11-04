<script>
  import WAVE_ICON from "../../assets/icons/Waving Hand.svg";
  import POINTER_ICON from "../../assets/icons/Index Pointing Up.svg";

  import WordRotate from "../components/WordRotate.svelte";
  import { fade } from "svelte/transition";

  let showAboutMeInfo = $state(false);
  let handleShowContent = () => {
    showAboutMeInfo = true;
    console.log(showAboutMeInfo);
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
      <div class="text-3xl mt-3 ml-3 font-weight-500">
        <img
          class="text-md inline item-center h-10 w-10 mb-2"
          src={WAVE_ICON}
          alt="wave hand"
        />
        Hello, I'm Gabe
      </div>
      <p class="m-3">
        <i
          >(a.k.a. Guuzzeji Online! A full-stack developer and backend
          developer)</i
        >
      </p>
      <p class="m-3">
        I'm a full-stack developer with a serious passion for the backend.
        There's nothing I love more than architecting the robust, scalable
        systems that power great user experiences! (at least when things don't
        crash)
      </p>
      <p class="m-3">
        I recently graduated from Pacific Lutheran University with a B.S. in
        Computer Science and a minor in Data Science.
      </p>
      <p class="m-3">
        During my four internships at Microsoft, I was a core contributor to
        Xbox Live Services. I specialized in building and maintaining the
        high-performance leaderboard and ranking systems trusted by thousands of
        game studios and utilized by millions of players globally. This
        experience taught me how to deliver reliability at massive scale.
      </p>
      <p class="m-3">
        I thrive on coding and continuous learning, and I'm always on the hunt
        for the next big technical challenge to conquer.
      </p>
      <p class="m-3">
        When I'm not writing APIs or debugging a service, you can find me:
      </p>
      <ul class="ml-10 list-disc">
        <li>Gaming (of course!), but I need to get off of World of Warcraft</li>
        <li>Watching movies, Scarface!</li>
        <li>Reading books, mostly sci-fi, the future is written in books!</li>
        <li>Editing YouTube videos</li>
        <li>Tyler the Creator FAN!!!</li>
      </ul>
    </div>
  {/if}
</div>
