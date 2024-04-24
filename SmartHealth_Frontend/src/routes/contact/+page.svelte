<script>
    let user_name = '';
    let email = '';
    let subject = '';
    let message = '';

    function getForm(){
        console.log(`${user_name} ${email} ${subject} ${message}`);
    }
</script>

<div id="container">

    <br>
    <h1 class="text-center">Get In Touch</h1>
    <br> 

        <img align="right"  src="\frontend\contact.png" alt="Error" height="300px" width="300px" />

        <form>

            <ul class="contactform ml-2 pl-2 pt-2 pb-2 pr-2 border-2">
                <li>
                    <textarea bind:value={user_name} id="Name" rows="1" class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name..."></textarea>
                </li>
                <li>
                    <textarea bind:value={email} id="Email" rows="1" class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E-Mail..."></textarea>
                </li>
                <li>
                    <textarea bind:value={subject} id="Subject" rows="1" class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Subject..."></textarea>
                </li>
                <li>
                    <textarea bind:value={message} id="Message" rows="3" class="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Message..."></textarea>
                </li>
                <li>
                    <button on:click={getForm} type="submit" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">Submit</button>
                </li>
            </ul>
        </form>       
</div>

<style>
.contactform{
    border-color: blue;
    margin-right: 600px;
}

img{
    margin-right: 150px;
}
</style>