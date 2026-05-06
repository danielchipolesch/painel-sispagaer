<template>
  <v-app :theme="theme">
    <router-view />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('pagTheme')
</script>

<style>
/* Global resets and base styles */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

/* Scrollbar customization */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #ECEFF4;
}
::-webkit-scrollbar-thumb {
  background: #90A4AE;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #546E7A;
}
</style>
