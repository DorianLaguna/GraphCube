<script setup>
    import GameView from './GameView.vue';
    import RenderModelView from './RenderModelView.vue';
</script>

<template>
    <div class="flex flex-col justify-start md:justify-start md:flex-row md:p-10 md:gap-5">
        <div class="w-full flex justify-end items-start md:w-1/2 p-2 md:p-0">
            <GameView />
        </div>
        <div class="w-full md:w-1/2 md:pt-16">
            <RenderModelView />
        </div>
    </div>
</template>
