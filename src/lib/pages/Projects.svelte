<script lang="ts">
  import axios from "axios";
  import type { Project } from "../types";
  import { onMount } from "svelte";

  let loadingContent = $state("loading");
  let projects: Project[] = $state([]);

  const BASE_URL =
    "https://api.github.com/users/Guuzzeji/repos?sort=pushed&direction=desc&per_page=15";

  onMount(() => {
    axios
      .get(BASE_URL)
      .then((response) => {
        // console.log(response);
        projects = response.data;
      })
      .catch((error) => {
        // console.log(error);
        loadingContent = "error";
      })
      .finally(() => {
        loadingContent = "success";
      });
  });
</script>

<div class="w-full h-full p-3 overflow-y-scroll">
  <div class="max-w-prose mx-auto py-8 text-center">
  <span class="text-3xl font-extrabold m-2 text-orange-400">Projects</span>
  {#if loadingContent === "loading"}
    <p class="text-white">Loading content...</p>
  {:else if loadingContent === "success"}
    <div class="m-2">
      <p class="font-medium text-white">
        <i>
          (Follow me on <a class="underline text-white" href="https://github.com/Guuzzeji"
            >GitHub @Guuzzeji</a
          >)
        </i>
      </p>
    </div>
    {#each projects as project}
      <div class="m-2">
        <p class="font-bold text-white">
          <a class="underline text-orange-400" href={project.html_url}>{project.name}</a>
          {#if project.language !== null && project.language !== undefined && project.language != ""}
            - {project.language}
          {/if}
        </p>
        {#if project.description}
          <p class="m-2 font-medium text-white text-left">{project.description}</p>
        {:else}
          <p class="m-2 font-medium text-white text-left">No description available</p>
        {/if}
      </div>
      {#if projects.indexOf(project) !== projects.length - 1}
        <hr class="border-white/20" />
      {/if}
    {/each}
  {/if}
  </div>
</div>
