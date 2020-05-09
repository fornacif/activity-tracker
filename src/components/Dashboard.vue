<template>
	<div>
		<v-row>
			<v-col cols="12" sm="12">
				<v-card >
					<v-banner>
						<v-avatar slot="icon" color="blue-grey darken-3" size="40">
							<v-icon dark>mdi-shield-check</v-icon>
						</v-avatar>
						Flight checks
					</v-banner>
                    <v-card-text>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">MODEL</th>
                              <th class="text-left">SINCE LAST INST FLIGHT</th>
                              <th class="text-left">BEFORE TEST FLIGHT</th>
                              <th class="text-left">SINCE LAST CDB FLIGHT</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in aggregates.daysByModel" :key="item.model">
                              <td><v-chip color="blue-grey darken-1" dark>{{ item.model }}</v-chip></td>
                              <td>
                                <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
                                <v-chip outlined :color="item.daysSinceLastInstFlightColor" v-show="!$store.state.isLoading">
                                 <span class="title">{{ item.daysSinceLastInstFlight }} d</span>
                                </v-chip>
                              </td>
                              <td>
                                <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
                                <v-chip outlined :color="item.daysBeforeTestFlightColor" v-show="!$store.state.isLoading">
                                 <span class="title">{{ item.daysBeforeTestFlight }} d</span>
                                </v-chip>
                              </td>
                              <td>
                                <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
                                <v-chip outlined :color="item.daysSinceLastCdbFlightColor" v-show="!$store.state.isLoading">
                                 <span class="title">{{ item.daysSinceLastCdbFlight }} d</span>
                                </v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                  </v-card-text>                  
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
									<span v-show="!$store.state.isLoading">{{ aggregates.totalCdbDuration | numeral('0,0.00') }} h</span>				
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Total Duration</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalCdbFlights }}</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Total Flights</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalPassengerFlights }}</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">PAX Flights</v-card-subtitle>
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
									<span v-show="!$store.state.isLoading">{{ aggregates.totalInstDuration | numeral('0,0.00') }} h</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Total Duration</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="4">
							<v-card flat>
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalInstFlights }}</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Total Flights</v-card-subtitle>
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
									<span v-show="!$store.state.isLoading">{{ aggregates.totalCdbPrice | numeral('0,0') }} €</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Total Price</v-card-subtitle>
							</v-card>
						</v-col>
						<v-col sm="6">
							<v-card flat>						
								<v-card-title>
									<v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3"/>
									<span v-show="!$store.state.isLoading">{{ aggregates.totalPassengerPrice | numeral('0,0') }} €</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Passenger Price</v-card-subtitle>
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
									<span v-show="!$store.state.isLoading">{{ aggregates.totalInstPrice | numeral('0,0') }} €</span>
								</v-card-title>
								<v-card-subtitle class="subtitle-2">Total Price</v-card-subtitle>
							</v-card>
						</v-col>			
					</v-row>
				</v-card>
			</v-col>
		</v-row>
    
        <v-row>
          <v-col cols="12" sm="12">
            <v-card>
				<v-banner>
					<v-avatar slot="icon" color="blue-grey darken-3" size="40">
						<v-icon dark>mdi-chart-line-variant</v-icon>
					</v-avatar>
					Aggregates
				</v-banner>

				<v-card-subtitle>
					<v-row dense>
						<v-col cols="12" sm="2">
							<v-select :items="aggregates.categories" v-model="categoryFilter" label="Filter by Category" multiple dense outlined></v-select>
						</v-col>
						<v-col cols="12" sm="3">
							<v-select :items="aggregates.registrations" v-model="registrationFilter" label="Filter by Registration" multiple dense outlined></v-select>
						</v-col>
						<v-col cols="12" sm="2">
							<v-select :items="aggregates.models" v-model="modelFilter" label="Filter by Model" multiple dense outlined></v-select>
						</v-col>
						<v-col cols="12" sm="1">
							<v-btn icon @click="resetFilters"><v-icon>mdi-close</v-icon></v-btn>
						</v-col>
					</v-row>

					<v-data-table :items="aggregates.all" :headers="headers" :items-per-page="10" class="elevation-1" :loading="$store.state.isLoading" loading-text="Loading...">
                        <template v-slot:item.year="{ item }">
                          <strong>{{ item.year }}</strong>
                        </template>
						<template v-slot:item.duration="{ item }">
							{{ item.duration | numeral('0,0.00') }} h
						</template>
						<template v-slot:item.price="{ item }">
							{{ item.price | numeral('0,0') }} €
						</template>
						<template v-slot:item.passengerPrice="{ item }">
							{{ item.passengerPrice | numeral('0,0') }} €
						</template>
					</v-data-table>

				</v-card-subtitle>

            </v-card>
          </v-col>
        </v-row>

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
				gradient: ['#f72047', '#ffd200', '#1feaea'],
				categoryFilter: [],
				registrationFilter: [],
				modelFilter: [],
				headers: [
                    { text: 'YEAR', value: 'year'},
                    { text: 'DURATION', value: 'duration'},
                    { text: 'COUNT', value: 'count'},
                    { text: 'PRICE', value: 'price'},
                    { text: 'PASSENGER PRICE', value: 'passengerPrice'},
                ]
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
				
				aggregates.daysByModel = [];
				
				for (const [model, daysBeforeTestFlight] of Object.entries(this.getDaysBeforeTestFlight(instActivities))) {
					let daysByModel = {};
					daysByModel.model = model;
					
					daysByModel.daysBeforeTestFlight = daysBeforeTestFlight;
					daysByModel.daysBeforeTestFlightColor = daysByModel.daysBeforeTestFlight > 30 ? 'green' : 'orange';
					
					daysByModel.daysSinceLastInstFlight = this.getDaysSinceLastFlight(this.filterByModel(instActivities, model));
					daysByModel.daysSinceLastInstFlightColor = daysByModel.daysSinceLastInstFlight < 90 ? 'green' : 'orange';
					
					daysByModel.daysSinceLastCdbFlight = this.getDaysSinceLastFlight(this.filterByModel(cdbActivities, model));
					daysByModel.daysSinceLastCdbFlightColor = daysByModel.daysSinceLastCdbFlight < 30 ? 'green' : 'orange';
					
					aggregates.daysByModel.push(daysByModel);
				}

				aggregates.totalCdbDuration = this.sumByProperty(cdbActivities, 'duration');
				aggregates.totalInstDuration = this.sumByProperty(instActivities, 'duration');
				aggregates.totalCdbFlights = cdbActivities.length;
				aggregates.totalInstFlights = instActivities.length;
				aggregates.totalCdbPrice = this.sumByProperty(cdbActivities, 'price');
				aggregates.totalInstPrice = this.sumByProperty(instActivities, 'price');
				
				aggregates.totalPassengerFlights = this.sumByFilledProperty(cdbActivities, 'passengers');
				aggregates.totalPassengerPrice = this.sumByProperty(cdbActivities, 'passengerPrice');

				aggregates.categories = this.aggregateByProperty(activities, "category");
				aggregates.registrations = this.aggregateByProperty(activities, "registration");
				aggregates.models = this.aggregateByProperty(activities, "model");

				aggregates.all = this.aggreateItemsPerYear(activities);

				return aggregates;
			}
        },
        methods: {
            filterByCategories(activities, categories) {
				return activities.filter((activity) => {
					return categories.includes(activity.category);
                });
            },
            filterByModel(activities, model) {
				return activities.filter((activity) => {
					return activity.model == model;
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
            aggregateByProperty(items, property) {
				return Object.values(items.map((item) => {
					return item[property];
				}));
            },
            aggreateItemsPerYear(activities) {
				let items = new Map();

				activities.forEach(activity => {
					let year = this.$moment(activity.date).format("YYYY");

					let item = {
						year: year,
						count: 1,
						duration: activity.duration,
						price: activity.price,
						passengerPrice: activity.passengerPrice
					};

					if ((this.categoryFilter.length == 0 || this.categoryFilter.includes(activity.category)) && 
						(this.registrationFilter.length == 0 || this.registrationFilter.includes(activity.registration)) &&
						(this.modelFilter.length == 0 || this.modelFilter.includes(activity.model))) {

						if (items.has(year)) {
							items.get(year).duration += item.duration;
							items.get(year).price += item.price;
							items.get(year).passengerPrice += item.passengerPrice;
							items.get(year).count++;
						} else {
							items.set(year, item);
						}
					}

				});

				let result = Array.from(items.values());

				let totalItem = {
						year: "TOTAL",
						count: this.sumByProperty(result, "count"),
						duration: this.sumByProperty(result, "duration"),
						price: this.sumByProperty(result, "price"),
						passengerPrice: this.sumByProperty(result, "passengerPrice")
					};

				result.push(totalItem);

				return result;
            },
			resetFilters() {
				this.categoryFilter = [];
				this.registrationFilter = [];
				this.modelFilter = [];
            },
            getDaysSinceLastFlight(activities) {
				if (activities.length == 0) {
					return 0;
				}

				let now = this.$moment();
				let lastActivityDate = this.$moment(activities[0].date);
				return now.diff(lastActivityDate, 'days');
            },
            getDaysBeforeTestFlight(instActivities) {
				if (instActivities.length == 0) {
					return 0;
				}

				let now = this.$moment();

				let lastExamFlightDateByModel = [];
				let lastTestFlightDateByModel = [];

				instActivities.forEach(activity => {
					if (activity.category === 'EXAM' && !lastExamFlightDateByModel[activity.model]) {
						lastExamFlightDateByModel[activity.model] = activity.date;
					}
					if (activity.category === 'TEST' && !lastTestFlightDateByModel[activity.model]) {
						lastTestFlightDateByModel[activity.model] = activity.date;
					}
				});

				let daysBeforeTestFlightByModel = [];

				for (const [year, value] of Object.entries(lastExamFlightDateByModel)) {
					let lastExamFlightDate = this.$moment(value);
					let lastTestFlightDate = this.$moment(lastTestFlightDateByModel[year]);
					let nextTestFlightDueDate = this.$moment(lastExamFlightDate).year(now.year()).endOf('month');	
					let nextTestFlightStartDate = this.$moment(lastExamFlightDate).year(now.year()).subtract(3, "months");
					
					if (lastExamFlightDate.isAfter(nextTestFlightStartDate) || (lastTestFlightDate && lastTestFlightDate.isAfter(nextTestFlightStartDate))) {
						nextTestFlightDueDate.add(1, "years");
					}
					
					daysBeforeTestFlightByModel[year] = nextTestFlightDueDate.diff(now, 'days');
				}

				return daysBeforeTestFlightByModel;
            }
        }
    }
</script>
