<template>
  <div id="app" class="main-app">
    <router-view v-if="!errors && onLine" />
    <div
      v-else
      class="flex items-center justify-center h-screen xl:w-1/2 mx-auto px-6"
    >
      <h1 class="text-3xl md:text-6xl md:font-bold text-center">
        <span class="hidden">{{ errors }}</span>
        <small class="text-lg md:text-3xl block mt-4"
          >Please re-check your internet or your browser permission to
          continue.</small
        >
        <small class="w-full"
          ><button
            class="text-xl underline hover:no-underline"
            v-on:click="refresh()"
          >
            Reload
          </button></small
        >
      </h1>
    </div>
    <div
      v-if="!onLine"
      class="border rounded-md w-1/3 mx-auto mb-2 py-1 px-2 fixed top-2 right-2 text-md"
    >
      you are offline...
    </div>
    <div
      v-if="showBackOnline"
      class="border rounded-md w-1/3 mx-auto mb-2 py-1 px-2 fixed top-2 right-2 text-md"
    >
      back online...
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  data: function() {
    return {
      locationLatLong: {},
      getLocation: false,
      cityName: '',
      errors: null,
      onLine: navigator.onLine,
      showBackOnline: false
    }
  },
  methods: {
    getWeatherByLocation() {
      const { setErrors, $store } = this
      if (!('geolocation' in navigator)) {
        setErrors('Geolocation is not available.')
      } else {
        this.getLocation = true
        navigator.geolocation.getCurrentPosition(
          pos => {
            this.getLocation = false
            this.locationLatLong = pos
            $store.dispatch('getCurrentCity', {
              lat: `${pos.coords.latitude}`,
              long: `${pos.coords.longitude}`
            })
          },
          err => {
            this.getLocation = false
            setErrors(err.message)
          }
        )
      }
    },
    refresh() {
      return this.$router.go()
    },
    setErrors(errors) {
      this.errors = errors
    },
    updateOnlineStatus(e) {
      const { type } = e
      this.onLine = type === 'online'
    }
  },
  created() {
    const vm = this
    vm.getWeatherByLocation()
  },
  watch: {
    onLine(v) {
      if (v) {
        this.showBackOnline = true
        setTimeout(() => {
          this.showBackOnline = false
        }, 1000)
      }
    }
  },
  mounted() {
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  },
  beforeDestroy() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  },
  computed: {
    ...mapState({
      city: state => state.currentCity.data
    })
  }
}
</script>
