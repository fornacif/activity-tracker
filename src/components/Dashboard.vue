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
                  <v-row dense align="end">
                     <v-col sm="1">
                        <span class="subtitle-2">Type</span>
                     </v-col>
                     <v-col sm="3">
                        <span class="subtitle-2">Since Last DUAL Flight</span>
                     </v-col>
                     <v-col sm="3">
                        <span class="subtitle-2">Before TEST Flight</span>
                     </v-col>
                     <v-col sm="3">
                        <span class="subtitle-2">Since Last PIC Flight</span>
                     </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row dense v-show="$store.state.isLoading">
                     <v-col sm="1">
                        <v-progress-circular indeterminate width="1"/>
                     </v-col>
                     <v-col sm="3">
                        <v-progress-circular indeterminate width="1"/>
                     </v-col>
                     <v-col sm="3">
                        <v-progress-circular indeterminate width="1"/>
                     </v-col>
                     <v-col sm="3">
                        <v-progress-circular indeterminate width="1"/>
                     </v-col>
                  </v-row>
                  <v-row dense v-for="item in aggregates.daysByType" :key="item.type" class="mt-1">
                     <v-col sm="1">
                        <v-chip dark label color="blue-grey darken-1">
                           <span class="subtitle-2">{{ item.type }}</span>
                        </v-chip>
                     </v-col>
                     <v-col sm="3">
                        <v-chip label outlined :color="item.daysSinceLastDualFlightColor">
                           <span class="subtitle-1 font-weight-bold">{{ item.daysSinceLastDualFlight }} d</span>
                        </v-chip>
                     </v-col>
                     <v-col sm="3">
                        <v-chip label outlined :color="item.daysBeforeTestFlightColor">
                           <span class="subtitle-1 font-weight-bold">{{ item.daysBeforeTestFlight }} d</span>
                        </v-chip>
                     </v-col>
                     <v-col sm="3">
                        <v-chip label outlined :color="item.daysSinceLastPicFlightColor">
                           <span class="subtitle-1 font-weight-bold">{{ item.daysSinceLastPicFlight }} d</span>
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
                  PIC - Global Metrics
               </v-banner>
               <v-row dense>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalPicDuration | numeral('0,0.00') }} h</span>                
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total Duration</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalPicFlights }}</span>
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
                  DUAL - Global Metrics
               </v-banner>
               <v-row dense>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalDualDuration | numeral('0,0.00') }} h</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total Duration</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalDualFlights }}</span>
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
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalPicPrice | numeral('0,0') }} €</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total PIC</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalDualPrice | numeral('0,0') }} €</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">Total DUAL</v-card-subtitle>
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
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
                           <span v-show="!$store.state.isLoading">{{ aggregates.totalPassengersFlights }}</span>
                        </v-card-title>
                        <v-card-subtitle class="subtitle-2">PAX Flights</v-card-subtitle>
                     </v-card>
                  </v-col>
                  <v-col sm="6">
                     <v-card flat>
                        <v-card-title>
                           <v-progress-circular v-show="$store.state.isLoading" indeterminate width="1"/>
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
                        <v-select :items="aggregates.types" v-model="typeFilter" label="Filter by Type" multiple dense outlined></v-select>
                     </v-col>
                     <v-col cols="12" sm="2" class="my-n2">
                        <v-select :items="aggregates.pics" v-model="picFilter" label="Filter by PIC" multiple dense outlined></v-select>
                     </v-col>
                     <v-col cols="12" sm="1" class="mt-n2">
                        <v-btn depressed @click="resetFilters">RESET</v-btn>
                     </v-col>
                  </v-row>
                  <v-data-table :items="aggregates.all" :headers="headers" :items-per-page="10" class="elevation-1" :loading="$store.state.isLoading" loading-text="Loading..." :mobile-breakpoint="$store.state.mobileBreakpoint">
                     <template v-slot:item.year="{ item }">
                        <span class="text-no-wrap"><strong>{{ item.year }}</strong></span>
                     </template>
                     <template v-slot:item.duration="{ item }">
                        <span class="text-no-wrap">{{ item.duration | numeral('0,0.00') }}</span>
                     </template>
                     <template v-slot:item.price="{ item }">
                        <span class="text-no-wrap">{{ item.price | numeral('0,0') }}</span>
                     </template>
                     <template v-slot:item.passengerPrice="{ item }">
                        <span class="text-no-wrap">{{ item.passengerPrice | numeral('0,0') }} €</span>
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
				picFilter: [],
				typeFilter: [],
				headers: [
                    { text: 'YEAR', value: 'year'},
                    { text: 'DURATION (h)', value: 'duration'},
                    { text: 'COUNT', value: 'count'},
                    { text: 'PRICE (€)', value: 'price'},
                    { text: 'PASSENGERS PRICE (€)', value: 'passengersPrice'},
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

				let picActivities = this.filterByCategories(activities, ['PIC']);
				let dualActivities = this.filterByCategories(activities, ['P/UT', 'TEST', 'EXAM']);
				
				aggregates.daysByType = [];
				
				console.info();
				
				for (const [type, daysBeforeTestFlight] of Object.entries(this.getDaysBeforeTestFlight(dualActivities))) {
					let daysByType = {};
					daysByType.type = type;
					
					daysByType.daysBeforeTestFlight = daysBeforeTestFlight;
					daysByType.daysBeforeTestFlightColor = daysByType.daysBeforeTestFlight > 30 ? 'green' : 'orange';
					
					daysByType.daysSinceLastDualFlight = this.getDaysSinceLastFlight(this.filterByType(dualActivities, type));
					daysByType.daysSinceLastDualFlightColor = daysByType.daysSinceLastDualFlight < 90 ? 'green' : 'orange';
					
					daysByType.daysSinceLastPicFlight = this.getDaysSinceLastFlight(this.filterByType(picActivities, type));
					daysByType.daysSinceLastPicFlightColor = daysByType.daysSinceLastPicFlight < 30 ? 'green' : 'orange';
					
					aggregates.daysByType.push(daysByType);
				}

				aggregates.totalPicDuration = this.sumByProperty(picActivities, 'duration');
				aggregates.totalDualDuration = this.sumByProperty(dualActivities, 'duration');
				aggregates.totalPicFlights = picActivities.length;
				aggregates.totalDualFlights = dualActivities.length;
				aggregates.totalPicPrice = this.sumByProperty(picActivities, 'price');
				aggregates.totalDualPrice = this.sumByProperty(dualActivities, 'price');
				
				aggregates.totalPassengersFlights = this.sumByFilledProperty(activities, 'passengers');
				aggregates.totalPassengersPrice = this.sumByPassengerPrice(activities);

				aggregates.categories = this.aggregateByProperty(activities, "category");
				aggregates.registrations = this.aggregateByProperty(activities, "registration");
				aggregates.pics = this.aggregateByProperty(activities, "pic");
				aggregates.types = this.aggregateByProperty(activities, "type");

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
            filterByType(activities, type) {
				return activities.filter((activity) => {
					return activity.type == type;
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
						(this.typeFilter.length == 0 || this.typeFilter.includes(activity.type)) &&
                        (this.picFilter.length == 0 || this.picFilter.includes(activity.pic))) {

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
				this.typeFilter = [];
				this.picFilter = [];
            },
            getDaysSinceLastFlight(activities) {
				if (activities.length == 0) {
					return 0;
				}

				let now = this.$moment();
				let lastActivityDate = this.$moment(activities[0].date);
				return now.diff(lastActivityDate, 'days');
            },
            getDaysBeforeTestFlight(dualActivities) {
				if (dualActivities.length == 0) {
					return 0;
				}

				let now = this.$moment();

				let lastExamFlightDateByType = [];
				let lastTestFlightDateByType = [];

				dualActivities.forEach(activity => {
					if (activity.category === 'EXAM' && !lastExamFlightDateByType[activity.type]) {
						lastExamFlightDateByType[activity.type] = activity.date;
					}
					if (activity.category === 'TEST' && !lastTestFlightDateByType[activity.type]) {
						lastTestFlightDateByType[activity.type] = activity.date;
					}
				});

				let daysBeforeTestFlightByType = [];

				for (const [year, value] of Object.entries(lastExamFlightDateByType)) {
					let lastExamFlightDate = this.$moment(value);
					let lastTestFlightDate = this.$moment(lastTestFlightDateByType[year]);
					let nextTestFlightDueDate = this.$moment(lastExamFlightDate).year(now.year()).endOf('month');	
					let nextTestFlightStartDate = this.$moment(lastExamFlightDate).year(now.year()).subtract(3, "months");
					
					if (lastExamFlightDate.isAfter(nextTestFlightStartDate) || (lastTestFlightDate && lastTestFlightDate.isAfter(nextTestFlightStartDate))) {
						nextTestFlightDueDate.add(1, "years");
					}
					
					daysBeforeTestFlightByType[year] = nextTestFlightDueDate.diff(now, 'days');
				}

				return daysBeforeTestFlightByType;
            }
        }
    }
</script>
