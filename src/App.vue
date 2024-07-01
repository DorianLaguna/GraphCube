<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<div class="min-h-screen flex flex-col">
  <header class="h-24">
    <!-- <div class=""> -->
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav> -->
    <!-- </div> -->
    <h1 class="justify-center items-center flex h-24 text-6xl font-bold">
      Cube graph
    </h1>
  </header>

  <RouterView class="flex-grow" />
</div>
</template>
