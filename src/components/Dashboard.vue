<template>
   <div>
      <v-row dense>
         <v-col cols="12" class="pt-0">
            <v-card outlined>
               <v-banner>
                  <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                     <v-icon dark>mdi-shield-check</v-icon>
                  </v-avatar>
                  Flight Checks
               </v-banner>
               <v-card-text>
                  <v-row dense>
                     <v-col sm="1">
                        <span>MODEL</span>
                     </v-col>
                     <v-col sm="3">
                        <span>SINCE LAST INST FLIGHT</span>
                     </v-col>
                     <v-col sm="3">
                        <span>BEFORE TEST FLIGHT</span>
                     </v-col>
                     <v-col sm="3">
                        <span>SINCE LAST CDB FLIGHT</span>
                     </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row dense v-for="item in aggregates.daysByModel" :key="item.model">
                     <v-col sm="1">
                        <v-chip dark label color="blue-grey darken-1">
                           <span class="subtitle-2">{{ item.model }}</span>
                        </v-chip>
                     </v-col>
                     <v-col sm="3">
                        <v-chip label outlined :color="item.daysSinceLastInstFlightColor">
                           <span class="subtitle-1 font-weight-bold">{{ item.daysSinceLastInstFlight }} d</span>
                        </v-chip>
                     </v-col>
                     <v-col sm="3">
                        <v-chip label outlined :color="item.daysBeforeTestFlightColor">
                           <span class="subtitle-1 font-weight-bold">{{ item.daysBeforeTestFlight }} d</span>
                        </v-chip>
                     </v-col>
                     <v-col sm="3">
                        <v-chip label outlined :color="item.daysSinceLastCdbFlightColor">
                           <span class="subtitle-1 font-weight-bold">{{ item.daysSinceLastCdbFlight }} d</span>
                        </v-chip>
                     </v-col>
                  </v-row>
               </v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12" sm="6">
            <v-card outlined>
               <v-banner>
                  <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                     <v-icon dark>mdi-counter</v-icon>
                  </v-avatar>
                  CDB - Global Metrics
               </v-banner>
               <v-row dense>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalCdbDuration | numeral('0,0.00') }} h</span>                
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total Duration</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalCdbFlights }}</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total Flights</v-card-subtitle>
                     </v-card>
                  </v-col>
               </v-row>
            </v-card>
         </v-col>
         <v-col cols="12" sm="6">
            <v-card outlined>
               <v-banner>
                  <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                     <v-icon dark>mdi-counter</v-icon>
                  </v-avatar>
                  INST - Global Metrics
               </v-banner>
               <v-row dense>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalInstDuration | numeral('0,0.00') }} h</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total Duration</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalInstFlights }}</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total Flights</v-card-subtitle>
                     </v-card>
                  </v-col>
               </v-row>
            </v-card>
         </v-col>
      </v-row>
      <v-row dense>
         <v-col cols="12" sm="6">
            <v-card outlined>
               <v-banner>
                  <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                     <v-icon dark>mdi-currency-eur</v-icon>
                  </v-avatar>
                  Price Metrics
               </v-banner>
               <v-row dense>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalCdbPrice | numeral('0,0') }} €</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total CDB</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalInstPrice | numeral('0,0') }} €</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total INST</v-card-subtitle>
                     </v-card>
                  </v-col>
               </v-row>
            </v-card>
         </v-col>
         <v-col cols="12" sm="6">
            <v-card outlined>
               <v-banner>
                  <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                     <v-icon dark>mdi-currency-eur</v-icon>
                  </v-avatar>
                  Passengers Metrics
               </v-banner>
               <v-row dense>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalPassengersFlights }}</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">PAX Flights</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate color="blue darken-3" width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalPassengersPrice | numeral('0,0') }} €</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Passengers Price</v-card-subtitle>
                     </v-card>
                  </v-col>
               </v-row>
            </v-card>
         </v-col>
      </v-row>
      <v-row dense>
         <v-col cols="12" sm="12">
            <v-card outlined>
               <v-banner>
                  <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                     <v-icon dark>mdi-chart-line-variant</v-icon>
                  </v-avatar>
                  Aggregates
               </v-banner>
               <v-card-subtitle>
                  <v-row dense>
                     <v-col cols="12" sm="2" class="my-n2">
                        <v-select :items="aggregates.categories" v-model="categoryFilter" label="Filter by Category" multiple dense outlined></v-select>
                     </v-col>
                     <v-col cols="12" sm="2" class="my-n2">
                        <v-select :items="aggregates.registrations" v-model="registrationFilter" label="Filter by Registration" multiple dense outlined></v-select>
                     </v-col>
                     <v-col cols="12" sm="2" class="my-n2">
                        <v-select :items="aggregates.models" v-model="modelFilter" label="Filter by Model" multiple dense outlined></v-select>
                     </v-col>
                     <v-col cols="12" sm="2" class="my-n2">
                        <v-select :items="aggregates.captains" v-model="captainFilter" label="Filter by Captain" multiple dense outlined></v-select>
                     </v-col>
                     <v-col cols="12" sm="1" class="mt-n2">
                        <v-btn depressed @click="resetFilters">RESET</v-btn>
                     </v-col>
                  </v-row>
                  <v-data-table :items="aggregates.all" :headers="headers" :items-per-page="10" class="elevation-1" :loading="$store.state.isLoading" loading-text="Loading..." :mobile-breakpoint="$store.state.mobileBreakpoint">
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
				categoryFilter: [],
				registrationFilter: [],
				captainFilter: [],
				modelFilter: [],
				headers: [
                    { text: 'YEAR', value: 'year'},
                    { text: 'DURATION', value: 'duration'},
                    { text: 'COUNT', value: 'count'},
                    { text: 'PRICE', value: 'price'},
                    { text: 'PASSENGERS PRICE', value: 'passengersPrice'},
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
				
				console.info();
				
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
				
				aggregates.totalPassengersFlights = this.sumByFilledProperty(activities, 'passengers');
				aggregates.totalPassengersPrice = this.sumByPassengerPrice(activities);

				aggregates.categories = this.aggregateByProperty(activities, "category");
				aggregates.registrations = this.aggregateByProperty(activities, "registration");
				aggregates.models = this.aggregateByProperty(activities, "model");
				aggregates.captains = this.aggregateByProperty(activities, "captain");

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
            sumByPassengerPrice(items) {
                return items.reduce((sum, item) => {
                    return sum + (item.passengerPrice * (item.passengers ? item.passengers.split(",").length : 1));                
                }, 0);
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
						passengersPrice: activity.passengerPrice * (activity.passengers ? activity.passengers.split(",").length : 1)
					};

					if ((this.categoryFilter.length == 0 || this.categoryFilter.includes(activity.category)) && 
						(this.registrationFilter.length == 0 || this.registrationFilter.includes(activity.registration)) &&
						(this.modelFilter.length == 0 || this.modelFilter.includes(activity.model)) &&
                        (this.captainFilter.length == 0 || this.captainFilter.includes(activity.captain))) {

						if (items.has(year)) {
							items.get(year).duration += item.duration;
							items.get(year).price += item.price;
							items.get(year).passengersPrice += item.passengersPrice * (item.passengers ? item.passengers.split(",").length : 1);
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
						passengersPrice: this.sumByProperty(result, "passengersPrice")
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
