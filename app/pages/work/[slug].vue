<template>
  <div v-if="project" class="portfolio-page project-detail">
    <!-- Hero Section -->
    <section class="project-hero">
      <div class="hero-image">
        <img :src="project.mainImage" :alt="project.title" />
      </div>
      <div class="hero-content">
        <NuxtLink to="/" class="back-button">
          ← Back to Home
        </NuxtLink>
        <div class="hero-text">
          <span class="hero-category">{{ project.category }}</span>
          <h1 class="hero-title">{{ project.title }}</h1>
          <p class="hero-client">{{ project.client }}</p>
          <div class="hero-meta">
            <span>{{ project.location }}</span>
            <span>{{ project.year }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Story -->
    <section class="project-intro">
      <div class="intro-container">
        <p class="intro-text">{{ project.description }}</p>
      </div>
    </section>

    <!-- Interactive Gallery -->
    <section class="interactive-gallery-section">
      <div class="gallery-header">
        <h2 class="gallery-title">Gallery</h2>
        <p class="gallery-subtitle">Click on an image to see details</p>
      </div>

      <div class="gallery-grid">
        <div
          v-for="(image, index) in galleryImages"
          :key="index"
          class="gallery-item"
          :class="{ 'is-selected': selectedImageIndex === index }"
          @click="selectImage(index)"
        >
          <div class="gallery-item-image">
            <img :src="image.src" :alt="image.title" loading="lazy" />
            <div class="gallery-item-overlay">
              <span class="gallery-item-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="gallery-item-category" v-if="image.category">{{ image.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Details Section -->
    <section v-if="selectedImage" class="details-section">
      <div class="details-container">
        <div class="details-image">
          <img :src="selectedImage.src" :alt="selectedImage.title" />
        </div>
        <div class="details-content">
          <span class="details-number">{{ String(selectedImageIndex + 1).padStart(2, '0') }}</span>
          <h3 class="details-title">{{ selectedImage.title }}</h3>
          <p class="details-description">{{ selectedImage.description }}</p>
          <p class="details-info" v-if="selectedImage.details">{{ selectedImage.details }}</p>
          <button @click="clearSelection" class="details-close">Close Details</button>
        </div>
      </div>
    </section>

    <!-- Project Tags -->
    <section class="tags-section">
      <div class="tags-container">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <!-- Next Project CTA -->
    <section class="next-project">
      <NuxtLink to="/" class="next-project-link">
        <span class="next-label">View More Work</span>
        <span class="next-arrow">→</span>
      </NuxtLink>
    </section>
  </div>

  <!-- 404 State -->
  <div v-else class="not-found">
    <h1>Project Not Found</h1>
    <NuxtLink to="/">← Back to Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { GalleryImage } from '~/composables/useProjects'

const route = useRoute()
const { getProjectBySlug } = useProjects()

const project = getProjectBySlug(route.params.slug as string)

// Gallery images with fallback to regular images
const galleryImages = computed(() => {
  if (project?.galleryImages && project.galleryImages.length > 0) {
    return project.galleryImages
  }
  // Fallback: create gallery items from images array
  return project?.images.map((img, i) => ({
    src: img,
    title: `Image ${i + 1}`,
    description: project.title,
    details: project.description
  })) || []
})

// Selected image state
const selectedImageIndex = ref<number | null>(null)
const selectedImage = computed(() => {
  if (selectedImageIndex.value !== null) {
    return galleryImages.value[selectedImageIndex.value]
  }
  return null
})

const selectImage = (index: number) => {
  selectedImageIndex.value = index
  // Scroll to details section
  nextTick(() => {
    const detailsSection = document.querySelector('.details-section')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const clearSelection = () => {
  selectedImageIndex.value = null
}

// SEO meta tags
useHead({
  title: project ? `${project.title} - Nicolas Wolff Photography` : 'Project Not Found',
  meta: [
    { name: 'description', content: project?.description || 'Project not found' }
  ]
})
</script>

<style scoped>

/* Hero Section */
.project-hero {
  position: relative;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background-color: #000;
}

.hero-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  color: #f4f4f4;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: #f4f4f4;
  text-decoration: none;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: opacity 0.3s ease;
}

.back-button:hover {
  opacity: 0.7;
}

.hero-text {
  max-width: 800px;
}

.hero-category {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.8;
  display: block;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 500;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1;
}

.hero-client {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 300;
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.hero-meta {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Project Intro */
.project-intro {
  padding: 6rem 2rem;
  background-color: #f4f4f4;
  text-align: center;
}

.intro-container {
  max-width: 900px;
  margin: 0 auto;
}

.intro-text {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  line-height: 1.8;
  color: #201d1d;
  font-weight: 300;
  margin: 0;
}

/* Interactive Gallery */
.interactive-gallery-section {
  padding: 6rem 2rem;
  background-color: #201d1d;
}

.gallery-header {
  text-align: center;
  margin-bottom: 4rem;
  color: #f4f4f4;
}

.gallery-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 500;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.gallery-subtitle {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.6;
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-item {
  cursor: pointer;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover {
  transform: translateY(-8px);
}

.gallery-item.is-selected .gallery-item-image::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 3px solid #f4f4f4;
  pointer-events: none;
  z-index: 3;
}

.gallery-item-image {
  aspect-ratio: 4/5;
  overflow: hidden;
  position: relative;
  background-color: #000;
}

.gallery-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease, opacity 0.4s ease;
}

.gallery-item:hover .gallery-item-image img {
  transform: scale(1.05);
}

.gallery-item.is-selected .gallery-item-image img {
  opacity: 1;
}

.gallery-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: #f4f4f4;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-item-overlay,
.gallery-item.is-selected .gallery-item-overlay {
  opacity: 1;
}

.gallery-item-number {
  font-size: 0.875rem;
  font-weight: 500;
}

.gallery-item-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

/* Details Section */
.details-section {
  padding: 6rem 2rem;
  background-color: #f4f4f4;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.details-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.details-image {
  aspect-ratio: 4/5;
  overflow: hidden;
  background-color: #000;
}

.details-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details-content {
  padding: 2rem;
}

.details-number {
  font-size: 1rem;
  color: #999;
  display: block;
  margin-bottom: 1rem;
}

.details-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  color: #201d1d;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.details-description {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: #666;
  margin: 0 0 1.5rem 0;
  font-weight: 300;
  line-height: 1.6;
}

.details-info {
  font-size: 1rem;
  color: #444;
  line-height: 1.8;
  margin: 0 0 2rem 0;
  font-weight: 300;
}

.details-close {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: transparent;
  color: #201d1d;
  border: 2px solid #201d1d;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-close:hover {
  background-color: #201d1d;
  color: #f4f4f4;
}

/* Tags Section */
.tags-section {
  padding: 4rem 2rem;
  background-color: #f4f4f4;
}

.tags-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.tag {
  padding: 0.75rem 1.5rem;
  border: 1px solid #201d1d;
  color: #201d1d;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: #201d1d;
  color: #f4f4f4;
}

/* Next Project */
.next-project {
  padding: 8rem 2rem;
  background-color: #201d1d;
  text-align: center;
}

.next-project-link {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: #f4f4f4;
  text-decoration: none;
  font-weight: 500;
  transition: gap 0.3s ease;
}

.next-project-link:hover {
  gap: 2rem;
}

.next-label {
  letter-spacing: -0.02em;
}

.next-arrow {
  transition: transform 0.3s ease;
}

.next-project-link:hover .next-arrow {
  transform: translateX(10px);
}

/* 404 State */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  background-color: #f4f4f4;
}

.not-found h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 500;
  color: #201d1d;
  margin: 0;
}

.not-found a {
  color: #201d1d;
  text-decoration: none;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: opacity 0.3s ease;
}

.not-found a:hover {
  opacity: 0.7;
}

/* Responsive */
@media screen and (max-width: 991px) {
  .details-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media screen and (max-width: 767px) {
  .project-hero {
    height: 100vh;
    height: 100dvh;
  }

  .hero-content {
    padding: 1.5rem;
    justify-content: flex-end;
  }

  .back-button {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
  }

  .hero-text {
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }

  .hero-client {
    font-size: clamp(1rem, 5vw, 1.5rem);
  }

  .hero-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .project-intro {
    padding: 4rem 1.5rem;
  }

  .interactive-gallery-section {
    padding: 4rem 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .details-section {
    padding: 4rem 1.5rem;
  }

  .details-content {
    padding: 0;
  }

  .tags-section {
    padding: 3rem 1.5rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
  }

  .next-project {
    padding: 4rem 1.5rem;
  }

  .next-project-link {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }

  .not-found h1 {
    font-size: clamp(2rem, 10vw, 3rem);
  }
}
</style>
