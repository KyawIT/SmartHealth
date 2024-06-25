<script lang="ts">
  import { onMount } from "svelte";

  let auth: string | null = null;
  let text = "";
  let healthData: any[] = [];

  onMount(() => {
    if (typeof window !== "undefined") {
      auth = sessionStorage.getItem('token');
    }
    
  });
  async function handleSubmit() {
    const objData = {
      sentence: text
    };
    const response = await fetch('http://127.0.0.1:5000/find_similar_symptom/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objData),
      });
    const data = await response.json();
    healthData = data.Sicknesses;
    console.log(healthData);
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit();
    }
  }
</script>

<div id="container">
  <h5
    class="p-5 mb-5 text-6xl font-black text-indigo-500 text-center"
  >
    SICK? SEARCH HERE
  </h5>
  <form id="form1" on:submit={handleSubmit} class="max-w-sm mx-auto">
    <textarea
      bind:value={text}
      id="message"
      rows="4"
      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="I have headache, fever..."
      on:keydown={handleKeyPress}
    ></textarea>
  </form>
  <div class="mt-5 text-center">
    {#if healthData.length > 0}
      <p class="text-center text-2xl text-blue-500">most likely </p>
      <p class="text-7xl font-bold text-blue-600"><a href="https://www.google.com/search?q={healthData[0]}" target="_blank">{healthData[0]}</a></p>
    {/if}
    {#if auth && healthData.length > 0}
    <div class="mt-5 "> 
       <p class="text-center text-2xl text-blue-600">can be also </p>
      {#each healthData.slice(1) as data}
        <p class="text-4xl font-semibold text-black">{data}</p>
      {/each}
     </div>
      {:else if !auth}
      <p class="text-center text-2xl text-blue-600"><a class="underline hover:no-underline" href="/auth/login">LOGIN</a> for more!</p>
    {/if}
    
  </div>
</div>

<style>
  #container {
    min-height: 100vh;
  }
</style>
