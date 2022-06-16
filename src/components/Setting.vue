<template>
  <div class="wrapper-light">
    <div class="decks">
      <div class="mb-4 p-2">
        <router-link to="/dashboard">
          <svg
            width="10"
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.79995 3.00001L3.79995 9.00001L9.79995 15L8.59995 17.4L0.199951 9.00001L8.59995 0.600006L9.79995 3.00001Z"
              fill="white"
            />
          </svg>
        </router-link>
      </div>
    </div>
    <div v-if="city" class="decks">
      <div v-if="!detail">
        <div class="card-location">
          <a v-on:click="detail = !detail" href="/#/detail">
            <div class="flex flex-row justify-between">
              <h6 class="card-weather">
                Unit
              </h6>
              <div class="flex items-center justify-center w-full mb-4">
                <label for="toggleB" class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input
                      type="checkbox"
                      id="toggleB"
                      class="sr-only"
                      v-on:change="changeDegree(formatTemp)"
                    />
                    <div class="block bg-gray-600 w-34 h-8 rounded-full pl-6">
                      <span class="text-xs ml-10 mr-2 align-text-bottom">{{
                        formatText
                      }}</span>
                    </div>
                    <div
                      class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
                    ></div>
                  </div>
                </label>
              </div>
            </div>
            <p class="flex flex-row font-bold my-4 mr-auto">
              {{ city.name }}
            </p>
            <div v-if="city && city.main" class="icon-weather">
              <div class="icon-weather-body md:p-2">
                <h4 class="font-bold m-0 p-2">{{ city.main.temp }}&#8457;</h4>
              </div>
            </div>
          </a>
        </div>
        <h6 class="text-left text-black mt-3">News</h6>
        <div class="card-news">
          <div class="bg-gray-100 -m-6 h-24"></div>
          <div class="pt-5">
            <h3 class="font-bold mt-6">
              Startup joins Forces with collaboration to Launch 'Clean &amp;
              Fix' Feature
            </h3>
            <div class="flex flex-row flex-wrap justify-between pt-2">
              <div>14 minutes ago</div>
              <div>AntMine Media</div>
            </div>
          </div>
        </div>
        <div class="card-news">
          <div class="bg-gray-100 -m-6 h-24"></div>
          <div class="pt-5">
            <h3 class="font-bold mt-6">
              After $1m seed round, services marketplace RecomN targets
              regular...
            </h3>
            <div class="flex flex-row flex-wrap justify-between pt-2">
              <div>14 minutes ago</div>
              <div>AntMine Media</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="card-detail -m-4">
          <div class="w-full">
            <div class="flex flex-row flex-wrap justify-between">
              <a v-on:click="detail = !detail" href="/#/detail"
                ><ph-caret-left
                  class="mr-2"
                  :size="24"
                  color="#ffffff"
                  weight="regular"
              /></a>

              <h2 class="text-xl">{{ city.name }}</h2>
              <div>
                <router-link
                  to="/dashboard"
                  class="text-xl font-bold align-middle"
                  >...</router-link
                >
              </div>
            </div>
            <div class="flex items-center justify-center w-full mb-4">
              <label for="toggleB" class="flex items-center cursor-pointer">
                <div class="relative">
                  <input
                    type="checkbox"
                    id="toggleB"
                    class="sr-only"
                    v-on:change="changeDegree(formatTemp)"
                  />
                  <div class="block bg-gray-600 w-34 h-8 rounded-full pl-6">
                    <span class="text-xs ml-10 mr-2 align-text-bottom">{{
                      formatText
                    }}</span>
                  </div>
                  <div
                    class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
                  ></div>
                </div>
              </label>
            </div>
            <div class="block mx-auto text-center">
              <img
                v-if="city.weather && city.weather[0]"
                :src="`${API_OMAP_BASE}img/wn/${city.weather[0].icon}@2x.png`"
                width="140"
                class="mx-auto"
              />
              <h1 class="font-bold">{{ temperature }}&deg;</h1>
              <span>{{ city.coord.lat }}</span
              >, <span>{{ city.coord.lon }}</span>
              <h2 class="card-weather">
                {{
                  city.weather && city.weather[0] && city.weather[0].description
                }}
              </h2>
              <span>{{ formatDate() }}</span>
            </div>
          </div>
        </div>
        <div class="card-stats">
          <h4 class="mb-2">Detail</h4>
          <div class="flex flex-row text-dark -m-2">
            <div class="card-stats-body">
              <div class="w-1/3 flex flex-wrap content-center justify-center">
                <ph-thermometer :size="40" color="#4779DA" weight="regular" />
              </div>
              <div class="w-2/3 flex flex-col">
                <div>
                  {{ temperature }}
                </div>
                <div>{{ formatText }}</div>
              </div>
            </div>
            <div class="card-stats-body">
              <div class="w-1/3 flex flex-wrap content-center justify-center">
                <ph-wind :size="40" color="#4779DA" weight="regular" />
              </div>
              <div class="w-2/3 flex flex-col">
                <div>{{ city.wind.speed }} mp/h</div>
                <div>Pressure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PhCaretLeft } from 'phosphor-vue'
/* Vuex */
import { mapState } from 'vuex'
import { fToC } from '@/utils'

import { API_OMAP_BASE } from '@/constants/env'

export default {
  name: 'setting',
  components: {
    PhCaretLeft
  },
  computed: {
    ...mapState({
      city: state => state.currentCity.data
    })
  },
  data({ $store }) {
    const { currentCity } = $store.state
    return {
      detail: false,
      formatTemp: true,
      formatText: 'Fahrenheit',
      temperature: currentCity && currentCity.data.main.temp,
      API_OMAP_BASE
    }
  },
  methods: {
    changeDegree(formatTemp) {
      const { city } = this
      this.formatTemp = !this.formatTemp
      if (formatTemp) {
        this.temperature = fToC(this.temperature)
        this.formatText = 'Celcius'
      } else {
        this.temperature = city.main.temp
        this.formatText = 'Fahrenheit'
      }
    },
    formatDate() {
      const d = new Date()
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      const monthName = months[d.getMonth()]
      const dayName = days[d.getDay()]
      const formatted = `${dayName}, ${d.getDate()} ${monthName} ${d.getFullYear()}`
      return formatted
    }
  },
  created() {
    const { $store, $route } = this
    if ($route.params && $route.params.id) {
      const city = {
        ...$store.state.cities.find(city => city.id === $route.params.id)
      }
      $store.dispatch('getCurrentCity', {
        lat: city.coord.lat,
        long: city.coord.lon
      })
    }
  }
}
</script>

<style scoped lang="postcss">
h1 {
  font-size: 2.125rem;
  margin-bottom: 1.625rem;
  @apply font-bold;
}
h2 {
  font-size: 1.525rem;
  margin-bottom: 1.325rem;
  @apply font-bold;
}
p {
  max-width: 14.313rem;
  letter-spacing: 0.43012px;
  @apply mix-blend-overlay;
}
</style>
