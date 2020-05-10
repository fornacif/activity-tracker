import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const firebase = require('./firebaseConfig.js')

const ADD_ACTIVITY = 'ADD_ACTIVITY';
const CLEAR_ACTIVITIES = 'CLEAR_ACTIVITIES';
const NEED_ACTIVITIES_RELOAD = 'NEED_ACTIVITIES_RELOAD';
const SET_PROFILE = 'SET_PROFILE';
const NEED_PROFILE_RELOAD = 'NEED_PROFILE_RELOAD';
const IS_LOADING = 'IS_LOADING';

export default new Vuex.Store({
	state: {
		activities: [],
		profile: {
			aircrafts: []
		},
		needActivitiesReload: true,
		needProfileReload: true,
		isLoading: false,
		aircrafts: {}
	},
	getters: {
		getAircraft: (state) => (registration) => {
			let aircrafts = state.profile.aircrafts.filter(aircraft => {
				return aircraft.registration === registration;
			});
			return aircrafts[0];
		},
		getPrice: () => (aircraft, category) => {
			if (category == 'CDB') {
				return aircraft.cdbPrice;
			} else {
				return aircraft.instPrice;
			}
		},
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
		[SET_PROFILE]: (state, profile) => {
			state.profile = profile;
		},
		[NEED_PROFILE_RELOAD]: (state, value) => {
			state.needProfileReload = value;
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
				activity.uid = firebase.auth.currentUser.uid;
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
		},
		async getProfile({commit, state}) {
			if (state.needProfileReload) {
				try {
					commit(IS_LOADING, true);
					let uid = firebase.auth.currentUser.uid;
					let profileDocs = await firebase.profilesCollection.where('uid', '==', uid).get();
					profileDocs.forEach(doc => {
						commit(SET_PROFILE, doc.data());
					})
					commit(NEED_PROFILE_RELOAD, false);
				} catch(error) {
					console.error(error);
				} finally {
					commit(IS_LOADING, false);
				}
			}
		},
		async setProfile({commit}, profile) {
			try {
				commit(IS_LOADING, true);
				let uid = firebase.auth.currentUser.uid;
				profile.uid = uid;
				let profileDoc = firebase.profilesCollection.doc(uid);
				await profileDoc.set(profile, { merge: true});
				commit(SET_PROFILE, profile);
				commit(NEED_PROFILE_RELOAD, true);
			} catch(error) {
				console.error(error);
			} finally {
				commit(IS_LOADING, false);
			}
		},
	},
	modules: {
	}
})
