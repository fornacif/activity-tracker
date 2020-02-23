<template>
	<div>
		<v-row>
			<v-col cols="12" sm="12">
				<v-card>
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-shield-check</v-icon>
						</v-avatar>
						Flight checks
					</v-banner>
					<v-row dense>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<v-chip outlined :color="aggregates.daysSinceLastInstFlightColor" v-show="!$store.state.isLoading" >	
										<span class="title">{{ aggregates.daysSinceLastInstFlight }}</span>
									</v-chip>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Days since last INST flight</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<v-chip outlined :color="aggregates.daysBeforeRevalidationFlightColor" v-show="!$store.state.isLoading" >	
										<span class="title">{{ aggregates.daysBeforeRevalidationFlight }}</span>
									</v-chip>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Days before revalidation flight</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<v-chip outlined :color="aggregates.daysSinceLastCdbFlightColor" v-show="!$store.state.isLoading" >	
										<span class="title">{{ aggregates.daysSinceLastCdbFlight }}</span>
									</v-chip>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Days since last CDB flight</v-card-subtitle>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6">
				<v-card>
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-counter</v-icon>
						</v-avatar>
						CDB - Global metrics
					</v-banner>
					<v-row dense>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalCdbDuration | numeral('0,0.00') }}h</span>				
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Total Duration</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalCdbFlights }}</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Total Flights</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalPassengerFlights }}</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Passenger Flights</v-card-subtitle>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6">
				<v-card>
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-counter</v-icon>
						</v-avatar>
						INST - Global metrics
					</v-banner>
					<v-row dense>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalInstDuration | numeral('0,0.00') }}h</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Total Duration</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalInstFlights }}</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Total Flights</v-card-subtitle>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" sm="6">
				<v-card>
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-currency-eur</v-icon>
						</v-avatar>
						CDB - Price metrics
					</v-banner>
					<v-row dense>
						<v-col sm="6">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalCdbPrice | numeral('0,0') }}€</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Total Price</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="6">
							<v-card flat>						
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalPassengerPrice | numeral('0,0') }}€</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Passenger Price</v-card-subtitle>
							</v-card>
						</v-col>			
					</v-row>
				</v-card>
			</v-col>
			<v-col cols="12" sm="6">
				<v-card>
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-currency-eur</v-icon>
						</v-avatar>
						INST - Price metrics
					</v-banner>
					<v-row dense>
						<v-col sm="6">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalInstPrice | numeral('0,0') }}€</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-1">Total Price</v-card-subtitle>
							</v-card>
						</v-col>			
					</v-row>
				</v-card>
			</v-col>
		</v-row>

		<v-card class="mb-4">
			<v-banner>
				<v-avatar slot="icon" color="blue-grey darken-3" size="40">
					<v-icon dark>mdi-chart-line-variant</v-icon>
				</v-avatar>
				CDB - Aggregated metrics
			</v-banner>
			<v-row>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Duration per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.cdb.durationLabelsPerYear"
							:value="aggregates.cdb.durationValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.cdb.durationValuesPerYear.length" 
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
							:auto-draw="!!aggregates.cdb.countValuesPerYear.length" 
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
							:auto-draw="!!aggregates.cdb.priceValuesPerYear.length" 
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
							:auto-draw="!!aggregates.cdb.passengerPriceValuesPerYear.length" 
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
			<v-row>
				<v-col cols="12" sm="6">
					<v-card outlined>
						<v-card-subtitle class="subtitle-1">Duration per year</v-card-subtitle>
						<v-sparkline :labels="aggregates.inst.durationLabelsPerYear" 
							:value="aggregates.inst.durationValuesPerYear" 
							:line-width="lineWidth" 
							:auto-draw="!!aggregates.inst.durationValuesPerYear.length" 
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
							:auto-draw="!!aggregates.inst.countValuesPerYear.length" 
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
							:auto-draw="!!aggregates.inst.priceValuesPerYear.length" 
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

    export default {
        data() {
            return {
				drawDuration: 1000,
				lineWidth: 2,
				labelSize: 6,
				padding: 25,
				gradient: ['#f72047', '#ffd200', '#1feaea']
            }
        },
        mounted: function () {
			this.$store.dispatch('getActivities');
        },
        computed: {
			aggregates: function() {
				let aggregates = {};
				let activities = this.$store.state.activities;

				let cdbActivities = this.filterByCategories(activities, ['CDB']);
				let instActivities = this.filterByCategories(activities, ['INST', 'TEST', 'EXAM']);

				aggregates.daysSinceLastInstFlight = this.getDaysSinceLastInstFlight(instActivities);
				aggregates.daysSinceLastInstFlightColor = aggregates.daysSinceLastInstFlight < 90 ? 'green' : 'orange';

				aggregates.daysSinceLastCdbFlight = this.getDaysSinceLastInstFlight(cdbActivities);
				aggregates.daysSinceLastCdbFlightColor = aggregates.daysSinceLastCdbFlight < 30 ? 'green' : 'orange';

				aggregates.daysBeforeRevalidationFlight = this.getDaysBeforeRevalidationFlight(instActivities)['R22'];
				aggregates.daysBeforeRevalidationFlightColor = aggregates.daysBeforeRevalidationFlight > 30 ? 'green' : 'orange';

				aggregates.totalCdbDuration = this.sumByProperty(cdbActivities, 'duration');
				aggregates.totalInstDuration = this.sumByProperty(instActivities, 'duration');
				aggregates.totalCdbFlights = cdbActivities.length;
				aggregates.totalInstFlights = instActivities.length;
				aggregates.totalCdbPrice = this.sumByProperty(cdbActivities, 'price');
				aggregates.totalInstPrice = this.sumByProperty(instActivities, 'price');
				
				aggregates.totalPassengerFlights = this.sumByFilledProperty(cdbActivities, 'passengers');
				aggregates.totalPassengerPrice = this.sumByProperty(cdbActivities, 'passengerPrice');

				aggregates.cdb = this.aggreateItemsPerYear(cdbActivities);
				aggregates.inst = this.aggreateItemsPerYear(instActivities);

				return aggregates;
			}
        },
        methods: {
            filterByCategories(activities, categories) {
				return activities.filter((activity) => {
					return categories.includes(activity.category);
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
            }, 
            getDaysSinceLastInstFlight(instActivities) {
				if (instActivities.length == 0) {
					return 0;
				}

				let now = this.$moment();
				let lastInstActivityDate = this.$moment(instActivities[0].date);
				return now.diff(lastInstActivityDate, 'days');
            },
            getDaysBeforeRevalidationFlight(instActivities) {
				if (instActivities.length == 0) {
					return 0;
				}

				let now = this.$moment();

				let lastRevalidationFlightDateByModel = [];
				let examFlightDateByModel = [];

				instActivities.forEach(activity => {
					if (activity.category === 'TEST' && !lastRevalidationFlightDateByModel[activity.model]) {
						lastRevalidationFlightDateByModel[activity.model] = activity.date;
					}
					if (activity.category === 'EXAM' && !examFlightDateByModel[activity.model]) {
						examFlightDateByModel[activity.model] = activity.date;
					}
				});

				let daysBeforeRevalidationFlightByModel = [];

				for (const [key, value] of Object.entries(examFlightDateByModel)) {
					let nextRevalidationFlightDueDate = this.$moment(value).year(now.year());
					
					if (nextRevalidationFlightDueDate.isBefore(now)) {
						nextRevalidationFlightDueDate.year(now.year() + 1);
					}
					
					if (nextRevalidationFlightDueDate.diff(lastRevalidationFlightDateByModel[key], 'days') < 90) {
						nextRevalidationFlightDueDate.year(nextRevalidationFlightDueDate.year() + 1);
						daysBeforeRevalidationFlightByModel[key] = nextRevalidationFlightDueDate.diff(now, 'days')
					}

					daysBeforeRevalidationFlightByModel[key] = nextRevalidationFlightDueDate.diff(now, 'days')
				}

				return daysBeforeRevalidationFlightByModel;
            }
        }
    }
</script>
