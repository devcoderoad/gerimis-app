<template>
  <div class="wrapper">
    <router-link to="/dashboard">
      <ph-cloud-sun
        class="mx-auto animate-bounce mb-6"
        :size="84"
        color="#ffffff"
        weight="thin"
      />
      <h1>Gerimis</h1>
      <h2 class="mx-auto px-8 xs:px-32 lg:px-28 text-lg w-full leading-tight">
        Dont worry about the weather when you're on travel
      </h2>
      <p class="mx-auto mt-5 font-bold text-xl mb-5">
        {{ city && city.name }}
        <!-- <strong>{{ city && getTemp(city.main.temp) }}</strong> -->
        <!-- <strong>{{ temp }}</strong> -->
      </p>
      <span
        ><ph-thermometer-simple
          :size="24"
          color="#ffffff"
          weight="regular"
          class="inline mr-0 mb-1"
        /><strong
          >{{ city && city.main.temp }}°{{ temp || '' }} /
          {{ fToC(city.main.temp) }}° C</strong
        >
      </span>
    </router-link>
    <div class="mt-6">
      <Footer />
    </div>
  </div>
</template>

<script>
import { PhCloudSun, PhThermometerSimple } from 'phosphor-vue'
import { mapState, mapActions } from 'vuex'
import { fToC } from '@/utils'
import Footer from './global/Footer.vue'

export default {
  components: {
    PhCloudSun,
    PhThermometerSimple,
    Footer
  },
  computed: {
    ...mapState({
      city: state => state.currentCity.data,
      temp: state => state.setup.temp
    })
  },
  methods: {
    ...mapActions({
      setTemp: 'setTemp'
    }),
    fToC
  }
}
</script>

<style scoped lang="postcss">
h1 {
  font-size: 2.125rem;
  margin-bottom: 1.625rem;
  @apply font-bold mix-blend-hard-light;
}
p {
  max-width: 14.313rem;
  letter-spacing: 0.43012px;
}
</style>
