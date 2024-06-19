<script lang="ts">
  function redirectToGoogleAuth() {
    window.location.href = "http://localhost:3000/auth/google";
  }

  function redirectToGithubAuth() {
    window.location.href = "http://localhost:3000/auth/github";
  }
  let email = "";
  let password = "";
  async function handleSubmit() {
    const data = {
      email,
      password,
    };
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        sessionStorage.setItem('token', result.token);
        window.location.href = 'http://localhost:5173/';
        
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }


  }
</script>

<div id="container">
  <h1
    class="py-5 text-6xl font-black text-blue-600 dark:text-blue-600 text-center"
  >
    LOGIN
  </h1>
  <form class="max-w-sm mx-auto">
    <div class="mb-5">
      <label for="base-input" class="block mb-2 text-sm font-medium"
        >Email</label
      >
      <input
      bind:value={email}
        type="text"
        id="base-input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm
        rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mb-5">
      <label
        for="base-input"
        class="block mb-2 text-sm font-medium text-gray-900">Password</label
      >
      <input
        bind:value={password}
        type="password"
        id="base-input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="grid grid-cols-1 gap-y-5 mb-5">
      <div class="grid grid-cols-1 gap-y-5 mb-5">
        <button
          on:click={() => handleSubmit()}
          type="submit"
          class="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >Login</button
        >
        <p class="text-xl text-center text-black">
          Authenticate with other Services
        </p>

        <button
          on:click={() => redirectToGithubAuth()}
          type="button"
          class="inline-flex items-center justify-center w-full text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
        >
          <svg
            class="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              clip-rule="evenodd"
            />
          </svg>
          Sign in with Github
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
          on:click={() => redirectToGoogleAuth()}
        >
          <svg
            class="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              fill-rule="evenodd"
              d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
              clip-rule="evenodd"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  </form>
</div>

<style>
  #container {
    min-height: 100vh;
    background-color: #ffffff;
  }
</style>
