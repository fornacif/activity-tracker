import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		prices: { 
			r22: {cdb: 350, inst: 430 },
			r44: {cdb: 600, inst: 730 }
		},
		consumptions: { r22: 33, r44: 66 } 
	},
	getters: {
		getPrice: (state) => (model, category) => {
			if (model == 'R22') {
				if (category == 'CDB') {
					return state.prices.r22.cdb;
				} else {
					return state.prices.r22.inst;
				}
			} else if (model == 'R44') {
				if (category == 'CDB') {
					return state.prices.r44.cdb;
				} else {
					return state.prices.r44.inst;
				}
			}
		},
		getConsumption: (state) => (model) => {
			if (model == 'R22') {
				return state.consumptions.r22;
			} else {
				return state.consumptions.r44;
			}
		}
	},
	mutations: {
	},
	actions: {
	},
	modules: {
	}
})
