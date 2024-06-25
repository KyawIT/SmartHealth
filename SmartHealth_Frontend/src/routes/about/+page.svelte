<script lang="ts">

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
</script>

<div class="relative">
    <div class="sticky top-0 h-screen flex flex-col items-center justify-center bg-emerald-400" id="firstSlide">
        <h1 class="my-5 text-6xl font-black text-blue-600 dark:text-blue-600 text-center">
            ABOUT <i>US</i> & <i>OUR</i> PROJECT
        </h1>
        <p>Click to scroll down</p>
        <a href="#secondSlide"><img src="./svgs/down_arrow.svg" width="100" height="100" /></a>
    </div>

    <div class="sticky top-0 h-screen flex flex-col items-center justify-center bg-indigo-600 text-white"
        id="secondSlide">
        <h1 class="mb-5 text-6xl font-black text-white dark:text-white text-center">
            SmartHealth
        </h1>
        <div class="flex justify-center drop-shadow-2xl">
            <img class="image rounded-t-lg" src="\Logo6Corners\logo_large.png" alt="" />
        </div>
        <div class="mt-5 h-auto">
            <p class="text-2xl font-medium text-white text-justify">
                <span class="font-extrabold hover:italic">SmartHealth</span> uses
                <span class="font-bold italic">Embeddings</span> to diagnose
                <span class="font-bold italic">illnesses</span>
                based on <span class="font-bold italic">symptoms</span>
                and helps users find nearby
                <span class="font-bold italic">healthcare</span> providers.
            </p>
        </div>
        <a class="" href="#thirdSlide"><img src="./svgs/down_arrow.svg" width="100" height="100" /></a>
    </div>

    <div class="sticky top-0 h-screen flex flex-col items-center justify-center bg-rose-600 text-white" id="thirdSlide">
        <h5 class="text-6xl font-black text-white dark:text-white text-center">
            Contributors
        </h5>
        <div class="flex justify-center">
            <img class="image rounded-t-lg" src="/frontend/about3.png" alt="" />
        </div>
        <p class="text-2xl font-medium text-white text-center">
            <span class="font-extrabold hover:italic">Kyaw</span> is a skilled
            <span class="underline hover:no-underline">Full-Stack-Dev</span><br /><span
                class="font-extrabold hover:italic">Nikola</span> specializes in
            <span class="underline hover:no-underline">Frontend-Dev</span><br /><span
                class="font-extrabold hover:italic">Tobias</span>
            excels in <span class="underline hover:no-underline">Backend</span>
            Development
        </p>
        <a class="" href="#fourthSlide"><img src="./svgs/down_arrow.svg" width="100" height="100" /></a>
    </div>

    <div class="sticky top-0 h-screen flex flex-col items-center justify-center bg-neutral-800 text-white" id="fourthSlide">
        <h5 class="text-6xl font-black text-white dark:text-white text-center">
            Future
        </h5>
        <div class="flex justify-center">
            <img class="image rounded-t-lg" src="/frontend/about2.png" alt="" />
        </div>
        <p class="w-3/4 text-2xl font-medium text-gray-700 dark:text-gray-400 text-justify">
            <span class="font-extrabold hover:italic">SmartHealth</span> aims to enhance AI for accurate diagnoses, expand
            features,
            integrate with global networks, prioritize user engagement, and ensure
            regulatory compliance.
        </p>
        <a class="last-slide-arrow" href="" on:click={scrollToTop()}><img src="./svgs/down_arrow.svg" width="100"
                height="100" /></a>
    </div>
</div>

<style>
    #container {
        min-height: 100vh;
    }

    .image {
        height: 20em;
    }

    .last-slide-arrow {
        transform: rotate(180deg);
    }
</style>