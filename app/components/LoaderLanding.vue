<template>
  <section 
    ref="container" 
    class="willem-header is--loading is--hidden"
  >
    <!-- Loader central avec animation du texte "Willem" -->
    <div class="willem-loader">
      <div class="willem__h1">
        <!-- Partie gauche -->
        <div class="willem__h1-start">
          <span class="willem__letter">M</span>
          <span class="willem__letter">a</span>
          <span class="willem__letter">d</span>
          <span class="willem__letter">e</span>
        </div>
        
        <!-- Box centrale avec images qui grandissent -->
        <div class="willem-loader__box">
          <div class="willem-loader__box-inner">
            <div class="willem__growing-image">
              <div class="willem__growing-image-wrap">
                <!-- Images qui s'effacent progressivement -->
                <img 
                  v-for="(image, index) in images" 
                  :key="index"
                  class="willem__cover-image-extra"
                  :class="`is--${index + 1}`"
                  :src="image"
                  loading="lazy" 
                  alt=""
                >
                <!-- Image principale qui reste -->
                <img 
                  class="willem__cover-image"
                  :src="mainImage"
                  loading="lazy" 
                  alt=""
                >
              </div>
            </div>
          </div>
        </div>
        
        <!-- Partie droite -->
        <div class="willem__h1-end">
          <span class="willem__letter">B</span>
          <span class="willem__letter">y</span>
        </div>
      </div>
    </div>

    <!-- Contenu final -->
    <div class="willem-header__content">
      <!-- Titre central (au milieu de l'image) -->
      <div class="willem-header__center">
        <div class="willem__title-wrapper">
          <div class="willem__h1">
            <span
              v-for="(letter, index) in titleLetters"
              :key="index"
              class="willem__letter-white willem__letter-white--hidden"
              :class="{ 'is--space': letter === '©' }"
            >
              {{ letter }}
            </span>
          </div>
          <p v-if="subtitle" class="willem__subtitle willem__subtitle--hidden">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Footer avec liens -->
      <div class="willem-header__bottom">
        <!-- Liens sociaux (gauche) -->
        <div class="willem-footer__social">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.href"
            class="willem-footer__link willem-footer__link--hidden"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="willem-footer__icon" v-html="getSocialIcon(social.name)"></span>
            <span>{{ social.name }}</span>
          </a>
        </div>

        <!-- Scroll Indicator (center) -->
        <div class="willem-scroll-indicator willem-scroll-indicator--hidden">
          <span class="scroll-text">Scroll to explore</span>
          <div class="scroll-line"></div>
        </div>

        <!-- Services (droite) -->
        <div class="willem-footer__services">
          <a
            v-for="service in services"
            :key="service.name"
            :href="service.href"
            class="willem-footer__link willem-footer__link--hidden"
          >
            {{ service.name }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

// Storage key for tracking if loader has played
const LOADER_PLAYED_KEY = 'willem-loader-played'

// Props pour rendre le composant réutilisable
const props = defineProps({
  title: {
    type: String,
    default: 'Willem ©'
  },
  subtitle: {
    type: String,
    default: ''
  },
  socialLinks: {
    type: Array,
    default: () => [
      { name: 'Instagram', href: '#', icon: '◉' },
      { name: 'Behance', href: '#', icon: '◉' },
      { name: 'LinkedIn', href: '#', icon: '◉' }
    ]
  },
  services: {
    type: Array,
    default: () => [
      { name: '// Reportage', href: '#' },
      { name: '// Corporate', href: '#' },
      { name: '// Portrait', href: '#' },
      { name: '// Produit', href: '#' }
    ]
  },
  images: {
    type: Array,
    default: () => [
      'https://cdn.prod.website-files.com/6915bbf51d482439010ee790/6915bc3ac9fe346a924724bc_minimalist-architecture-2.avif',
      'https://cdn.prod.website-files.com/6915bbf51d482439010ee790/6915bc3ac9fe346a924724cf_minimalist-architecture-4.avif',
      'https://cdn.prod.website-files.com/6915bbf51d482439010ee790/6915bc3ac9fe346a924724c5_minimalist-architecture-3.avif'
    ]
  },
  mainImage: {
    type: String,
    default: 'https://cdn.prod.website-files.com/6915bbf51d482439010ee790/6915bc3ac9fe346a924724b0_minimalist-architecture-1.avif'
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  playOnce: {
    type: Boolean,
    default: true
  }
})

// Émit pour signaler la fin de l'animation
const emit = defineEmits(['complete'])

// Références
const container = ref(null)
let timeline = null

// Découpe le titre en lettres individuelles
const titleLetters = props.title.split('')

// Function to get social media icon SVG
const getSocialIcon = (name) => {
  const icons = {
    'Instagram': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    'Behance': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8h5M8.5 4h3.5c2.5 0 3.5 1.5 3.5 3s-1 3-3.5 3H8.5V4zM8.5 10h4.5c2.5 0 3.5 1.5 3.5 3.5S15.5 17 13 17H8.5v-7z"></path></svg>',
    'LinkedIn': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
  }
  return icons[name] || '◉'
}

const startWidth = ref('auto')
const endWidth = ref('auto')

const calculateWidths = () => {
  const startEl = document.querySelector('.willem__h1-start')
  const endEl = document.querySelector('.willem__h1-end')

  if (startEl && endEl) {
    const fontSize = parseFloat(getComputedStyle(startEl).fontSize)
    startWidth.value = `${startEl.scrollWidth / fontSize}em`
    endWidth.value = `${endEl.scrollWidth / fontSize}em`
  }
}

// Skip to final state without animation
const skipToEnd = () => {
  if (!container.value) return

  // Remove loading and hidden classes
  container.value.classList.remove('is--loading', 'is--hidden')

  // Hide only the "Made By" letters, not the whole loader
  const loadingLetters = container.value.querySelectorAll('.willem-loader .willem__letter')
  loadingLetters.forEach(el => {
    el.style.opacity = '0'
  })

  // Set the box to final expanded state
  const box = container.value.querySelector('.willem-loader__box')
  if (box) {
    box.style.width = '110vw'
  }

  // Set the growing image to final expanded state
  const growingImage = container.value.querySelector('.willem__growing-image')
  if (growingImage) {
    growingImage.style.width = '100vw'
    growingImage.style.height = '100dvh'
  }

  // Hide extra cover images (glitch effect images)
  const coverImageExtra = container.value.querySelectorAll('.willem__cover-image-extra')
  coverImageExtra.forEach(el => {
    el.style.opacity = '0'
  })

  // Show all final content elements
  const headerLetter = container.value.querySelectorAll('.willem__letter-white--hidden')
  const subtitle = container.value.querySelectorAll('.willem__subtitle--hidden')
  const footerLinks = container.value.querySelectorAll('.willem-footer__link--hidden')
  const scrollIndicator = container.value.querySelector('.willem-scroll-indicator--hidden')

  // Remove hidden classes and set to visible state
  headerLetter.forEach(el => {
    el.classList.remove('willem__letter-white--hidden')
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })

  subtitle.forEach(el => {
    el.classList.remove('willem__subtitle--hidden')
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })

  footerLinks.forEach(el => {
    el.classList.remove('willem-footer__link--hidden')
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })

  if (scrollIndicator) {
    scrollIndicator.classList.remove('willem-scroll-indicator--hidden')
    scrollIndicator.style.opacity = '1'
    scrollIndicator.style.transform = 'translateY(0)'
  }

  // Emit complete event immediately
  emit('complete')
}

// Fonction d'animation (adaptation de l'original)
const initAnimation = () => {
  if (!container.value) return

  // Sélection des éléments à animer
  const loadingLetter = container.value.querySelectorAll('.willem__letter')
  const box = container.value.querySelectorAll('.willem-loader__box')
  const growingImage = container.value.querySelectorAll('.willem__growing-image')
  const headingStart = container.value.querySelectorAll('.willem__h1-start')
  const headingEnd = container.value.querySelectorAll('.willem__h1-end')
  const coverImageExtra = container.value.querySelectorAll('.willem__cover-image-extra')
  const headerLetter = container.value.querySelectorAll('.willem__letter-white--hidden')
  const subtitle = container.value.querySelectorAll('.willem__subtitle--hidden')
  const footerLinks = container.value.querySelectorAll('.willem-footer__link--hidden')
  const scrollIndicator = container.value.querySelector('.willem-scroll-indicator--hidden')

  // Création de la timeline GSAP
  timeline = gsap.timeline({
    defaults: {
      ease: 'expo.inOut', // Courbe d'animation fluide
    },
    onStart: () => {
      // Rend le loader visible au démarrage
      container.value?.classList.remove('is--hidden')
    },
    onComplete: () => {
      // Mark animation as played in session storage
      if (props.playOnce) {
        sessionStorage.setItem(LOADER_PLAYED_KEY, 'true')
      }
      // Émit un événement quand l'animation est terminée
      emit('complete')
    }
  })

  /* PHASE 1 : Apparition des lettres "Made By" */
  timeline.from(loadingLetter, {
    yPercent: 100,
    stagger: 0.025,
    duration: 1.25,
  })

  /* PHASE 2 : Expansion de la box centrale */
  timeline.fromTo(
    box,
    { width: '0em' },
    { width: '1em', duration: 1.25 },
    '< 1.25'
  )

  /* PHASE 3 : Croissance de l'image */
  timeline.fromTo(
    growingImage,
    { width: '0%' },
    { width: '100%', duration: 1.25 },
    '<'
  )

  /* PHASE 4 : Léger mouvement des parties du texte */
  timeline.fromTo(
    headingStart,
    { x: '0em' },
    { x: '-0.05em', duration: 1.25 },
    '<'
  )

  timeline.fromTo(
    headingEnd,
    { x: '0em' },
    { x: '0.05em', duration: 1.25 },
    '<'
  )

  /* PHASE 5 : Effet de glitch sur les images */
  timeline.fromTo(
    coverImageExtra,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 0.05,
      ease: 'none',
      stagger: 0.5,
    },
    '-=0.05'
  )

  /* PHASE 6 : Explosion fullscreen de l'image */
  timeline.to(
    growingImage,
    {
      width: '100vw',
      height: '100dvh',
      duration: 2,
    },
    '< 1.25'
  )

  timeline.to(
    box,
    { width: '110vw', duration: 2 },
    '<'
  )

  /* PHASE 7 : Apparition du titre central (après l'explosion) */
  timeline.from(
    headerLetter,
    {
      yPercent: 100,
      opacity: 0,
      duration: 1.8,
      ease: 'expo.out',
      stagger: 0.015,
      onStart: () => {
        // Rend les lettres visibles quand l'animation commence
        headerLetter.forEach(el => el.classList.remove('willem__letter-white--hidden'))
      }
    },
    '>' // Commence APRÈS la fin de l'animation précédente
  )

  /* PHASE 7.5 : Apparition du sous-titre (si présent) */
  if (subtitle.length > 0) {
    timeline.fromTo(
      subtitle,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.25,
        ease: 'expo.out',
        onStart: () => {
          subtitle.forEach(el => el.classList.remove('willem__subtitle--hidden'))
        }
      },
      '-=0.8' // Overlap avec la fin du titre
    )
  }

  /* PHASE 8 : Apparition des liens footer (après le titre) */
  timeline.fromTo(
    footerLinks,
    {
      opacity: 0,
      y: 20
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1,
      onStart: () => {
        // Rend les liens visibles quand l'animation commence
        footerLinks.forEach(el => el.classList.remove('willem-footer__link--hidden'))
      }
    },
    '-=0.5' // Commence 0.5s avant la fin du titre pour un overlap
  )

  /* PHASE 9 : Apparition du scroll indicator */
  if (scrollIndicator) {
    timeline.fromTo(
      scrollIndicator,
      {
        opacity: 0,
        y: -20
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        onStart: () => {
          scrollIndicator.classList.remove('willem-scroll-indicator--hidden')
        }
      },
      '-=0.8'
    )
  }
}

// Lifecycle hooks
onMounted(() => {
  // Check if animation has already played this session
  const hasPlayed = sessionStorage.getItem(LOADER_PLAYED_KEY)

  if (hasPlayed && props.playOnce) {
    // Skip animation, show final state immediately
    skipToEnd()
  } else if (props.autoPlay) {
    // Play animation normally
    initAnimation()
  }

  setTimeout(calculateWidths, 100)
})

onBeforeUnmount(() => {
  // Nettoyage : tue la timeline pour éviter les fuites mémoire
  timeline?.kill()
})

// Expose la fonction pour pouvoir la déclencher manuellement
defineExpose({
  play: initAnimation,
  skipToEnd: skipToEnd
})
</script>

<style scoped>
/* ------- Osmo [https://osmo.supply/] ------- */
/* Osmo UI: https://slater.app/10324/23333.css */

body {
  background-color: #f4f4f4;
  font-family: PP Neue Montreal, Arial, sans-serif;
  color: #201d1d;
  font-weight: 400;
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
  min-height: 100%;
}

/* Disable Scroll on Loading */
main:has(.willem-header.is--loading) {
  height: 100dvh;
}

.willem-header {
  color: #f4f4f4;
  position: relative;
  overflow: hidden;
}

/* Loading: Hidden */
.willem-header.is--loading.is--hidden {
  display: none;
}

.willem-loader {
  color: #201d1d;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.willem__h1 {
  white-space: nowrap;
  justify-content: center;
  font-size: 12.5em;
  font-weight: 500;
  line-height: .75;
  display: flex;
  position: relative;
}

.willem__h1-start {
  justify-content: flex-end;
  display: flex;
  font-size: 0.5em;
  width: 1.5256em;  
}

.willem__h1-end {
  justify-content: flex-start;
  display: flex;
  font-size: 0.5em;
  width: 1.5256em;
}

.willem__letter {
  display: block;
  position: relative;
}

.willem__letter-white.is--space {
  margin-left: .25em;
}

.willem-loader__box {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 0;
  display: flex;
  position: relative;
}

.willem-loader__box-inner {
  justify-content: center;
  align-items: center;
  min-width: 1em;
  height: 95%;
  display: flex;
  position: relative;
}

.willem__growing-image {
  justify-content: center;
  align-items: center;
  width: 0%;
  height: 100%;
  display: flex;
  position: absolute;
  overflow: hidden;
}

.willem__growing-image-wrap {
  width: 100%;
  min-width: 1em;
  height: 100%;
  position: absolute;
}

.willem__cover-image {
  pointer-events: none;
  object-fit: cover;
  -webkit-user-select: none;
  user-select: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-position: center center;
}

.willem__cover-image-extra {
  pointer-events: none;
  object-fit: cover;
  -webkit-user-select: none;
  user-select: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.willem__cover-image-extra.is--1 {
  z-index: 3;
}

.willem__cover-image-extra.is--2 {
  z-index: 2;
}

.willem__cover-image-extra.is--3 {
  z-index: 1;
}

.willem-header__content {
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  position: relative;
}

.willem-header__center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 100%;
  max-width: 90%;
  padding: 0 2rem;
}

.willem__title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.willem__title-wrapper .willem__h1 {
  font-size: clamp(3rem, 8vw, 12rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 0.95;
  text-align: center;
}

.willem-header__bottom {
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  padding: 2em;
  display: flex;
  position: relative;
  overflow: hidden;
  margin-top: auto;
  gap: 2rem;
}

/* Footer Links Styles */
.willem-footer__social,
.willem-footer__services {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  position: relative;
  overflow: hidden;
}

.willem-footer__social {
  align-items: flex-start;
}

.willem-footer__services {
  align-items: flex-end;
  text-align: right;
}

.willem-footer__link {
  color: #f4f4f4;
  font-size: 2em;
  line-height: 1.3;
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5em;
  transition: opacity 0.3s ease;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.willem-footer__link:hover {
  opacity: 0.7;
}

.willem-footer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.willem__letter-white {
  display: inline-block;
  position: relative;
  color: #f4f4f4;
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.4),
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 8px 48px rgba(0, 0, 0, 0.2);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.willem__letter-white--hidden {
  opacity: 0;
}

.willem__subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #f4f4f4;
  margin: 0;
  text-align: center;
  opacity: 0.9;
}

.willem__subtitle--hidden {
  opacity: 0;
}

.willem-footer__link--hidden {
  opacity: 0;
}

/* Scroll Indicator */
.willem-scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #f4f4f4;
}

.willem-scroll-indicator--hidden {
  opacity: 0;
}

.scroll-text {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #f4f4f4;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, #f4f4f4, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(10px);
  }
}

