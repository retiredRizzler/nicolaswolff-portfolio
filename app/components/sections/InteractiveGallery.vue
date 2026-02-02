<template>
  <div class="interactive-gallery">
    <!-- Horizontal scroll gallery -->
    <section class="horizontal-gallery">
      <div class="gallery-sticky-header">
        <h2 class="gallery-title">Selected Works</h2>
        <p class="gallery-subtitle">Scroll horizontally to explore</p>
      </div>

      <div class="gallery-track">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="gallery-item"
        >
          <div class="gallery-item-image">
            <img :src="item.image" :alt="item.title" loading="lazy" />
          </div>
          <div class="gallery-item-info">
            <span class="gallery-item-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="gallery-item-title">{{ item.title }}</h3>
            <p class="gallery-item-category">{{ item.category }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Split screen reveal -->
    <section class="split-reveal">
      <div class="split-left">
        <div class="split-image">
          <img src="/images/panama-ice.jpg" alt="Process" loading="lazy" />
        </div>
      </div>
      <div class="split-right">
        <div class="split-content">
          <span class="split-label">The Process</span>
          <h2 class="split-title">Crafting Visual Stories</h2>
          <p class="split-text">
            Every photograph begins with a story. From concept to capture, each frame
            is meticulously composed to convey emotion, movement, and meaning.
          </p>
          <p class="split-text">
            The camera is not just a tool—it's a means of translation, converting
            fleeting moments into timeless narratives.
          </p>
        </div>
      </div>
    </section>

    <!-- Image sequence (appears as you scroll) -->
    <section class="image-sequence">
      <div class="sequence-container">
        <div class="sequence-text">
          <h2 class="sequence-title">Frame by Frame</h2>
        </div>
        <div class="sequence-images">
          <div
            v-for="(img, i) in sequenceImages"
            :key="i"
            class="sequence-image"
            :style="{ animationDelay: `${i * 0.2}s` }"
          >
            <img :src="img" alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const galleryItems = [
  { title: 'ADEUX', category: 'Product', image: '/images/cookies.jpg' },
  { title: 'Sweetsbydagi', category: 'Product', image: '/images/panama-ice.jpg' },
  { title: 'Panama Stories', category: 'Reportage', image: '/images/panama-totoche.jpg' },
  { title: 'ADEUX', category: 'Product', image: '/images/cookies.jpg' }
]

const sequenceImages = [
  '/images/cookies.jpg',
  '/images/panama-ice.jpg',
  '/images/panama-totoche.jpg'
]
</script>

<style scoped>
.interactive-gallery {
  background-color: #f4f4f4;
}

/* Horizontal Gallery */
.horizontal-gallery {
  position: relative;
  background-color: #201d1d;
  padding: 4rem 0;
  overflow-x: hidden;
}

.gallery-sticky-header {
  position: sticky;
  top: 0;
  padding: 4rem;
  color: #f4f4f4;
  z-index: 10;
  background: linear-gradient(to bottom, #201d1d 80%, transparent);
}

.gallery-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 500;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.gallery-subtitle {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.6;
  margin: 0;
}

.gallery-track {
  display: flex;
  gap: 3rem;
  padding: 4rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gallery-track::-webkit-scrollbar {
  display: none;
}

.gallery-item {
  flex-shrink: 0;
  width: clamp(300px, 40vw, 600px);
  scroll-snap-align: start;
}

.gallery-item-image {
  aspect-ratio: 3/4;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.gallery-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.gallery-item:hover .gallery-item-image img {
  transform: scale(1.05);
}

.gallery-item-info {
  color: #f4f4f4;
}

.gallery-item-number {
  font-size: 0.875rem;
  opacity: 0.5;
  display: block;
  margin-bottom: 0.5rem;
}

.gallery-item-title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.gallery-item-category {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.7;
}

/* Split Screen */
.split-reveal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.split-left,
.split-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.split-left {
  background-color: #000;
  position: sticky;
  top: 0;
  height: 100vh;
}

.split-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.split-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.split-right {
  background-color: #f4f4f4;
  padding: 4rem;
}

.split-content {
  max-width: 500px;
}

.split-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #666;
  display: block;
  margin-bottom: 2rem;
}

.split-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  color: #201d1d;
  margin: 0 0 2rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.split-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #444;
  margin: 0 0 1.5rem 0;
  font-weight: 300;
}

/* Image Sequence */
.image-sequence {
  padding: 8rem 4rem;
  background-color: #f4f4f4;
}

.sequence-container {
  max-width: 1400px;
  margin: 0 auto;
}

.sequence-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 500;
  color: #201d1d;
  margin: 0 0 4rem 0;
  text-align: center;
  letter-spacing: -0.02em;
}

.sequence-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.sequence-image {
  aspect-ratio: 4/5;
  overflow: hidden;
  opacity: 0;
  animation: fadeInScale 0.8s ease forwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.sequence-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.sequence-image:hover img {
  transform: scale(1.05);
}

@media screen and (max-width: 991px) {
  .split-reveal {
    grid-template-columns: 1fr;
  }

  .split-left {
    position: relative;
    height: 60vh;
  }

  .gallery-track {
    gap: 2rem;
    padding: 2rem;
  }

  .image-sequence {
    padding: 4rem 2rem;
  }
}
</style>
