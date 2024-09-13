<script setup>
    import GameView from './GameView.vue';
    import RenderModelView from './RenderModelView.vue';
</script>

<template>
    <div class="flex flex-col md:flex-row justify-between md:p-10 md:gap-5">
        <div class="w-full md:w-1/2">
            <GameView />
        </div>
        <div class="w-full md:w-1/2">
            <RenderModelView />
        </div>
    </div>
</template>
