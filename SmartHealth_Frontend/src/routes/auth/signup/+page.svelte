<script lang="ts">
  import { redirect } from "@sveltejs/kit";

  let email = "";
  let password = "";
  let display_name = "";
  let photo_url = "";

  interface ResponseData {
    message: string;
    token: string;
  }



  async function handleSubmit(event: Event) {
      event.preventDefault();
      const data = {
        email,
        password,
        display_name,
        photo_url,
      };
      try {
        const response = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responseData:ResponseData = (await response.json());
        if (responseData.message === "User registered successfully") {
          sessionStorage.setItem("token", responseData.token);
        }
        window.location.href = "/";        
      } catch (error) {
        console.error(error);
      }
    }
</script>

<div id="container">
  <h1
    class="py-5 text-6xl font-black text-blue-600 dark:text-blue-600 text-center"
  >
    SIGNUP
  </h1>
  <form class="max-w-sm mx-auto" on:submit={handleSubmit}>
    <div class="mb-5">
      <label
        for="base-input"
        class="block mb-2 text-sm font-medium text-gray-900">Email</label
      >
      <input
        bind:value={email}
        required
        type="text"
        id="base-input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mb-5">
      <label for="base-input" class="block mb-2 text-sm font-medium text-black"
        >Password</label
      >
      <input
        bind:value={password}
        required
        type="password"
        id="base-input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mb-5">
      <label
        for="base-input"
        class="block mb-2 text-sm font-medium text-gray-900">Username</label
      >
      <input
        bind:value={display_name}
        required
        type="text"
        id="base-input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <div class="mb-5">
      <label
        for="base-input"
        class="block mb-2 text-sm font-medium text-gray-900">Image URL</label
      >
      <input
        bind:value={photo_url}
        type="text"
        id="base-input"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>

    <button
      type="submit"
      class="mb-5 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Register</button
    >
  </form>
</div>

<style>
  #container {
    min-height: 100vh;
    background-color: #ffffff;
    background-image: url("https://source.unsplash.com/1600x900/?health");
  }
</style>
