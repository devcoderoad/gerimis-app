import Vue from 'vue'
import Vuex from 'vuex'

import TYPES from '@/constants/actionTypes'
import STATUS from '@/constants/statusTypes'

import {
  API_OMAP_URL,
  API_OMAP_KEY,
  API_NEWS_URL,
  API_QUOTE_URL
} from '@/constants/env'

import { jsonParse } from '@/utils'
// import { fToC, cToF } from '@/utils'
// import { fToC } from '@/utils'

const { INIT, LOADING, SUCCESS, ERROR } = STATUS
const {
  INITIALIZE_STORE,
  SET_TEMP,
  GET_CURRENT_CITY_LOAD,
  GET_CURRENT_CITY_RES,
  GET_CURRENT_CITY_ERR,
  GET_SEARCH_CITY_LOAD,
  GET_SEARCH_CITY_RES,
  GET_SEARCH_CITY_ERR,
  GET_NEWS_LOAD,
  GET_NEWS_RES,
  GET_NEWS_ERR,
  GET_QUOTE_LOAD,
  GET_QUOTE_RES,
  GET_QUOTE_ERR,
  SET_CITIES,
  REMOVE_CITY
} = TYPES

/* You change units here */
const apiUrl = `${API_OMAP_URL}appid=${API_OMAP_KEY}&units=imperial`

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    currentCity: {
      data: {},
      error: null,
      status: INIT
    },
    currentSearch: {
      data: [],
      error: null,
      status: INIT
    },
    cities: [],
    news: { data: [], error: null, status: INIT },
    quote: { data: [], error: null, status: INIT },
    setup: { temp: 'F' }
  },
  getters: {
    getCurrentCity: state => jsonParse(state.currentCity.data),
    getCurrentSearch: state => jsonParse(state.currentSearch.data),
    getNews: state => jsonParse(state.news.data),
    getTemp: state => jsonParse(state.setup.temp)
  },
  actions: {
    async getCurrentCity({ commit }, params) {
      try {
        const url = `${apiUrl}&lat=${params.lat}&lon=${params.long}`
        commit(GET_CURRENT_CITY_LOAD)
        await fetch(url, { mode: 'cors' })
          .then(async response => {
            if (!response.ok && response.status !== '200') {
              commit(GET_CURRENT_CITY_ERR, response.statusText)
            } else {
              commit(GET_CURRENT_CITY_RES, await response.json())
            }
          })
          .catch(function(error) {
            commit(GET_CURRENT_CITY_ERR, error.TypeError)
          })
      } catch (err) {
        commit(GET_CURRENT_CITY_ERR, err.TypeError)
      }
    },
    async getCurrentSearch({ commit }, params) {
      try {
        const url = `${apiUrl}&q=${params.query}`
        commit(GET_SEARCH_CITY_LOAD)
        await fetch(url, { mode: 'cors' })
          .then(async response => {
            if (!response.ok && response.status !== '200') {
              commit(GET_SEARCH_CITY_ERR, response.statusText)
            } else {
              const result = await response.json()
              commit(GET_SEARCH_CITY_RES, result)
              commit(SET_CITIES, result)
            }
          })
          .catch(function(error) {
            commit(GET_SEARCH_CITY_ERR, error.TypeError)
          })
      } catch (err) {
        commit(GET_SEARCH_CITY_ERR, err.TypeError)
      }
    },
    async getNews({ commit } /*, params*/) {
      try {
        const apiNewsUrl = `${API_NEWS_URL}topstories.json?print=pretty`
        commit(GET_NEWS_LOAD)
        await fetch(apiNewsUrl, {
          mode: 'cors'
        })
          .then(async response => {
            if (!response.ok && response.status !== '200') {
              commit(GET_NEWS_ERR, response.statusText)
            } else {
              const result = await response.json()
              const collection = result.slice(0, 5).map(id =>
                fetch(`${API_NEWS_URL}item/${id}.json`, {
                  mode: 'cors'
                })
                  .then(async response => {
                    return await response.json()
                  })
                  .catch(function(error) {
                    commit(GET_NEWS_ERR, error.TypeError)
                  })
              )
              commit(GET_NEWS_RES, await Promise.all(collection))
            }
          })
          .catch(function(error) {
            commit(GET_NEWS_ERR, error.TypeError)
          })
      } catch (err) {
        commit(GET_NEWS_ERR, err.TypeError)
      }
    },
    async getQuote({ commit } /*.params */) {
      try {
        const url = `${API_QUOTE_URL}random`
        commit(GET_QUOTE_LOAD)
        await fetch(url, { mode: 'cors' })
          .then(async response => {
            if (!response.ok && response.status !== '200') {
              commit(GET_QUOTE_ERR, response.statusText)
            } else {
              commit(GET_QUOTE_RES, await response.json())
            }
          })
          .catch(function(error) {
            commit(GET_QUOTE_ERR, error.TypeError)
          })
      } catch (err) {
        commit(GET_QUOTE_RES, err.TypeError)
      }
    },
    async setTemp({ commit }, params) {
      commit(SET_TEMP, params)
    },
    async removeCity({ commit }, params) {
      try {
        commit(REMOVE_CITY, params)
      } catch (err) {
        commit(GET_SEARCH_CITY_ERR, err.TypeError)
      }
    }
  },
  mutations: {
    [INITIALIZE_STORE](state) {
      if (localStorage.getItem('store')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        )
      } else {
        localStorage.setItem('store', JSON.stringify(state))
      }
    },
    [SET_TEMP](state, payload) {
      // console.log(payload)
      // console.log(state)
      // state.setup.temp = payload
      state.setup.temp = payload
    },
    [GET_CURRENT_CITY_LOAD](state) {
      state.currentCity.status = LOADING
      state.currentCity.error = null
    },
    [GET_CURRENT_CITY_RES](state, payload) {
      if (state.cities.length === 0) {
        state.cities = [payload]
      }
      state.currentCity.data = payload
      state.currentCity.status = SUCCESS
      state.currentCity.error = null
      localStorage.setItem('store', JSON.stringify(state))
    },
    [GET_CURRENT_CITY_ERR](state, error) {
      state.currentCity.status = ERROR
      state.currentCity.error = error
      state.currentCity.data = null
    },
    [GET_SEARCH_CITY_LOAD](state, payload) {
      state.currentSearch.data = payload
      state.currentSearch.status = LOADING
      state.currentSearch.error = null
    },
    [GET_SEARCH_CITY_RES](state, payload) {
      state.currentSearch.data = payload
      state.currentSearch.status = SUCCESS
      state.currentSearch.error = null
      localStorage.setItem('store', JSON.stringify(state))
    },
    [GET_SEARCH_CITY_ERR](state, error) {
      state.currentSearch.status = ERROR
      state.currentSearch.error = error
    },
    [GET_NEWS_LOAD](state, payload) {
      state.news.data = payload
      state.news.status = LOADING
      state.news.error = null
    },
    [GET_NEWS_RES](state, payload) {
      state.news.data = payload
      state.news.status = SUCCESS
      state.news.error = null
      localStorage.setItem('store', JSON.stringify(state))
    },
    [GET_NEWS_ERR](state, error) {
      state.news.status = ERROR
      state.news.error = error
    },
    [GET_QUOTE_LOAD](state, payload) {
      state.quote.data = payload
      state.quote.status = LOADING
      state.quote.error = null
    },
    [GET_QUOTE_RES](state, payload) {
      state.quote.data = payload
      state.quote.status = SUCCESS
      state.quote.error = null
      localStorage.setItem('store', JSON.stringify(state))
    },
    [GET_QUOTE_ERR](state, error) {
      state.quote.status = ERROR
      state.quote.error = error
    },
    [SET_CITIES](state, payload) {
      state.cities = [
        payload,
        ...state.cities.filter(city => city.id !== payload.id)
      ]
      localStorage.setItem('store', JSON.stringify(state))
    },
    [REMOVE_CITY](state, payload) {
      state.cities = state.cities.filter(city => city.id !== payload.id)
      localStorage.setItem('store', JSON.stringify(state))
    }
  }
})
