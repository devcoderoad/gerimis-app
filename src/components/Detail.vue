<template>
  <div class="wrapper-light">
    <div class="decks">
      <div class="mb-4 py-2">
        <router-link to="/dashboard">
          <ph-caret-left
            class="mr-2"
            :size="24"
            color="#ffffff"
            weight="regular"
          />
        </router-link>
      </div>
    </div>
    <!-- {{ city.status }} -->
    <div v-if="city" class="decks">
      <div v-if="!detail">
        <div class="container">
          <div class="card-location">
            <a v-on:click="detail = !detail" href="/#/detail">
              <div class="flex flex-row justify-between">
                <h6 class="card-weather">
                  {{
                    city.weather &&
                      city.weather[0] &&
                      city.weather[0].description
                  }}
                </h6>
                <img
                  :src="`${API_OMAP_BASE}img/wn/${city.weather[0].icon}@2x.png`"
                  width="120"
                />
              </div>
              <p class="flex flex-row font-bold my-4 mr-auto">
                <ph-map-pin
                  class="mr-2"
                  :size="24"
                  color="#ffffff"
                  weight="fill"
                />
                {{ city.name }}
              </p>
              <div v-if="city && city.main" class="icon-weather">
                <div class="icon-weather-body md:py-2 md:mx-0">
                  <h4 class="text-xs font-bold">
                    <ph-thermometer-simple
                      :size="22"
                      color="#ffffff"
                      class="inline mr-1"
                    />{{ city.main.temp }}&#8457;
                  </h4>
                </div>
                <div class="icon-weather-body">
                  <ph-cloud-rain class="mr-1" :size="22" color="#ffffff" />
                  <span class="weather-stat">{{ city.main.humidity }}</span>
                </div>
                <div class="icon-weather-body">
                  <ph-sun-dim class="mr-1" :size="22" color="#ffffff" />
                  <span class="weather-stat">{{ city.main.temp }}</span>
                </div>
                <div class="icon-weather-body">
                  <ph-wind class="mr-1" :size="22" color="#ffffff" />
                  <span class="weather-stat">{{ city.wind.speed }} mpl</span>
                </div>
              </div>
            </a>
          </div>
        </div>
        <slot>
          <h6 class="text-left text-white mt-3">News</h6>
          <slot v-if="news.status === 'loading'">
            <div class="mx-auto text-center mt-2">
              <!-- {{ news.status }}... -->
              <ph-spinner
                :size="42"
                color="#ffffff"
                weight="bold"
                class="block w-full"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="5s"
                  from="0 0 0"
                  to="360 0 0"
                  repeatCount="indefinite"
                />
              </ph-spinner>
            </div>
          </slot>
          <slot
            v-else-if="
              news.status === 'success' &&
                news &&
                news.data.length &&
                news.data.length > 0
            "
          >
            <div v-for="item in news.data" :key="item.time" class="card-news">
              <div class="pt-1" :rel="item.type">
                <h3 class="font-semibold mt-0 leading-tight">
                  {{ item.title }}
                </h3>
                <div
                  class="flex flex-row flex-wrap gap-2 justify-start items-center pt-2"
                >
                  <a
                    target="_blank"
                    :href="item.url"
                    class="text-gray-500 font-extralight hover:text-gray-800"
                    :title="item.url"
                  >
                    <ph-link-simple size="20" class="inline" /> URL
                  </a>
                  <div class="text-gray-500 font-extralight">
                    <ph-user size="20" class="inline" />
                    {{ item.by }}
                  </div>
                  <div class="text-gray-500 font-extralight">
                    <ph-clock-clockwise size="20" class="inline" />
                    <!-- {{ new Date(item.time * 1000).toDateString() }} -->
                    <!-- {{ new Date(item.time).toISOString() }} -->
                    {{ formatUnixTime(item.time) }}
                  </div>
                </div>
              </div>
            </div>
          </slot>
          <slot v-else-if="news.status === 'error'">
            <h3>Fetch error...</h3>
            <div class="mx-auto text-center">{{ news.status }}</div>
          </slot>
        </slot>
      </div>
      <div v-else>
        <div class="card-detail">
          <div class="w-full">
            <div class="flex flex-row flex-wrap justify-between">
              <a v-on:click="detail = !detail" href="/#/detail"
                ><ph-caret-left class="mr-2" :size="24" color="#ffffff"
              /></a>
              <h2 class="card-weather">{{ city.name }}</h2>
              <div>
                <router-link
                  to="/dashboard"
                  class="text-xl font-bold align-middle"
                  ><ph-dots-three :size="32" color="#ffffff" weight="bold"
                /></router-link>
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
                width="120"
                class="mx-auto"
              />
              <h1 class="font-bold card-weather">
                <ph-thermometer-simple
                  :size="28"
                  color="#ffffff"
                  weight="regular"
                  class="inline mb-1"
                />{{ temperature }}&deg;
              </h1>
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
          <div class="flex flex-row text-dark -m-2 -mb-6">
            <div class="card-stats-body">
              <div class="w-1/3 flex flex-wrap content-center justify-center">
                <ph-sun-dim :size="40" color="#4779DA" weight="regular" />
              </div>
              <div class="w-2/3 flex flex-col">
                <div>{{ city.main.feels_like }}</div>
                <div>UV Index</div>
              </div>
            </div>
            <div class="card-stats-body">
              <div class="w-1/3 flex flex-wrap content-center justify-center">
                <ph-cloud-rain :size="40" color="#4779DA" weight="regular" />
              </div>
              <div class="w-2/3 flex flex-col">
                <div>{{ city.main.humidity }}%</div>
                <div>Humidity</div>
              </div>
            </div>
          </div>
          <div class="card-stats">
            <h4>Quote of the day</h4>
            <div
              class="flex flex-row text-dark -mr-2 -ml-2 cursor-pointer"
              @click="$store.dispatch('getQuote')"
            >
              <slot v-if="quote.status === 'loading'">
                <div
                  class="mx-auto text-center h-24 flex align-middle items-center"
                >
                  <!-- {{ quote.status }}... -->
                  <ph-spinner
                    :size="42"
                    color="#ffffff"
                    weight="bold"
                    class="block w-full"
                  >
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      dur="5s"
                      from="0 0 0"
                      to="360 0 0"
                      repeatCount="indefinite"
                    />
                  </ph-spinner>
                </div>
              </slot>
              <slot v-if="quote.status === 'success'">
                <div class="card-stats-info">
                  <div>
                    <ph-quotes
                      :size="35"
                      color="#4779DA"
                      weight="regular"
                      class="mx-2"
                    />
                  </div>
                  <div v-if="quote.data && quote.data.content" class="pr-2">
                    <div class="align-middle leading-tight my-1 text-gray-600">
                      {{ quote.data.content }}
                    </div>
                    <div class="font-extralight italic">
                      {{ quote.data.author ? `- ${quote.data.author}` : '' }}
                    </div>
                  </div>
                </div>
              </slot>
              <slot v-else-if="quote.status === 'error'">
                <h3>Fetch error...</h3>
                <div class="mx-auto text-center">{{ quote.status }}</div>
              </slot>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PhCaretLeft,
  PhMapPin,
  PhCloudRain,
  PhSunDim,
  PhWind,
  PhThermometer,
  PhThermometerSimple,
  PhDotsThree,
  PhQuotes,
  PhLinkSimple,
  PhSpinner,
  PhUser,
  PhClockClockwise
} from 'phosphor-vue'
/* Vuex */
import { mapState } from 'vuex'
import { fToC } from '@/utils'

