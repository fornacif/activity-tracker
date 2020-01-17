<template>
  <div>
    <v-card>
        <v-card-text>
            <div>Add new activity</div>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row dense>
                    <v-col cols="12" sm="2">
                        <v-radio-group v-model="activityForm.model" row>
                          <v-radio label="R22" value="R22"/>
                          <v-radio label="R44" value="R44"/>
                        </v-radio-group>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Aircraft Registration" v-model="activityForm.registration" v-mask="'A-AAAA'" :rules="required" required/>
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
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Price" v-model="price" readonly/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Passenger" v-model="activityForm.passenger"/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-switch label="Shared" v-model="activityForm.shared" inset/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Passenger Price" v-model="passengerPrice" readonly/>
                    </v-col>
                    <v-col cols="12" sm="2">
                        <v-text-field label="Gas" v-model="gas" readonly/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col sm="12">
                        <v-btn color="blue darken-3" dark @click="addActivity" :loading="isLoading">SUBMIT</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
    const firebase = require('../firebaseConfig.js')
    import { mask } from 'vue-the-mask'

    export default {
        directives: {
          mask,
        },
        data() {
            return {
                valid: true,
                activityForm: {
                    model: 'R22',
                    registration: 'F-GIHE',
                    category: 'CDB',
                    passengerPrice: 0,
                    date: new Date().toISOString().substr(0, 10)
                },
                categories: [
                  { value: 'CDB', text: 'CDB' },
                  { value: 'INST', text: 'INST' }
                ],
                required: [
                    v => !!v || 'Input is required'
                  ],
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
        computed: {
            price: function() {
                if (isNaN(this.activityForm.duration)) {
                    return 0
                } else {
                    let unitPrice = this.$store.getters.getPrice(this.activityForm.model, this.activityForm.category);
                    return Math.round(this.activityForm.duration * unitPrice * 100) / 100;
                }     
            },
            passengerPrice: function() {
                if (this.activityForm.shared) {
                    return this.price / 2;
                } else {
                    return 0;
                }
            },
            gas: function() {
                if (isNaN(this.activityForm.duration)) {
                    return 0;
                } else {
                    let consumption = this.$store.getters.getConsumption(this.activityForm.model);
                    return Math.round(this.activityForm.duration * consumption);  
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
            price: function(value) {
                this.activityForm.price = value;
            },
            passengerPrice: function(value) {
                this.activityForm.passengerPrice = value;
            },
            gas: function(value) {
                this.activityForm.gas = value;
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
                    this.isLoading = true;
                    await firebase.activitiesCollection.add(this.activityForm);
                    this.resetFrorm();
                    this.isLoading = false;
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
                this.activityForm.model = 'R22';
                this.activityForm.registration = 'F-GHIE';
                this.activityForm.category = 'CDB';
                this.activityForm.fromLocation = '';
                this.activityForm.toLocation = '';
                this.activityForm.date = new Date().toISOString().substr(0, 10);
                this.activityForm.duration = '';
                this.activityForm.startTime = '';
                this.activityForm.passenger = '';
                this.activityForm.passengerPrice = 0;
                this.activityForm.shared = false;
            }
        }
    }
</script>
