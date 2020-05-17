<template>
  <div>
    <v-card>
        <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                <v-icon dark>mdi-table-large-plus</v-icon>
            </v-avatar>
            Add new Flight
        </v-banner>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row dense>
                    <v-col cols="12" sm="2">
                        <v-select label="Aircraft" v-model="activity.registration" :items="$store.state.profile.aircrafts" item-value="registration" :rules="required" required>
                          <template slot="selection" slot-scope="data">
                            {{ data.item.registration }} | {{ data.item.model }}
                          </template>
                          <template slot="item" slot-scope="data">
                            {{ data.item.registration }} | {{ data.item.model }}
                          </template>
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-select label="Category" v-model="activity.category" :items="categories" :rules="required" required/>
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-text-field label="Instructor" v-model="activity.instructor"/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-autocomplete
                            v-model="activity.fromLocation"
                            :items="fromLocationItems"
                            :loading="isFromLocationItemsLoading"
                            :search-input.sync="fromLocationSearchInput"
                            label="From Location"
                            prepend-icon="mdi-database-search"
                            return-object
                            item-text="name"
                            :filter="noFilter"
                            :rules="required"
                            required/>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-autocomplete
                            v-model="activity.toLocation"
                            :items="toLocationItems"
                            :loading="isToLocationItemsLoading"
                            :search-input.sync="toLocationSearchInput"
                            label="To Location"
                            prepend-icon="mdi-database-search"
                            return-object
                            item-text="name"
                            :filter="noFilter"
                            :rules="required"
                            required/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Date" v-model="activity.date" :rules="required" required type="date"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Duration" v-model.number="activity.duration" v-mask="'#.##'" :rules="required" required/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Start Time" v-model="activity.startTime" :rules="required" required type="time"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="End Time" v-model="endTime" readonly type="time"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Total Time" v-model="totalTime" readonly type="time"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Fuel" v-model="fuel" readonly/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Price" v-model="price" readonly/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Passengers" v-model="activity.passengers"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-switch label="Shared" v-model="activity.shared" inset/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Passenger Price" v-model="passengerPrice" readonly/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col sm="12">
                        <v-btn color="blue darken-3" dark @click="addActivity" :loading="$store.state.isLoading">SUBMIT</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
    import { mask } from 'vue-the-mask'

    export default {
        directives: {
          mask,
        },
        data() {
            return {
                valid: true,
                activity: {
                    shared: false,
                    date: new Date().toISOString().substr(0, 10)
                },
                categories: [
                  { value: 'CDB', text: 'CDB' },
                  { value: 'INST', text: 'INST' },
                  { value: 'TEST', text: 'TEST' },
                  { value: 'EXAM', text: 'EXAM' }
                ],
                required: [
                    v => !!v || 'Input is required'
                ],
                aircraft: {},
                fromLocationItems: [],
                toLocationItems: [],
                fromLocationSearchInput: '',
                toLocationSearchInput: '',
                isFromLocationItemsLoading: false,
                isToLocationItemsLoading: false,
                lastSelectedAutocompleteText: '',
                isLoading: false
            }
        },
        mounted: async function () {
			await this.$store.dispatch('getProfile');
			await this.$store.dispatch('getActivities');
			
			this.initLastLocations(this.fromLocationItems, 'fromLocation');
			this.initLastLocations(this.toLocationItems, 'toLocation');
        },
        computed: {
            price: function() {
                if (this.activity.registration && !isNaN(this.activity.duration)) {
					let aircraft = this.$store.getters.getAircraft(this.activity.registration);
                    let unitPrice = this.$store.getters.getPrice(aircraft, this.activity.category);
                    return Math.round(this.activity.duration * unitPrice * 100) / 100;
                } else {
                    return 0;
                }     
            },
            passengerPrice: function() {
                if (this.activity.shared) {
                    return this.price / 2;
                } else {
                    return 0;
                }
            },
            fuel: function() {
                if (this.activity.registration && !isNaN(this.activity.duration)) {
					let aircraft = this.$store.getters.getAircraft(this.activity.registration);
                    return Math.round(this.activity.duration * aircraft.fuel);  
                } else {
                    return 0;
                } 
            },
            endTime: function() {
                if (isNaN(this.activity.duration) || !this.activity.startTime) {
                    return '';
                } else {
                    let minutes = Math.round(this.activity.duration * 60);
                    return this.$moment(this.activity.startTime, 'HH:mm').add(minutes, 'minutes').format('HH:mm');  
                }
                
            },
            totalTime: function() {
                if (isNaN(this.activity.duration)) {
                    return '';
                } else {
                    return this.durationToTime(this.activity.duration);
                }
            }
        },
        watch: {
			"activity.registration": function(value) {
				if (value) {
                  this.activity.model = this.$store.getters.getAircraft(value).model;					
				}
            },
            price: function(value) {
                this.activity.price = value;
            },
            passengerPrice: function(value) {
                this.activity.passengerPrice = value;
            },
            fuel: function(value) {
                this.activity.fuel = value;
            },
            endTime: function(value) {
                this.activity.endTime = value;
            },
            totalTime: function(value) {
                this.activity.totalTime = value;
            },
            fromLocationSearchInput: function(value) {
                if (value && value != this.lastSelectedAutocompleteText) {
                    this.manageAutocomplete(value, this.fromLocationItems, 'FROM_LOCATION'); 
                }
            },
            toLocationSearchInput: function(value) {
                if (value && value != this.lastSelectedAutocompleteText) {
                    this.manageAutocomplete(value, this.toLocationItems, 'TO_LOCATION');
                }
            }
        },
        methods: {
            clearArray (array) {
                while (array.length > 0) {
                    array.splice(0, 1);
                }
            },
            noFilter () {
                return true;
            },
            initLastLocations(items, property) {
                let locations = new Map();

                this.$store.state.activities.forEach(activity => {
                    locations.set(activity[property].name, activity[property]);
                });

                items.push.apply(items, Array.from(locations.values()).slice(0, 3));
            },
            async addActivity() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch('addActivity', this.activity);
                    this.resetForm();
                }
            },
            async manageAutocomplete(searchInput, items, autocompleteField) {
                if (autocompleteField === 'FROM_LOCATION' && this.activity.fromLocation && this.fromLocationSearchInput === this.activity.fromLocation.name) {
                    return;
                } else if (autocompleteField === 'TO_LOCATION' && this.activity.toLocation && this.toLocationSearchInput === this.activity.toLocation.name) {
                    return;
                } else {
					this.clearArray(items);
				}
                
                if (searchInput.length > 3) {
                    if (autocompleteField === 'FROM_LOCATION') {
                        this.isFromLocationItemsLoading = true;
                    } else {
                        this.isToLocationItemsLoading = true;
                    }

                    try {
                        if (searchInput.length == 4) {
                            let headers = new Headers();
                            headers.append('X-API-Key', process.env.VUE_APP_CHECKWS_API_KEY);
                            let params = { headers: headers};
                            let request = new Request('https://api.checkwx.com/station/' + searchInput, params);
                            
                            let result = await fetch(request);
                            result = await result.json();

                            if (result.results == 1) {
                                let location = {
                                    code: result.data[0].icao, 
                                    name: result.data[0].icao + ' - ' + result.data[0].name, 
                                    coordinates: {
                                        latitude: result.data[0].location.coordinates[1],
                                        longitude: result.data[0].location.coordinates[0]
                                    }
                                    
                                };
                                this.lastSelectedAutocompleteText = location.name;
                                items.push(location);
                            }
                        }
                        
                        if (items.length == 0) {
                            let url = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?language=fr&inputtype=textquery&fields=name,geometry&key=' + process.env.VUE_APP_GOOGLE_API_KEY + '&input=' + searchInput;
                            let result = await fetch(url);
                            result = await result.json();

                            result.candidates.forEach((candidate) => {
                                let location = {
                                    code: 'ZZZZ', 
                                    name: candidate.name, 
                                    coordinates: {
                                        latitude: candidate.geometry.location.lat,
                                        longitude: candidate.geometry.location.lng 
                                    }
                                };
                                this.lastSelectedAutocompleteText = location.name;
                                items.push(location);
                            });
                        }
                       
                    } catch(error) {
                        console.error(error);
                    }

                    if (autocompleteField === 'FROM_LOCATION') {
                        this.isFromLocationItemsLoading = false;
                    } else {
                        this.isToLocationItemsLoading = false;
                    }
                }
            },
            resetForm() {
                this.$refs.form.resetValidation();
                this.activity.shared = false;
                this.activity.registration = '';
                this.activity.category = '';
                this.activity.instructor = '';
                this.activity.duration = '';
                this.activity.passengers = '';
                this.activity.fromLocation = '';
                this.activity.toLocation = '';
                this.activity.startTime = '';
                this.activity.date = new Date().toISOString().substr(0, 10);
            }
        }
    }
</script>
