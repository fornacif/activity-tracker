<template>
	<div>
		<v-row dense>
			<v-col cols="12" sm="6">
				<v-card class="mb-4">
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-counter</v-icon>
						</v-avatar>
						CDB - Global metrics
					</v-banner>
					<v-row dense>
						<v-col sm="4">
							<v-card flat>
								<v-card-subtitle class="subtitle-1">Total Duration</v-card-subtitle>
								<v-card-text class="title">
									<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!isLoading">{{ aggregates.totalCdbDuration | numeral('0,0.00') }}h</span>				
								</v-card-text>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-subtitle class="subtitle-1">Total Flights</v-card-subtitle>
								<v-card-text class="title">
									<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!isLoading">{{ aggregates.totalCdbFlights }}</span>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-subtitle class="subtitle-1">Passenger Flights</v-card-subtitle>
								<v-card-text class="title">
									<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!isLoading">{{ aggregates.totalPassengerFlights }}</span>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6">
				<v-card class="mb-4">
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-counter</v-icon>
						</v-avatar>
						INST - Global metrics
					</v-banner>
					<v-row dense>
						<v-col sm="4">
							<v-card flat>
								<v-card-subtitle class="subtitle-1">Total Duration</v-card-subtitle>
								<v-card-text class="title">
									<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!isLoading">{{ aggregates.totalInstDuration | numeral('0,0.00') }}h</span>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-subtitle class="subtitle-1">Total Flights</v-card-subtitle>
								<v-card-text class="title">
									<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!isLoading">{{ aggregates.totalInstFlights }}</span>
								</v-card-text>
							</v-card>
						</v-col>
						
					</v-row>
				</v-card>
			</v-col>
		</v-row>

		<v-card class="mb-4">
			<v-banner>
				<v-avatar slot="icon" color="blue-grey darken-3" size="40">
					<v-icon dark>mdi-currency-eur</v-icon>
				</v-avatar>
				Global Price metrics
			</v-banner>
			<v-row dense>
				<v-col cols="12" sm="2">
					<v-card flat>
						<v-card-subtitle class="subtitle-1">CDB - Price</v-card-subtitle>
						<v-card-text class="title">
							<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
							<span v-show="!isLoading">{{ aggregates.totalCdbPrice | numeral('0,0') }}€</span>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" sm="2">
					<v-card flat>
						<v-card-subtitle class="subtitle-1">CDB - Passenger Price</v-card-subtitle>
						<v-card-text class="title">
							<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
							<span v-show="!isLoading">{{ aggregates.totalPassengerPrice | numeral('0,0') }}€</span>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" sm="2">
					<v-card flat>
						<v-card-subtitle class="subtitle-1">INST - Price</v-card-subtitle>
						<v-card-text class="title">
							<v-progress-circular v-show="isLoading" indeterminate color="blue darken-3"/>
							<span v-show="!isLoading">{{ aggregates.totalInstPrice | numeral('0,0') }}€</span>
						</v-card-text>
					</v-card>
				</v-col>			
			</v-row>
		</v-card>
		<v-card class="mb-4">
			<v-banner>
				<v-avatar slot="icon" color="blue-grey darken-3" size="40">
					<v-icon dark>mdi-chart-line-variant</v-icon>
				</v-avatar>
				CDB - Aggregated metrics
			</v-banner>
			<v-row dense>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Duration per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.cdb.durationLabelsPerYear"
							:value="aggregates.cdb.durationValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.cdb.durationValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Flights per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.cdb.countLabelsPerYear" 
							:value="aggregates.cdb.countValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.cdb.countValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Price per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.cdb.priceLabelsPerYear" 
							:value="aggregates.cdb.priceValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.cdbPriceValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Passenger price per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.cdb.passengerPriceLabelsPerYear" 
							:value="aggregates.cdb.passengerPriceValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.cdb.passengerPriceValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
			</v-row>
		</v-card>

		<v-card class="mb-4">
			<v-banner>
				<v-avatar slot="icon" color="blue-grey darken-3" size="40">
					<v-icon dark>mdi-chart-line-variant</v-icon>
				</v-avatar>
				INST - Aggregated metrics
			</v-banner>
			<v-row dense>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Duration per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.inst.durationLabelsPerYear" 
							:value="aggregates.inst.durationValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.inst.durationValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Flights count per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.inst.countLabelsPerYear" 
							:value="aggregates.inst.countValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.inst.countValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Price per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.inst.priceLabelsPerYear" 
							:value="aggregates.inst.priceValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.inst.priceValuesPerYear" 
							:auto-draw-duration="drawDuration" 
							:padding="padding" 
							:label-size="labelSize" 
							:gradient="gradient"/>
					</v-card>
				</v-col>
			</v-row>
		</v-card>
	</div>
