<template>
  <div class="editorial-story">
    <!-- Asymmetric grid sections -->
    <section class="editorial-section layout-1">
      <div class="editorial-grid">
        <!-- Large image left -->
        <div class="editorial-image editorial-image--large">
          <img src="/images/cookies.jpg" alt="ADEUX" loading="lazy" />
        </div>

        <!-- Text content right -->
        <div class="editorial-text">
          <span class="editorial-number">01</span>
          <div class="editorial-content">
            <h3 class="editorial-category">Product Photography</h3>
            <h2 class="editorial-title">ADEUX</h2>
            <p class="editorial-description">
              Artisanal burgers deserve artisanal photography. This project explores the
              intersection of food, craft, and visual storytelling.
            </p>
            <div class="editorial-meta">
              <span>Beersel, Belgium</span>
              <span>2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reversed layout -->
    <section class="editorial-section layout-2">
      <div class="editorial-grid editorial-grid--reverse">
        <!-- Text left -->
        <div class="editorial-text">
          <span class="editorial-number">02</span>
          <div class="editorial-content">
            <h3 class="editorial-category">Product Photography</h3>
            <h2 class="editorial-title">Sweetsbydagi</h2>
            <p class="editorial-description">
              Each confection is a work of art. Through careful composition and lighting,
              we reveal the delicate beauty of handcrafted sweets.
            </p>
            <div class="editorial-meta">
              <span>Zaventem, Belgium</span>
              <span>2025</span>
            </div>
          </div>
        </div>

        <!-- Image right -->
        <div class="editorial-image editorial-image--large">
          <img src="/images/panama-ice.jpg" alt="Sweetsbydagi" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- Full-width image break -->
    <section class="editorial-break">
      <div class="break-image">
        <img src="/images/panama-totoche.jpg" alt="Panama" loading="lazy" />
      </div>
      <div class="break-text">
        <h2 class="break-title">Panama</h2>
        <p class="break-subtitle">A visual journey through Central America</p>
      </div>
    </section>

    <!-- Quote section -->
    <section class="editorial-quote">
      <blockquote class="quote-text">
        "Photography is the story I fail to put into words."
      </blockquote>
      <cite class="quote-author">— Destin Sparks</cite>
    </section>
  </div>
</template>

<style scoped>
.editorial-story {
  background-color: #f4f4f4;
}

.editorial-section {
  padding: 8rem 4rem;
}

.editorial-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
}

.editorial-grid--reverse {
  grid-template-columns: 0.8fr 1.2fr;
}

/* Images */
.editorial-image {
  position: relative;
  overflow: hidden;
}

.editorial-image--large {
  aspect-ratio: 3/4;
}

.editorial-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.editorial-image:hover img {
  transform: scale(1.03);
}

/* Text content */
.editorial-text {
  position: relative;
  padding: 2rem;
}

.editorial-number {
  position: absolute;
  top: -2rem;
  left: 0;
  font-size: 10rem;
  font-weight: 500;
  color: rgba(32, 29, 29, 0.05);
  line-height: 1;
  pointer-events: none;
}

.editorial-content {
  position: relative;
  z-index: 2;
}

.editorial-category {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #666;
  margin: 0 0 1rem 0;
  font-weight: 300;
}

.editorial-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 500;
  color: #201d1d;
  margin: 0 0 2rem 0;
  line-height: 1;
  letter-spacing: -0.02em;
}

.editorial-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  color: #444;
  margin: 0 0 2rem 0;
  font-weight: 300;
  max-width: 500px;
}

.editorial-meta {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Full-width break */
.editorial-break {
  position: relative;
  height: 90vh;
  overflow: hidden;
  margin: 4rem 0;
}

.break-image {
  width: 100%;
  height: 100%;
}

.break-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.break-text {
  position: absolute;
  bottom: 4rem;
  left: 4rem;
  color: #f4f4f4;
  z-index: 2;
}

.break-title {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 500;
  margin: 0;
  line-height: 1;
  letter-spacing: -0.02em;
}

.break-subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 300;
  margin: 1rem 0 0 0;
  opacity: 0.9;
}

/* Quote section */
.editorial-quote {
  padding: 10rem 4rem;
  text-align: center;
  background-color: #201d1d;
  color: #f4f4f4;
}

.quote-text {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  line-height: 1.4;
  margin: 0 auto 2rem;
  max-width: 1000px;
  font-style: italic;
  letter-spacing: -0.01em;
}

.quote-author {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.6;
  font-style: normal;
}

@media screen and (max-width: 991px) {
  .editorial-section {
    padding: 4rem 2rem;
  }

  .editorial-grid,
  .editorial-grid--reverse {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .editorial-number {
    font-size: 6rem;
  }

  .break-text {
    left: 2rem;
    bottom: 2rem;
  }

  .editorial-quote {
    padding: 6rem 2rem;
  }
}
</style>
