import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const firebase = require('./firebaseConfig.js')

const ADD_ACTIVITY = 'ADD_ACTIVITY'
const CLEAR_ACTIVITIES = 'CLEAR_ACTIVITIES'
const NEED_ACTIVITIES_RELOAD = 'NEED_ACTIVITIES_RELOAD'
const IS_LOADING = 'IS_LOADING'

export default new Vuex.Store({
	state: {
		activities: [],
		needActivitiesReload: true,
		isLoading: false,
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
		[ADD_ACTIVITY]: (state, activity) => {
			state.activities.push(activity);
		},
		[CLEAR_ACTIVITIES]: (state,) => {
			state.activities = [];
		},
		[NEED_ACTIVITIES_RELOAD]: (state, value) => {
			state.needActivitiesReload = value;
		},
		[IS_LOADING]: (state, value) => {
			state.isLoading = value;
		},
	},
	actions: {
		async getActivities({commit, state}) {
			if (state.needActivitiesReload) {
				try {
					commit(IS_LOADING, true);
					commit(CLEAR_ACTIVITIES, true);
					let uid = firebase.auth.currentUser.uid;
					let snapshot = await firebase.activitiesCollection.where('uid', '==', uid).orderBy('date', 'desc').orderBy('startTime', 'desc').get();
					snapshot.forEach(doc => {
						let activity = doc.data();
						activity.id = doc.id;
						commit(ADD_ACTIVITY, activity);
					})
					commit(NEED_ACTIVITIES_RELOAD, false);
				} catch(error) {
					console.error(error);
				} finally {
					commit(IS_LOADING, false);
				}
			}
		},
		async addActivity({commit}, activity) {
            try {
				commit(NEED_ACTIVITIES_RELOAD, true);
				commit(IS_LOADING, true);
                await firebase.activitiesCollection.add(activity);
			} catch(error) {
                console.error(error);
            } finally {
				commit(IS_LOADING, false);
            }
        },
		async deleteActivity({commit}, activity) {
            try {
				commit(NEED_ACTIVITIES_RELOAD, true);
                await firebase.activitiesCollection.doc(activity.id).delete();
            } catch(error) {
                console.error(error);
            } finally {
				commit(IS_LOADING, false);
            }
		}
	},
	modules: {
	}
})
