<template>
  <div class="cinematic-scroll">
    <!-- Section Title -->
    <div class="section-intro">
      <h2 class="section-title">My Work</h2>
      <p class="section-subtitle">Click to explore each story</p>
    </div>

    <!-- Full-screen project sections -->
    <NuxtLink
      v-for="(project, index) in projects"
      :key="project.id"
      :to="`/work/${project.slug}`"
      class="project-section"
      :class="`project-${index + 1}`"
    >
      <!-- Parallax background image -->
      <div class="project-bg" :style="{ backgroundImage: `url(${project.mainImage})` }"></div>

      <!-- Content overlay with scroll reveal -->
      <div class="project-content">
        <div class="project-meta">
          <span class="project-category">{{ project.category }}</span>
          <span class="project-location">{{ project.location }} · {{ project.year }}</span>
        </div>
        <h2 class="project-title">{{ project.title }}</h2>
        <p class="project-description">{{ project.description }}</p>
        <span class="project-cta">View Project →</span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { getProjects } = useProjects()
const projects = getProjects()
</script>

<style scoped>
.cinematic-scroll {
  background-color: #000;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

.section-intro {
  padding: 8rem 4rem 4rem;
  text-align: center;
  background-color: #000;
  color: #f4f4f4;
}

.section-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 500;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.6;
  font-weight: 300;
}

.project-section {
  position: relative;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  scroll-snap-align: start;
}

.project-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax effect */
  opacity: 0.7;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-section:hover .project-bg {
  opacity: 0.9;
  transform: scale(1.05);
}

.project-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #f4f4f4;
  max-width: 800px;
  padding: 2rem;
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 1s ease forwards;
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-meta {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.8;
}

.project-category,
.project-location {
  font-weight: 300;
}

.project-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 500;
  margin: 0 0 2rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.project-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  font-weight: 300;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.project-cta {
  display: inline-block;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  padding: 0.75rem 2rem;
  border: 1px solid rgba(244, 244, 244, 0.3);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
}

.project-section:hover .project-cta {
  opacity: 1;
  transform: translateY(0);
  border-color: #f4f4f4;
  background-color: rgba(244, 244, 244, 0.1);
}

@media screen and (max-width: 767px) {
  .cinematic-scroll {
    scroll-snap-type: y proximity; /* Less strict snapping on mobile */
  }

  .section-intro {
    padding: 6rem 2rem 3rem;
    min-height: auto;
  }

  .section-title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .project-section {
    height: 100vh;
    height: 100dvh; /* Better mobile viewport */
  }

  .project-content {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }

  .project-meta {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .project-title {
    font-size: clamp(2.5rem, 10vw, 4.5rem);
    margin-bottom: 1.5rem;
  }

  .project-description {
    font-size: clamp(0.9rem, 4vw, 1.1rem);
    margin-bottom: 1.5rem;
  }

  .project-bg {
    background-attachment: scroll; /* Disable parallax on mobile */
    opacity: 0.6; /* Slightly darker for better text readability */
  }

  /* Make CTA more visible on mobile */
  .project-cta {
    opacity: 1;
    transform: translateY(0);
    background-color: rgba(244, 244, 244, 0.1);
    border-color: rgba(244, 244, 244, 0.5);
  }

  /* Hide scroll indicator on mobile */
  .scroll-indicator {
    display: none;
  }
}

/* Tablet adjustments */
@media screen and (min-width: 768px) and (max-width: 991px) {
  .section-intro {
    padding: 6rem 3rem 4rem;
  }

  .project-content {
    padding: 2rem;
  }

  .project-title {
    font-size: clamp(3.5rem, 8vw, 5rem);
  }
}
</style>