import { API_OMAP_BASE } from '@/constants/env'
import Footer from './global/Footer.vue'

export default {
  components: {
    PhCaretLeft,
    PhMapPin,
    PhCloudRain,
    PhSunDim,
    PhWind,
    PhThermometer,
    PhThermometerSimple,
    PhDotsThree,
    PhQuotes,
    PhLinkSimple,
    PhSpinner,
    PhUser,
    PhClockClockwise,
    Footer
  },
  computed: {
    ...mapState({
      city: state => state.currentCity.data,
      quote: state => state.quote,
      news: state => state.news
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
    },
    formatUnixTime(timestamp) {
      // Create a new JavaScript Date object based on the timestamp
      const date = new Date(timestamp * 1000)
      // Day part from the timestamp
      const day = date.getDate()
      // Month part from the timestamp
      const month = date.getMonth()
      // Year part from the timestamp
      const year = date.getFullYear()
      // Hours part from the timestamp
      const hours = date.getHours()
      // Minutes part from the timestamp
      const minutes = '0' + date.getMinutes()
      // Seconds part from the timestamp
      const seconds = '0' + date.getSeconds()
      // Will display time in 4/2/2022 20:53:43 format
      const formattedTime = `${day}/${month}/${year} ${hours}:${minutes.substr(
        -2
      )}:${seconds.substr(-2)}`

      return formattedTime
    }
  },
  created() {
    const { $store, $route } = this
    if ($route.params && $route.params.id) {
      const city = {
        ...$store.state.cities.find(city => city.id === $route.params.id)
      }
      if (city.coord) {
        $store.dispatch('getCurrentCity', {
          lat: city.coord.lat,
          long: city.coord.lon
        })
      }
    }
    $store.dispatch('getNews')
    $store.dispatch('getQuote')
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