@media screen and (max-width: 991px) {
  .willem__h1 {
    font-size: 9em;
  }

  .willem-footer__link {
    font-size: 1.125em;
  }
}

@media screen and (max-width: 767px) {
  .willem__h1 {
    font-size: 5.5em;
  }

  .willem-header__center {
    width: 95%;
    max-width: 95%;
    padding: 0 1rem;
  }

  .willem__title-wrapper .willem__h1 {
    font-size: clamp(2.5rem, 10vw, 5rem);
    letter-spacing: -0.03em;
    line-height: 0.9;
  }

  .willem__title-wrapper {
    gap: 1rem;
  }

  .willem__subtitle {
    font-size: clamp(0.75rem, 3vw, 1rem);
    letter-spacing: 0.1em;
  }

  .willem-header__bottom {
    padding: 1.5em;
    flex-direction: row;
    justify-content: space-between;
  }

  .willem-footer__social,
  .willem-footer__services {
    width: auto;
    align-items: flex-start;
  }

  .willem-footer__services {
    align-items: flex-end;
    text-align: right;
  }

  .willem-footer__link {
    font-size: 0.875em;
  }

  .willem-scroll-indicator {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .willem__title-wrapper .willem__h1 {
    font-size: clamp(2rem, 12vw, 3.5rem);
    letter-spacing: -0.04em;
  }

  .willem-header__center {
    padding: 0 0.5rem;
  }

  .willem-footer__link {
    font-size: 0.75em;
  }

  .willem-header__bottom {
    padding: 1.5em 1em;
  }
}

@font-face {
  font-family: 'PP Neue Montreal';
  src: url('https://cdn.prod.website-files.com/6819ed8312518f61b84824df/6819ed8312518f61b84825ba_PPNeueMontreal-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
</style>