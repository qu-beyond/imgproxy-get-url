<template>
  <div>
    <section class="hero is-light">
      <!-- Hero head: will stick at the top -->
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <span
                class="navbar-burger burger"
                :class="{ 'is-active': menuActive }"
                data-target="navbarMenuHeroA"
                @click="menuActive = !menuActive"
              >
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div
              id="navbarMenuHeroA"
              class="navbar-menu"
              :class="{ 'is-active': menuActive }"
            >
              <div class="navbar-end">
                <nuxt-link
                  v-for="(item, key) of items"
                  :key="key"
                  :to="item.to"
                  exact-active-class="is-active"
                  class="navbar-item"
                >
                  {{ item.title }}
                </nuxt-link>
                <a
                  href="https://docs.imgproxy.net/"
                  class="navbar-item"
                  target="_blank"
                >
                  ImgProxy Docs
                </a>
                <a
                  href="/api/#/URL/post_url"
                  class="navbar-item"
                  target="_blank"
                >
                  API Docs
                </a>
                <a
                  class="navbar-item"
                  href="https://github.com/qu-beyond/imgproxy-get-url"
                  target="_blank"
                >
                  <span>Github</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Hero content: will be in the middle -->
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            imgProxy URL API
          </h1>
          <!-- <h2 class="subtitle">
            Subtitle
          </h2> -->
        </div>
      </div>
    </section>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuActive: false,
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        }
      ]
    }
  }
}
</script>
