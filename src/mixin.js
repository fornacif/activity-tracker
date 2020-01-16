import Vue from 'vue'

Vue.mixin({
	methods: {
		durationToTime(duration) {
			let minutes = Math.round(duration * 60);
			return this.$moment().startOf('day').add(minutes, 'minutes').format('HH:mm');
		}
	}
});

