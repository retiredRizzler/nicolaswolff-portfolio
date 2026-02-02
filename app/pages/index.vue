<template>
  <div>
    <LoaderLanding
      title="Nicolas Wolff"
      subtitle="Visual Storyteller"
      :social-links="socialLinks"
      :services="services"
      :images="images"
      :main-image="mainImage"
      @complete="onLoadingComplete"
    />

    <!-- My Work - Cinematic Scroll -->
    <CinematicScroll />

    <!-- Text Image Reveal - Storytelling Narrative -->
    <TextImageReveal
      :lines="narrativeLines"
      :show-outro="false"
      :image-width="250"
      :image-height="120"
      font-size="7.5rem"
      background-color="#f4f4f4"
      text-color="#201d1d"
      :smooth-scroll="true"
    />

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <h2 class="about-title">About me</h2>
            <p class="about-text">
              Professional photographer specializing in capturing the essence of moments
              through reportage, corporate, portrait, and product photography. Each project
              is approached with a storytelling mindset, creating visual narratives that
              resonate and inspire.
            </p>
            <p class="about-text">
              Based in Belgium, working worldwide to bring your vision to life through
              the lens of authentic, powerful imagery.
            </p>
          </div>
          <div class="about-stats">
            <div class="stat-item">
              <span class="stat-number">15+</span>
              <span class="stat-label">Projects Completed</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">10+</span>
              <span class="stat-label">Happy Clients</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">3+</span>
              <span class="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Let's Create Together</h2>
          <p class="cta-text">
            Ready to bring your vision to life? Get in touch to discuss your next project.
          </p>
          <a href="#contact" class="cta-button">Get In Touch</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import CinematicScroll from '~/components/sections/CinematicScroll.vue'
import TextImageReveal from '~/components/TextImageReveal.vue'

// Narrative lines for TextImageReveal component
const narrativeLines = [
  {
    segments: [
      { type: 'text', content: '"Every frame' },
      { type: 'image', src: '/images/panama-jump.jpg', alt: 'Documentary photography' },
      { type: 'text', content: 'tells' }
    ]
  },
  {
    segments: [
      { type: 'text', content: 'a story.' },
      { type: 'image', src: '/images/adeux-burger.jpg', alt: 'Food photography' },
      { type: 'text', content: 'Through' }
    ]
  },
  {
    segments: [
      { type: 'text', content: 'the lens,' },
      { type: 'image', src: '/images/panama-walk.jpg', alt: 'Reportage photography' }
    ]
  },
  {
    segments: [
      { type: 'text', content: 'moments' },
      { type: 'image', src: '/images/sweetsbydagi-shooting-cookie-close.jpg', alt: 'Product photography' },
      { type: 'text', content: 'become' }
    ]
  },
  {
    segments: [
      { type: 'text', content: 'memories.' },
      { type: 'image', src: '/images/cookies.jpg', alt: 'Still life photography' },
      { type: 'text', content: 'Crafted' }
    ]
  },
  {
    segments: [
      { type: 'text', content: 'with' },
      { type: 'image', src: '/images/adeux-bun.jpg', alt: 'Commercial photography' },
      { type: 'text', content: 'intention."' }
    ]
  }
]

// Social media links for Nicolas Wolff
const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/nicolaswolff', icon: '◉' },
  { name: 'Behance', href: 'https://behance.net/nicolaswolff', icon: '◉' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/nicolaswolff', icon: '◉' }
]

// Photography services/categories
const services = [
  { name: '// Reportage', href: '#reportage' },
  { name: '// Corporate', href: '#corporate' },
  { name: '// Portrait', href: '#portrait' },
  { name: '// Product', href: '#product' }
]

// Animation images using local photography
const images = [
  '/images/cookies.jpg',
  '/images/panama-ice.jpg',
  '/images/panama-totoche.jpg'
]

// Main hero image
const mainImage = '/images/nico-background-hero.jpeg'

// Handle animation completion
const onLoadingComplete = () => {
  console.log('Hero animation completed')
}

// SEO meta tags
useHead({
  title: 'Nicolas Wolff - Photography Portfolio',
  meta: [
    { name: 'description', content: 'Professional photography portfolio of Nicolas Wolff. Specializing in reportage, corporate, portrait, and product photography.' },
    { property: 'og:title', content: 'Nicolas Wolff - Photography Portfolio' },
    { property: 'og:description', content: 'Professional photography portfolio showcasing reportage, corporate, portrait, and product work.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* About Section */
.about-section {
  padding: 8rem 0;
  background-color: #201d1d;
  color: #f4f4f4;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
}

.about-text {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.8;
  color: rgba(244, 244, 244, 0.9);
  margin: 0 0 1.5rem 0;
  font-weight: 300;
}

.about-stats {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-number {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 500;
  color: #f4f4f4;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(244, 244, 244, 0.6);
  font-weight: 300;
}

/* CTA Section */
.cta-section {
  padding: 8rem 0;
  background-color: #f4f4f4;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  color: #201d1d;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.cta-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #666;
  margin: 0 0 3rem 0;
  font-weight: 300;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 1.25rem 3rem;
  background-color: #201d1d;
  color: #f4f4f4;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #201d1d;
}

.cta-button:hover {
  background-color: transparent;
  color: #201d1d;
  transform: translateY(-2px);
}

/* Responsive */
@media screen and (max-width: 991px) {
  .portfolio-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .portfolio-preview,
  .about-section,
  .cta-section {
    padding: 5rem 0;
  }
}

@media screen and (max-width: 767px) {
  .container {
    padding: 0 1.5rem;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .about-stats {
    gap: 2rem;
  }

  .portfolio-preview,
  .about-section,
  .cta-section {
    padding: 4rem 0;
  }
}
</style>
