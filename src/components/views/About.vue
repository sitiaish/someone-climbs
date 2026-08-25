<template>
  <main class="about-root">
    <div class="about-inner">

      <a href="#/" class="back-link">← back to his data</a>

      <!-- Header -->
      <header class="about-header">
        <img :src="`${baseUrl}aishah-5.svg`" alt="Aishah" class="about-sprite" />
        <div>
          <h1 class="about-headline">so, about this project...</h1>
        </div>
      </header>

      <!-- Data & Methodology -->
      <section class="about-section">
        <p class="section-label">data &amp; methodology</p>

        <!-- Dataset 1 -->
        <div class="dataset-block">
          <p class="dataset-title">Dataset 1 — Outdoor lead climbs</p>

          <p class="about-note">This dataset covers outdoor lead climbs only.</p>

          <p class="about-body">
            Sourced from their climbing log on
            <a href="https://www.thecrag.com/climber/miniprefix" target="_blank" rel="noopener noreferrer">TheCrag</a>,
            an international community-built platform where climbers log their outdoor ascents.
          </p>
          <p class="about-body">
            To extract the data, I used the Chrome extension <strong>Instant Data Scraper</strong> to get it into CSV format —
            not the cleanest output, but it does the job. A few manual passes on Google Sheets cleaned it up enough,
            since the dataset was small enough to not make me want to cry.
          </p>
          <p class="about-body">
            For the SVG route paths: I opened each route page on TheCrag individually, used the inspector to find
            the <code>d</code> attribute on the SVG path element, and manually copied it into a new column in the dataset.
            Every wiggly line you see in this project was hand-pinched out of a webpage. Thank you to all the contributors of TheCrag for logging it!
          </p>
        </div>

        <!-- Dataset 2 -->
        <div class="dataset-block">
          <p class="dataset-title">Dataset 2 — Bouldering trips</p>
          <p class="about-body">
            Sourced from their public climbing Instagram page
            — because the bouldering trips weren't logged on TheCrag, but they were absolutely documented on the grid.
            *I scrolled through his posts and stories and manually built a second dataset recording country, location,
            and route names completed per trip.
          </p>
        </div>

        <div class="dataset-block">
          <p class="about-body draws-label">Questions that draw from Dataset 1 only:</p>
          <ul class="question-list">
            <li class="question-item">So, what's the most difficult rock they have ever climbed?</li>
            <li class="question-item">Does he actually finish his climbs, or does he just... give up?</li>
            <li class="question-item">Can I see all his routes? Like... all of them?</li>
          </ul>

          <p class="about-body draws-label">Questions that draw from both datasets:</p>
          <ul class="question-list">
            <li class="question-item">Crashpads or ropes — which does he check-in?</li>
            <li class="question-item">How many countries has he travelled to just to touch rocks?</li>
            <li class="question-item">Are climbing route names just unhinged, or is it just him?</li>
          </ul>
        </div>
      </section>

      <!-- About This Project -->
      <section class="about-section">
        <p class="section-label">Disclaimer on AI Usage</p>
        <p class="about-body">
          I am a frontend developer doing websites • data visualisation • data storytelling.
        </p>
        <p class="about-body">
          This project was built with AI assistance from Claude (Anthropic). Portions of the code were AI-generated and subsequently
          reviewed, tested, and modified by me. Mistakes that remain are definitely the AI's fault (kidding). 
          The ideation, design direction, data collection, and data processing are mine.
        </p>
        <p class="about-body">
          I make nothing from this. No revenue, no brand deals, no free chalk bags (coz ain't no sweaty palms)
        </p>
      </section>

      <!-- Notes from the process -->
      <section class="about-section">
        <p class="section-label">notes from the process</p>
        <div class="photo-grid">
          <div class="photo-placeholder">photo</div>
          <div class="photo-placeholder">photo</div>
          <div class="photo-placeholder">photo</div>
          <div class="photo-placeholder">photo</div>
        </div>
      </section>

      <!-- Why This Exists -->
      <section class="about-section">
        <p class="section-label">why this exists</p>
        <!-- <p class="about-body">
          My love language is making weird little things for the people I care about.
        </p> -->
        <p class="about-body">
          If you want something like this for your climbing friend — or honestly any friend with enough publicly
          available data to be mildly investigated — hit me up. Let's make something!
        </p>
      </section>

      <a href="#/extras" class="about-footer">*and yes, i went through his entire logbook. don't @ me.</a>
    </div>
  </main>
</template>

<script setup>
defineOptions({ name: 'AboutPage' })
const baseUrl = import.meta.env.BASE_URL
</script>

<style scoped>
.about-root {
  min-height: 100vh;
  background: #fff0f6;
  padding: 64px 24px 96px;
  font-family: 'Gloria Hallelujah', cursive;
}

.about-inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* Back link */
.back-link {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #e8388a;
  text-decoration: none;
  background: none !important;
  align-self: flex-start;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.back-link:hover { opacity: 1; background: none !important; }

/* Header */
.about-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.about-sprite {
  width: 96px;
  height: 96px;
  object-fit: contain;
  flex-shrink: 0;
}

.label {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #e8388a;
  margin: 0 0 10px;
}

.about-headline {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 700;
  color: #e8388a;
  line-height: 1.4;
  margin: 0;
}

/* Sections */
.about-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-label {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #e8388a;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ffb3d1;
}

/* Dataset blocks */
.dataset-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid #ffb3d1;
}

.dataset-title {
  font-family: 'Fira Code', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #c0285a;
  margin: 0;
}

.about-body {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 15px;
  line-height: 2.1;
  color: #c0285a;
  margin: 0;
}

.about-body a {
  color: #e8388a;
  font-weight: 700;
}

.about-body strong { color: #e8388a; }

code {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  background: #ffe0ee;
  color: #c0285a;
  padding: 1px 6px;
  border-radius: 4px;
}

.about-note {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #e8388a;
  opacity: 0.7;
  margin: 0;
}

.draws-label {
  font-family: 'Fira Code', monospace !important;
  font-size: 11px !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #e8388a !important;
  opacity: 0.8;
  margin: 4px 0 0 !important;
}

/* Question list */
.question-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-item {
  font-family: 'fira code', monospace;
  font-size: 12px;
  color: #c0285a;
  padding: 8px 15px;
  background: #ffe0ee;
  border-radius: 8px;
  line-height: 1.6;
  width: fit-content;
}

/* Photo grid */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.photo-placeholder {
  aspect-ratio: 4 / 3;
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed #ffb3d1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #ffb3d1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Footer — doubles as a hidden easter egg link */
.about-footer {
  display: block;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 12px;
  color: #e8388a;
  text-decoration: none;
  text-align: center;
  margin: 0;
  opacity: 0.45;
  transition: opacity 0.2s;
}
.about-footer:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>
