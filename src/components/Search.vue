<template>
  <div class="wrapper-map">
    <div class="w-full">
      <div class="search-wrapper">
        <a href="/#/dashboard" class="pr-6 py-3"
          ><ph-caret-left :size="32" color="#303030" weight="bold"
        /></a>
        <input
          type="text"
          placeholder="Enter cities"
          class="input-search"
          v-model="query"
          v-on:keyup.enter="
            e => {
              search({
                query: e.currentTarget.value
              })
            }
          "
        />
        <a class="text-xl font-bold align-middle" href="/#/dashboard"
          ><ph-dots-three :size="32" color="#303030" weight="bold"
        /></a>
      </div>
      <div v-if="!searchNotFound">
        <div
          v-if="
            (cities && cities.length > 0) ||
              (searchCity && searchCity.status === 'success')
          "
          :class="cities.length > 0 ? `card-city-wrapper` : `hidden`"
        >
          <a
            v-on:click="closed = !closed"
            class="text-gray-700 block w-full text-right mb-1 mr-0 pr-0 text-sm cursor-pointer"
          >
            {{ closed ? 'Open' : 'Close' }}
          </a>
          <div v-if="cities && cities.length > 0">
            <div
              :class="
                `card-city${
                  !closed
                    ? ` h-full overflow-auto border-b-2 border-gray-300`
                    : ` h-0 overflow-hidden p-0 m-0`
                }`
              "
              v-for="city in cities"
              :key="city.name"
            >
              <a
                v-on:click="
                  removeCity({
                    id: city.id
                  })
                "
                class="text-gray-700 block w-full mt-1 cursor-pointer"
              >
                <ph-x
                  :size="20"
                  color="#303030"
                  weight="bold"
                  class="ml-auto"
                />
              </a>
              <div class="w-auto">
                <ph-map-pin
                  class="mr-2"
                  :size="24"
                  color="#303030"
                  weight="fill"
                />
              </div>
              <div class="w-1/3 text-left">
                <div>
                  <h3 class="font-bold">{{ city.name }}</h3>
                </div>
                <div>
                  <h4 class="text-gray-400">{{ city.sys.country }}</h4>
                </div>
              </div>
              <div class="w-7/12">
                <div class="flex flex-row mb-4 text-right">
                  <div class="w-1/2">
                    <div class="text-center w-full">
                      <img
                        v-if="city.weather && city.weather[0]"
                        :src="
                          `${API_OMAP_BASE}img/wn/${city.weather[0].icon}@2x.png`
                        "
                        class="mx-auto"
                        width="100"
                      />
                    </div>
                    <div class="text-center w-full">
                      <h4 class="text-1xl">{{ city.main.temp }}&#8457;</h4>
                    </div>
                  </div>
                  <div class="w-1/2 text-right">
                    <h4 class="text-lg capitalize">
                      {{ city.weather && city.weather[0].description }}
                    </h4>
                  </div>
                </div>
              </div>
              <div class="w-full">
                <div class="flex flex-row mb-4 text-left">
                  <div class="w-1/2">
                    <div class="text-xs text-gray-400">
                      Longitude and latitude
                    </div>
                    <div class="text-base">
                      {{ city.coord.lat }},
                      {{ city.coord.lon }}
                    </div>
                  </div>
                  <div class="w-1/2 text-right md:text-left">
                    <div class="text-xs text-gray-400">Wind</div>
                    <div class="text-base">{{ city.wind.speed }}mph</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="searchNotFound && searchCity.status === 'error'"
        class="card-city-wrapper"
      >
        <div class="card-city px-3 py-4">
          <h1 class="font-bold leading-10">City not found : {{ query }}</h1>
        </div>
      </div>
      <iframe
        style="border:0"
        loading="lazy"
        class="maps-embed"
        allowfullscreen
        :src="
          `${API_GMAP_URL}key=${API_GMAP_KEY}&amp;q=${(searchCity.data &&
            searchCity.data.coord &&
            `${searchCity.data.coord.lat},${searchCity.data.coord.lon}`) ||
            city.name}&amp;zoom=8`
        "
      >
      </iframe>
    </div>
  </div>
</template>

<script>
import { PhX, PhMapPin, PhDotsThree, PhCaretLeft } from 'phosphor-vue'
import { mapState, mapActions } from 'vuex'
import { API_OMAP_BASE, API_GMAP_URL, API_GMAP_KEY } from '@/constants/env'

export default {
  components: {
    PhX,
    PhMapPin,
    PhDotsThree,
    PhCaretLeft
  },
  data() {
    return {
      closed: false,
      query: '',
      API_GMAP_URL,
      API_GMAP_KEY,
      API_OMAP_BASE
    }
  },
  computed: {
    ...mapState({
      city: state => state.currentCity.data,
      searchCity: 'currentSearch',
      cities: 'cities',
      searchNotFound: state => {
        return state.currentSearch.status === 'error'
      }
    })
  },
  methods: {
    ...mapActions({
      search: 'getCurrentSearch',
      removeCity: 'removeCity'
    })
  }
}
</script>

<style scoped lang="postcss">
h1 {
  font-size: 2.125rem;
  margin-bottom: 1.625rem;
  @apply font-bold;
}
</style>