</template>

<script>

	const firebase = require('../firebaseConfig.js')

    export default {
        data() {
            return {
				aggregates: {
					cdb: {},
					inst: {}
				},
				isLoading: false,
				drawDuration: 1000,
				lineWidth: 2,
				labelSize: 6,
				padding: 25,
				gradient: ['#f72047', '#ffd200', '#1feaea']
            }
        },
        mounted: function () {
			this.isLoading = true;
			this.loadActivities();
        },
        methods: {
			async loadActivities() {
				let activities = [];
				let snapshot = await firebase.activitiesCollection.get();
				snapshot.forEach(doc => {
					activities.push(doc.data());
				});

				let cdbActivities = this.filterByCategory(activities, 'CDB');
				let instActivities = this.filterByCategory(activities, 'INST');

				this.aggregates.totalCdbDuration = this.sumByProperty(cdbActivities, 'duration');
				this.aggregates.totalInstDuration = this.sumByProperty(instActivities, 'duration');
				this.aggregates.totalCdbFlights = cdbActivities.length;
				this.aggregates.totalInstFlights = instActivities.length;
				this.aggregates.totalCdbPrice = this.sumByProperty(cdbActivities, 'price');
				this.aggregates.totalInstPrice = this.sumByProperty(instActivities, 'price');
				
				this.aggregates.totalPassengerFlights = this.sumByFilledProperty(cdbActivities, 'passengers');
				this.aggregates.totalPassengerPrice = this.sumByProperty(cdbActivities, 'passengerPrice');

				this.aggregates.cdb = this.aggreateItemsPerYear(cdbActivities);
				this.aggregates.inst = this.aggreateItemsPerYear(instActivities);

				this.isLoading = false;
			},
            filterByCategory(activities, category) {
				return activities.filter((activity) => {
					return activity.category === category;
                });
            },
            sumByProperty(items, property) {
				return items.reduce((sum, item) => {
					return sum + item[property];
				}, 0);
            },
            sumByFilledProperty(items, property) {
				return items.reduce((sum, item) => {
					return sum + (item[property] ? 1 : 0);
				}, 0);
            },
            aggregatesByProperty(items, property) {
				return Object.values(items.map((item) => {
					return item[property];
				}));
            },
            aggreateItemsPerYear(activities) {
				let items = [];
				activities.forEach(activity => {
					let year = this.$moment(activity.date).format("YYYY");
					let duration, price, passengerPrice, count;

					if (items[year]) {
						duration = items[year].durationValue + activity.duration;
						price = items[year].priceValue + activity.price;
						passengerPrice = items[year].passengerPriceValue + activity.passengerPrice;
						count = items[year].countValue + 1;
					} else {
						duration = activity.duration;
						price = activity.price;
						passengerPrice = activity.passengerPrice;
						count = 1;						
					}

					let durationLabel = Math.round(duration) + "h (" + year + ")";
					let priceLabel = Math.round(price) + "€ (" + year + ")";
					let passengerPriceLabel = Math.round(passengerPrice) + "€ (" + year + ")";
					let countLabel = count + " (" + year + ")";
					items[year] = { 
						durationLabel: durationLabel, 
						durationValue: duration, 
						priceLabel: priceLabel, 
						priceValue: price,
						passengerPriceLabel: passengerPriceLabel, 
						passengerPriceValue: passengerPrice, 
						countLabel: countLabel, 
						countValue: count
					};
				});

				let result = {};

				result.durationLabelsPerYear = this.aggregatesByProperty(items, 'durationLabel');
				result.durationValuesPerYear = this.aggregatesByProperty(items, 'durationValue');

				result.countLabelsPerYear = this.aggregatesByProperty(items, 'countLabel');
				result.countValuesPerYear = this.aggregatesByProperty(items, 'countValue');

				result.priceLabelsPerYear = this.aggregatesByProperty(items, 'priceLabel');
				result.priceValuesPerYear = this.aggregatesByProperty(items, 'priceValue');

				result.passengerPriceLabelsPerYear = this.aggregatesByProperty(items, 'passengerPriceLabel');
				result.passengerPriceValuesPerYear = this.aggregatesByProperty(items, 'passengerPriceValue');
				
				return result;
            }
        }
    }
</script>
