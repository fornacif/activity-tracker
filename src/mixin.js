import Vue from 'vue'

Vue.mixin({
	data() {
		return {
			updateExists: false,
		};
	},
	created() {
		document.addEventListener('serviceWorkerUpdated', this.showRefreshUI, { once: true });
	},
	methods: {
		showRefreshUI() {
			this.updateExists = true;
		},
		refreshUI() {
			window.location.reload();
		},
		durationToTime(duration) {
			let minutes = Math.round(duration * 60);
			return this.$moment().startOf('day').add(minutes, 'minutes').format('HH:mm');
		},
		isNumber(event) {
			let value = event.target.value.slice(0, event.target.selectionStart) + event.key + event.target.value.slice(event.target.selectionStart);
			if (/^\d+(\.)?(\d{1,2})?$/.test(value)) {
				return true;
			} else {
				event.preventDefault();
			}
		},
	}
});

