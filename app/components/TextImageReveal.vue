<template>
  <div class="text-image-reveal">
    <!-- Intro Section -->
    <div v-if="showIntro" class="intro-section">
      <h1 class="intro-text">{{ introText }}</h1>
    </div>

    <!-- Main Content -->
    <div class="reveal-container">
      <div v-for="(line, index) in lines" :key="index" class="reveal-line">
        <template v-for="(segment, segIndex) in line.segments" :key="segIndex">
          <!-- Text Segment -->
          <span v-if="segment.type === 'text'" class="text-segment">
            {{ segment.content }}
          </span>

          <!-- Image Segment -->
          <span v-else-if="segment.type === 'image'" class="img-span">
            <img :src="segment.src" :alt="segment.alt || 'Reveal image'" />
          </span>
        </template>
      </div>
    </div>

    <!-- Outro Section -->
    <div v-if="showOutro" class="outro-section"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const props = defineProps({
  // Array of line objects with segments
  lines: {
    type: Array,
    default: () => [
      {
        segments: [
          { type: 'text', content: 'We craft' },
          { type: 'image', src: 'https://i.pinimg.com/1200x/93/27/65/932765c7cd00055218ba7398119d7d4d.jpg' },
          { type: 'text', content: 'digital' }
        ]
      },
      {
        segments: [
          { type: 'text', content: 'experiences' },
          { type: 'image', src: 'https://i.pinimg.com/736x/a9/f1/19/a9f11909a9644d7bfd5102fabcd8310c.jpg' },
          { type: 'text', content: 'that' }
        ]
      },
      {
        segments: [
          { type: 'text', content: 'inspire' },
          { type: 'image', src: 'https://i.pinimg.com/1200x/48/09/77/480977567d6b4503c8f642728f266b72.jpg' }
        ]
      },
      {
        segments: [
          { type: 'text', content: 'and move' }
        ]
      },
      {
        segments: [
          { type: 'text', content: 'people' },
          { type: 'image', src: 'https://i.pinimg.com/1200x/9e/f2/b7/9ef2b73b1e2ff489f99bc0a90196fbea.jpg' },
          { type: 'text', content: 'forward.' }
        ]
      }
    ]
  },
  // Show intro section
  showIntro: {
    type: Boolean,
    default: false
  },
  // Intro text
  introText: {
    type: String,
    default: 'Scroll to explore'
  },
  // Show outro section
  showOutro: {
    type: Boolean,
    default: true
  },
  // Image reveal width
  imageWidth: {
    type: Number,
    default: 300
  },
  // Image height
  imageHeight: {
    type: Number,
    default: 110
  },
  // Font size for text
  fontSize: {
    type: String,
    default: '7.5rem'
  },
  // Background color
  backgroundColor: {
    type: String,
    default: '#f5f5f0'
  },
  // Text color
  textColor: {
    type: String,
    default: '#1a1a1a'
  },
  // Enable smooth scroll with Lenis
  smoothScroll: {
    type: Boolean,
    default: true
  }
})

let lenis = null
let scrollTriggerInstances = []

onMounted(() => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  // Initialize Lenis smooth scroll
  if (props.smoothScroll) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
  }

  // Animate image reveals (desktop and tablet only)
  const isMobile = window.innerWidth <= 768

  if (!isMobile) {
    document.querySelectorAll('.reveal-line').forEach((line) => {
      const imgSpan = line.querySelector('.img-span')

      if (imgSpan) {
        const animation = gsap.to(imgSpan, {
          width: props.imageWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1
          }
        })

        scrollTriggerInstances.push(animation.scrollTrigger)
      }
    })
  }
})

onBeforeUnmount(() => {
  // Clean up ScrollTrigger instances
  scrollTriggerInstances.forEach((trigger) => {
    if (trigger) trigger.kill()
  })

  // Clean up Lenis
  if (lenis) {
    lenis.destroy()
  }

  // Kill all GSAP animations
  gsap.killTweensOf('*')
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap');

.text-image-reveal {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: v-bind(backgroundColor);
  color: v-bind(textColor);
}

.intro-section {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.intro-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #999;
}

.reveal-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.reveal-line {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.text-segment {
  font-size: v-bind(fontSize);
  font-weight: 700;
  letter-spacing: -4px;
  display: inline-block;
  overflow: hidden;
}

.img-span {
  height: v-bind(imageHeight + 'px');
  width: 0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: inline-block;
}

.img-span img {
  height: 100%;
  width: v-bind(imageWidth + 'px');
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
  object-fit: cover;
  object-position: center center;
}

.outro-section {
  height: 100vh;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 991px) {
  .text-segment {
    font-size: 4.5rem;
    letter-spacing: -3px;
  }

  .img-span {
    height: 80px;
    width: 200px; /* Fixed width on tablet */
  }

  .img-span img {
    width: 200px;
  }

  .reveal-line {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .reveal-container {
    padding: 3rem 1.5rem;
  }

  .reveal-line {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    width: 100%;
  }

  .text-segment {
    font-size: 3rem;
    letter-spacing: -2px;
    width: 100%;
  }

  /* Images always visible and full-width on mobile (no animation) */
  .img-span {
    height: 200px;
    width: 100% !important; /* Override animation */
    max-width: 100%;
    border-radius: 12px;
  }

  .img-span img {
    width: 100%;
    max-width: 100%;
    transform: translateX(0);
    left: 0;
    position: relative;
  }
}

@media (max-width: 480px) {
  .text-segment {
    font-size: 2.5rem;
    letter-spacing: -1px;
  }

  .img-span {
    height: 180px;
  }

  .reveal-line {
    gap: 1rem;
  }

  .reveal-container {
    padding: 2rem 1rem;
  }
}
</style>
