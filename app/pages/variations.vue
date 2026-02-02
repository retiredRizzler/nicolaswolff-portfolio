<template>
  <div class="variations-page">
    <!-- Variation Selector -->
    <div class="variation-selector">
      <h1 class="selector-title">Choose Your Story</h1>
      <div class="selector-buttons">
        <button
          v-for="variation in variations"
          :key="variation.id"
          @click="currentVariation = variation.id"
          :class="['selector-button', { active: currentVariation === variation.id }]"
        >
          <span class="button-icon">{{ variation.icon }}</span>
          <span class="button-label">{{ variation.name }}</span>
          <span class="button-description">{{ variation.description }}</span>
        </button>
      </div>
    </div>

    <!-- Render selected variation -->
    <div class="variation-content">
      <CinematicScroll v-if="currentVariation === 'cinematic'" />
      <EditorialStory v-if="currentVariation === 'editorial'" />
      <InteractiveGallery v-if="currentVariation === 'interactive'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CinematicScroll from '~/components/sections/CinematicScroll.vue'
import EditorialStory from '~/components/sections/EditorialStory.vue'
import InteractiveGallery from '~/components/sections/InteractiveGallery.vue'

const currentVariation = ref('cinematic')

const variations = [
  {
    id: 'cinematic',
    name: 'Cinematic Scroll',
    icon: '🎬',
    description: 'Full-screen parallax with scroll reveals'
  },
  {
    id: 'editorial',
    name: 'Editorial Story',
    icon: '📖',
    description: 'Magazine-style asymmetric layouts'
  },
  {
    id: 'interactive',
    name: 'Interactive Gallery',
    icon: '🎞️',
    description: 'Horizontal scroll & split-screen'
  }
]

useHead({
  title: 'Style Variations - Nicolas Wolff',
  meta: [
    { name: 'description', content: 'Explore different storytelling approaches for the portfolio' }
  ]
})
</script>

<style scoped>
.variations-page {
  background-color: #f4f4f4;
  min-height: 100vh;
}

.variation-selector {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(to bottom, #201d1d 90%, transparent);
  padding: 3rem 2rem;
  text-align: center;
}

.selector-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 500;
  color: #f4f4f4;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
}

.selector-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.selector-button {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  padding: 2rem;
  background-color: rgba(244, 244, 244, 0.05);
  border: 1px solid rgba(244, 244, 244, 0.1);
  color: #f4f4f4;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  text-align: left;
}

.selector-button:hover {
  background-color: rgba(244, 244, 244, 0.1);
  border-color: rgba(244, 244, 244, 0.3);
  transform: translateY(-2px);
}

.selector-button.active {
  background-color: #f4f4f4;
  color: #201d1d;
  border-color: #f4f4f4;
}

.button-icon {
  font-size: 2rem;
}

.button-label {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.button-description {
  font-size: 0.875rem;
  opacity: 0.7;
  font-weight: 300;
}

.variation-content {
  position: relative;
}

@media screen and (max-width: 767px) {
  .selector-buttons {
    flex-direction: column;
  }

  .selector-button {
    max-width: 100%;
  }
}
</style>
