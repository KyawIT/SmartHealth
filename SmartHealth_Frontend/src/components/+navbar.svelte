<script>
  import { onMount } from "svelte";
  let auth = false;
  let displayName = "";
  let image = "";

  onMount(async () => {
    let token = sessionStorage.getItem("token");
    if (token) {
      auth = true;
      const response = await fetch("http://localhost:3000/auth/decodejwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const userData = await response.json();
      console.log(userData);

      displayName = userData.display_name || userData.user.display_name ;
      image =  userData.photo_url || userData.user.photo_url;
    } else {
      try {
        const responseData = await fetch("http://localhost:3000/auth/profile", {
          credentials: "include", // Important for including cookies
        });
        
        if (responseData.ok) {
          const data = await responseData.json();
          console.log(data);
          auth = true;
          sessionStorage.setItem("token", data.token);
          displayName = data.displayName || data.user.display_name;
          image = data.photos ? data.photos[0].value : data.user.photo_url;
        } else {
          console.log("Unauthorized");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  });

  function SignOut() {
    sessionStorage.removeItem("token");
    location.reload();
  }
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-900">
  <div
    class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
  >
    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="/Logo6Corners/logo.svg" class="h-8" alt="Flowbite Logo" />
      <span
        class=" self-center text-2xl font-bold whitespace-nowrap dark:text-white"
        >SmartHealth</span
      >
    </a>
    <button
      data-collapse-toggle="navbar-default"
      type="button"
      class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-default"
      aria-expanded="false"
    >
      <span class="sr-only">Open main menu</span>
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 17 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M1 1h15M1 7h15M1 13h15"
        />
      </svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul
        class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
      >
        <li>
          <a
            href="/"
            id="home"
            class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >Home</a
          >
        </li>
        <li>
          <a
            href="/about"
            id="about"
            class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >About</a
          >
        </li>
        <li>
          <a
            href="/contact"
            id="contact"
            class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >Contact</a
          >
        </li>
        {#if auth}
          <li>
            <a
              href=""
              id="login"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              on:click={SignOut}>Signout</a
            >
          </li>
          <li>
            <a
              href="#"
              id="displayName"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >{displayName}</a
            >
          </li>
          <li>
            <a
              href="#"
              id="image"
              class="w-8 h-8 rounded-full"
              ><img src={image} width="30" /></a
            >
          </li>
        {:else}
          <li>
            <a
              href="/auth/login"
              id="login"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Login</a
            >
          </li>
          <li>
            <a
              href="/auth/signup"
              id="sign"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Sign Up</a
            >
          </li>
        {/if}

        <li>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3">
              <img
                class="toggle"
                src="/frontend/toggle.png"
                alt="Picture"
                aria-hidden="true"
              />
            </span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</nav>

<style>
  .toggle {
    height: 2em;
  }
</style>
