<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage :transition="{
      name: 'page',
      mode: 'out-in'
    }" />
  </div>
</template>
