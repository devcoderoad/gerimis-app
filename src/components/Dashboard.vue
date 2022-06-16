<template>
  <div class="wrapper">
    <div class="w-10/12 sm:w-1/4 md:w-1/2 mx-auto mb-8 text-left">
      <h6 class="text-sm mb-4 pt-2 mix-blend-overlay">Current location</h6>
      <router-link to="/detail" class="flex flex-row font-bold">
        <ph-map-pin
          class="animate-bounce mr-2"
          :size="24"
          color="#ffffff"
          weight="fill"
        />
        {{ city && city.name }}
      </router-link>
    </div>
    <div class="w-10/12 sm:w-1/4 md:w-1/2 mx-auto my-8 mb-6 text-left">
      <router-link
        to="/search"
        class="flex flex-row font-bold hover:text-dark mix-blend-overlay mb-8"
      >
        <ph-map-pin-line
          class="mr-2"
          :size="24"
          color="#ffffff"
          weight="fill"
        />Add Location</router-link
      >
      <slot v-for="city in cities">
        <router-link
          :key="city.id"
          :to="{ name: 'detailId', params: { id: city.id } }"
          class="flex flex-row font-normal mb-4"
        >
          <ph-map-pin class="mr-2" :size="24" color="#ffffff" weight="thin" />
          {{ city.name }}</router-link
        >
      </slot>
    </div>
    <div class="w-10/12 sm:w-1/4 md:w-1/2 mx-auto mt-8 mb-6 text-left">
      <!-- <router-link to="/setting" class="flex flex-row font-bold mb-4">
        <ph-gear class="mr-2" :size="20" color="#ffffff" weight="fill" />
        Settings
      </router-link> -->
      <a href="#" class="flex flex-row font-bold mb-4"
        ><ph-gear class="mr-2" :size="20" color="#ffffff" weight="fill" />
        Settings</a
      >
      <a
        href="https://www.twitter.com/share?url=https://gerimis-app.vercel.app/#/"
        class="flex flex-row font-bold mb-4"
        target="_blank"
        rel="nofollow, noindex, noreferrer"
        ><ph-gear class="mr-2" :size="20" color="#ffffff" weight="fill" />
        Share this app
      </a>
      <!-- <a href="/" class="flex flex-row font-bold mb-4"
        ><ph-gear class="mr-2" :size="20" color="#ffffff" weight="fill" /> Rate
        this app</a
      > -->
    </div>
    <Footer />
  </div>
</template>

<script>
import { PhGear, PhMapPin, PhMapPinLine } from 'phosphor-vue'
import { mapState } from 'vuex'
import Footer from './global/Footer.vue'

export default {
  components: {
    PhGear,
    PhMapPin,
    PhMapPinLine,
    Footer
  },
  computed: {
    ...mapState({
      city: state => state.currentCity.data,
      cities: state => state.cities.slice(0, 10)
    })
  }
  // mounted() {
  //   const { $store } = this
  //   // if ($store.state.currentCity.data && $store.state.currentCity.data.name) {
  //   $store.dispatch('getNews', {
  //     query: $store.state.currentCity.data.name
  //   })
  //   // }
  // }
}
</script>

<style scoped lang="postcss">
h1 {
  font-size: 2.125rem;
  margin-bottom: 1.625rem;
  @apply font-bold;
}
p {
  max-width: 14.313rem;
  letter-spacing: 0.43012px;
  @apply mix-blend-overlay;
}
</style>
