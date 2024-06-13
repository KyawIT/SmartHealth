<script lang="ts">
  let text = "";
  let healthData: any[] = [];
  async function handleSubmit(event: Event) {
    event.preventDefault();
    const response = await fetch(
      `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${text}&df=term_icd9_code,primary_name`,
    );
    const data = await response.json();
    healthData = data;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
  }
</script>

<div id="container">
  <h5
    class="p-5 mb-5 text-6xl font-black text-white dark:text-white text-center"
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
  {#if healthData.length > 0}
    <div class="flex flex-wrap justify-center mt-5">
      {#each healthData[3] as item}
        <div class="m-2 p-2 bg-gray-100 rounded-lg">
          <a
            target="_blank"
            class="hover:underline"
            href="https://www.google.com/search?q={item[1]}">{item[1]}</a
          >
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  #container {
    min-height: 100vh;
    background: #1e293b;
  }
</style>
