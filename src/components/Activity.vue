<template>
  <div>
    <v-card>
        <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                <v-icon dark>mdi-table-large-plus</v-icon>
            </v-avatar>
            Add new flight
        </v-banner>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row dense>
                    <v-col cols="12" sm="2">
                        <v-select label="Registration" v-model="activityForm.registration" :items="$store.state.profile.aircrafts" item-text="registration" :rules="required" required/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Model" v-model="model" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-select label="Category" v-model="activityForm.category" :items="categories" :rules="required" required/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-autocomplete
                            v-model="activityForm.fromLocation"
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
                            v-model="activityForm.toLocation"
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
                        <v-text-field label="Date" v-model="activityForm.date" :rules="required" required type="date"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Duration" v-model.number="activityForm.duration" v-mask="'#.##'" :rules="required" required/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Start Time" v-model="activityForm.startTime" :rules="required" required type="time"/>
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
                        <v-text-field label="Passengers" v-model="activityForm.passengers"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-switch label="Shared" v-model="activityForm.shared" inset/>
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
                activityForm: {
                    category: 'CDB',
                    shared: false,
                    passengerPrice: 0,
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
        mounted: function () {
			this.$store.dispatch('getProfile');
        },
        computed: {
			model: function() {
				if (this.activityForm.registration) {
					return this.$store.getters.getAircraft(this.activityForm.registration).model;
				} else {
					return '';					
				}
				
			},
            price: function() {
                if (this.activityForm.registration && !isNaN(this.activityForm.duration)) {
					let aircraft = this.$store.getters.getAircraft(this.activityForm.registration);
                    let unitPrice = this.$store.getters.getPrice(aircraft, this.activityForm.category);
                    return Math.round(this.activityForm.duration * unitPrice * 100) / 100;
                } else {
                    return 0
                }     
            },
            passengerPrice: function() {
                if (this.activityForm.shared) {
                    return this.price / 2;
                } else {
                    return 0;
                }
            },
            fuel: function() {
                if (this.activityForm.registration && !isNaN(this.activityForm.duration)) {
					let aircraft = this.$store.getters.getAircraft(this.activityForm.registration);
                    return Math.round(this.activityForm.duration * aircraft.fuel);  
                } else {
                    return 0;
                } 
            },
            endTime: function() {
                if (isNaN(this.activityForm.duration) || !this.activityForm.startTime) {
                    return '';
                } else {
                    let minutes = Math.round(this.activityForm.duration * 60);
                    return this.$moment(this.activityForm.startTime, 'HH:mm').add(minutes, 'minutes').format('HH:mm');  
                }
                
            },
            totalTime: function() {
                if (isNaN(this.activityForm.duration)) {
                    return '';
                } else {
                    return this.durationToTime(this.activityForm.duration);
                }
            }
        },
        watch: {
			model: function(value) {
                this.activityForm.model = value;
            },
            price: function(value) {
                this.activityForm.price = value;
            },
            passengerPrice: function(value) {
                this.activityForm.passengerPrice = value;
            },
            fuel: function(value) {
                this.activityForm.fuel = value;
            },
            endTime: function(value) {
                this.activityForm.endTime = value;
            },
            totalTime: function(value) {
                this.activityForm.totalTime = value;
            },
            fromLocationSearchInput: function(value) {
                if (value && value != this.lastSelectedAutocompleteText) {
                    this.manageAutocomplete(value, this.fromLocationItems, 'fromLocation'); 
                }
            },
            toLocationSearchInput: function(value) {
                if (value && value != this.lastSelectedAutocompleteText) {
                    this.manageAutocomplete(value, this.toLocationItems, 'toLocation');
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
            async addActivity() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch('addActivity', this.activityForm);
                    this.resetFrorm();
                }
            },
            async manageAutocomplete(searchInput, items, autocompleteField) {
                this.clearArray(items);
                
                if (searchInput.length > 3) {

                    if (autocompleteField === 'fromLocation') {
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

                    if (autocompleteField === 'fromLocation') {
                        this.isFromLocationItemsLoading = false;
                    } else {
                        this.isToLocationItemsLoading = false;
                    }
                }
            },
            resetFrorm() {
                this.$refs.form.resetValidation();
                this.activityForm.category = 'CDB';
                delete this.activityForm.fromLocation;
                delete this.activityForm.toLocation;
                this.activityForm.date = new Date().toISOString().substr(0, 10);
                delete this.activityForm.duration;
                delete this.activityForm.startTime;
                delete this.activityForm.passengers;
                this.activityForm.shared = false;
                this.activityForm.passengerPrice = 0; 
            }
        }
    }
</script>
