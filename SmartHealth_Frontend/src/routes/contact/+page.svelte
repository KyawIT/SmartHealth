<script>
  let name = "";
  let email = "";
  let subject = "";
  let message = "";

  const data = {
    name: name,
    email: email,
    subject: subject,
    message: message,
  };

  async function postData() {
    try {
      const url = "http://localhost:3000/email/sendEmail";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw Error;
    }
  }

  function clearInput() {
    data.name = "";
    data.email = "";
    data.subject = "";
    data.message = "";
  }
</script>

<div id="container">
  <h1
    class="my-5 text-6xl font-black text-blue-600 dark:text-blue-600 text-center"
  >
    GET IN TOUCH
  </h1>
  <div class="grid grid-cols-2 gap-x-5 mx-10">
    <img
      src="\frontend\contact.png"
      class="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
      alt="Error"
    />

    <form class="flex flex-col justify-center">
      <div>
        <input
          bind:value={data.name}
          id="Name"
          class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Name"
        />
      </div>
      <div>
        <input
          bind:value={data.email}
          id="Email"
          class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="E-Mail"
        />
      </div>
      <div>
        <input
          bind:value={data.subject}
          id="Subject"
          class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Subject"
        />
      </div>
      <div>
        <textarea
          bind:value={data.message}
          id="Message"
          class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Message"
        ></textarea>
      </div>
      <div>
        <button
          on:click={() => {
            postData();
            clearInput();
          }}
          type="submit"
          class="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >Submit</button
        >
      </div>
    </form>
  </div>
</div>

<style>
  #container {
    min-height: 100vh;
    background-color: #ffffff;
  }
</style>
