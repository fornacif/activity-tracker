import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const firebase = require('./firebaseConfig.js')

const ADD_ACTIVITY = 'ADD_ACTIVITY';
const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
const SET_PROFILE = 'SET_PROFILE';
const NEED_PROFILE_RELOAD = 'NEED_PROFILE_RELOAD';
const IS_LOADING = 'IS_LOADING';

export default new Vuex.Store({
	state: {
		activities: [],
		profile: {},
		needActivitiesReload: true,
		needProfileReload: true,
		isLoading: false,
		mobileBreakpoint: 350
	},
	getters: {
		getAircraft: (state) => (registration) => {
			let aircrafts = state.profile.aircrafts.filter(aircraft => {
				return aircraft.registration === registration;
			});
			return aircrafts[0];
		},
		getPrice: () => (aircraft, category) => {
			if (category == 'PIC') {
				return aircraft.picPrice;
			} else {
				return aircraft.dualPrice;
			}
		},
	},
	mutations: {
		[ADD_ACTIVITY]: (state, activity) => {
			state.activities.unshift(activity);
		},
		[DELETE_ACTIVITY]: (state, activity) => {
			state.activities.splice(state.activities.indexOf(activity), 1);
		},
		[SET_PROFILE]: (state, profile) => {
			if (profile.aircrafts === undefined) {
				profile.aircrafts = [];
			} else {
				profile.aircrafts = profile.aircrafts.sort(
                    function(a, b) {
                        return a.registration.localeCompare(b.registration);
					}
				);
			}
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
					let uid = firebase.auth.currentUser.uid;
					let snapshot = await firebase.activitiesCollection.where('uid', '==', uid).orderBy('date').orderBy('startTime').get();
					snapshot.forEach(doc => {
						let activity = doc.data();
						activity.id = doc.id;

						commit(ADD_ACTIVITY, activity);
					});
					state.needActivitiesReload = false;
				} catch(error) {
					console.error(error);
				} finally {
					commit(IS_LOADING, false);
				}
			}
		},
		addActivity({commit}, activity) {
			return new Promise((resolve, reject) => {
				commit(IS_LOADING, true);
				activity.uid = firebase.auth.currentUser.uid;
				firebase.activitiesCollection.add(activity).then(response => {
					activity.id = response.id;
					commit(ADD_ACTIVITY, activity);
					commit(IS_LOADING, false);
					resolve();
				}, error => {
					console.error(error);
					reject();
					commit(IS_LOADING, false);
				});
			});
        },
		updateActivity({commit}, activity) {
            try {
				let activityReference = firebase.activitiesCollection.doc(activity.id);				
				activityReference.update(activity);
            } catch(error) {
                console.error(error);
            } finally {
				commit(IS_LOADING, false);
            }
		},
		async deleteActivity({commit}, activity) {
            try {
                commit(IS_LOADING, true);
                await firebase.activitiesCollection.doc(activity.id).delete();
                commit(DELETE_ACTIVITY, activity);
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
		}
	},
	modules: {
	}
})
