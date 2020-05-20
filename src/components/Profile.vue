<template>
   <div>
      <v-card outlined>
         <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
               <v-icon dark>mdi-helicopter</v-icon>
            </v-avatar>
            Manage Aircrafts
         </v-banner>
         <v-card-text>
            <v-data-table :items="profile.aircrafts" :headers="aircraftsHeaders" :items-per-page="10" :loading="$store.state.isLoading" loading-text="Loading..." :mobile-breakpoint="$store.state.mobileBreakpoint">
               <template v-slot:top>
                  <v-dialog v-model="aircraftDialog" max-width="500px">
                     <template v-slot:activator="{ on }">
                        <v-btn depressed class="mb-2" v-on="on">New Aircraft</v-btn>
                     </template>
                     <v-card>
                        <v-card-title>
                           <span class="headline">{{ aircraftDialogTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                           <v-form ref="aircraftForm" v-model="valid" lazy-validation>
                              <v-row dense>
                                 <v-col cols="12" sm="4">
                                    <v-text-field v-model="aircraft.registration" label="Registration" :rules="required" required hint="Exemple: F-GIHE"></v-text-field>
                                 </v-col>
                                 <v-col cols="12" sm="4">
                                    <v-text-field v-model="aircraft.model" label="Model" :rules="required" required hint="Exemple: R22"></v-text-field>
                                 </v-col>
                                 <v-col cols="12" sm="4">
                                    <v-text-field v-model="aircraft.fuel" label="Fuel (liter/h)" v-mask="'####'" :rules="required" required></v-text-field>
                                 </v-col>
                                 <v-col cols="12" sm="4">
                                    <v-text-field v-model="aircraft.cdbPrice" label="CDB Price (€/h)" v-mask="'####'" :rules="required" required></v-text-field>
                                 </v-col>
                                 <v-col cols="12" sm="4">
                                    <v-text-field v-model="aircraft.instPrice" label="INST Price (€/h)" v-mask="'####'" :rules="required" required></v-text-field>
                                 </v-col>
                              </v-row>
                           </v-form>
                        </v-card-text>
                        <v-card-actions>
                           <v-spacer></v-spacer>
                           <v-btn text @click="closeAircraftDialog">Cancel</v-btn>
                           <v-btn depressed @click="saveAircraft">Save</v-btn>
                        </v-card-actions>
                     </v-card>
                  </v-dialog>
               </template>
               <template v-slot:item.actions="{ item }">
                  <v-row>
                     <v-btn text fab x-small>
                        <v-icon @click="editAircraft(item)">mdi-pencil</v-icon>
                     </v-btn>
                     <v-speed-dial v-model="item.selected" direction="right">
                        <template v-slot:activator>
                           <v-btn text x-small v-model="item.selected" fab>
                              <v-icon v-if="item.selected">mdi-close</v-icon>
                              <v-icon v-else>mdi-delete</v-icon>
                           </v-btn>
                        </template>
                        <v-btn fab x-small>
                           <v-icon @click="deleteAircraft(item)">mdi-trash-can</v-icon>
                        </v-btn>
                     </v-speed-dial>
                  </v-row>
               </template>
            </v-data-table>
         </v-card-text>
      </v-card>
      <v-card outlined class="mt-2">
         <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
               <v-icon dark>mdi-account</v-icon>
            </v-avatar>
            Personal Information
         </v-banner>
         <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
               <v-row dense>
                  <v-col cols="12" sm="2">
                     <v-text-field label="Firstname" v-model="profile.firstName" :rules="required" required/>
                  </v-col>
                  <v-col cols="12" sm="2">
                     <v-text-field label="Lastname" v-model="profile.lastName" :rules="required" required/>
                  </v-col>
                  <v-col cols="12" sm="2">
                     <v-text-field label="Birth Date" v-model="profile.birthDate" :rules="required" required type="date"/>
                  </v-col>
               </v-row>
               <v-row dense>
                  <v-col cols="12" sm="2">
                     <v-text-field label="Medical Obtention Date" v-model="profile.medicalDate" :rules="required" required type="date"/>
                  </v-col>
               </v-row>
               <v-row dense>
                  <v-col sm="12">
                     <v-btn depressed @click="updateProfile" :loading="$store.state.isLoading">UPDATE</v-btn>
                  </v-col>
               </v-row>
            </v-form>
         </v-card-text>
      </v-card>
      <v-card outlined class="mt-2">
         <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
               <v-icon dark>mdi-database-export</v-icon>
            </v-avatar>
            Manage Data
         </v-banner>
         <v-card-text>
            <v-row dense>
               <v-col sm="12">
                  <v-btn depressed @click="exportActivitiesAsJson">EXPORT ACTIVITIES AS JSON</v-btn>
                  <a id="exportJsonLink" style="display:none"></a>
               </v-col>
               <v-col sm="12" class="mt-1">
                  <v-btn depressed @click="exportActivitiesAsCsv">EXPORT ACTIVITIES AS CSV</v-btn>
                  <a id="exportCsvLink" style="display:none"></a>
               </v-col>
            </v-row>
         </v-card-text>
      </v-card>
   </div>
</template>

<script>
    import { mask } from 'vue-the-mask'
    const flatten = require('flat').flatten;

    export default {
        directives: {
          mask,
        },
        data() {
            return {
                valid: true,
                profile: {},
                aircraft: {},
                editedIndex: -1,
                aircraftsHeaders: [
					{ text: 'REGISTRATION', value: 'registration', sortable: true },
                    { text: 'MODEL', value: 'model', sortable: true },
                    { text: 'FUEL', value: 'fuel', sortable: true },
                    { text: 'CDB PRICE', value: 'cdbPrice', sortable: true },
                    { text: 'INST PRICE', value: 'instPrice', sortable: true },
                    { text: 'ACTIONS', value: 'actions', sortable: false },
                ],
                aircraftDialog: false,
                required: [
                    v => !!v || 'Input is required'
                ],
                isLoading: false
            }
        },
        mounted: async function () {
            await this.$store.dispatch('getProfile');
            this.profile = this.$store.state.profile;
        },
        computed: {
			aircraftDialogTitle () {
				return this.editedIndex === -1 ? 'New Aircraft' : 'Edit Aircraft'
			},
        },
        watch: {
			aircraftDialog(val) {
				val || this.closeAircraftDialog();
			},
        },
        methods: {
			editAircraft(item) {
				this.editedIndex = this.profile.aircrafts.indexOf(item);
				this.aircraft = Object.assign({}, item);
				this.aircraftDialog = true;
            },
            deleteAircraft(item) {
				const index = this.profile.aircrafts.indexOf(item);
				this.profile.aircrafts.splice(index, 1);
				this.$store.dispatch('setProfile', this.profile);
            },
            saveAircraft() {
				if (this.$refs.aircraftForm.validate()) {
					this.aircraft.registration = this.aircraft.registration.toUpperCase();
					if (this.editedIndex > -1) {
						Object.assign(this.profile.aircrafts[this.editedIndex], this.aircraft);
                    } else {
						this.profile.aircrafts.push(this.aircraft);
                    }
					this.$store.dispatch('setProfile', this.profile);
					this.closeAircraftDialog();
				}
            },
            closeAircraftDialog() {
				this.$refs.aircraftForm.resetValidation();
				this.aircraft = {};
				
				this.aircraftDialog = false;
				this.editedIndex = -1;
            },
            updateProfile() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch('setProfile', this.profile);
                }
            },
            async exportActivitiesAsJson() {
				await this.$store.dispatch('getActivities');
				let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.$store.state.activities, null, 2));
				let exportLink = document.getElementById('exportJsonLink');
				exportLink.setAttribute("href", data);
				exportLink.setAttribute("download", "activities.json");
				exportLink.click();
            },
            async exportActivitiesAsCsv() {
                await this.$store.dispatch('getActivities');
                
                let flattenJsonActivities = [];
                this.$store.state.activities.forEach(activity => {
                    flattenJsonActivities.push(flatten(activity));
                });
   
                var fields = Object.keys(flattenJsonActivities[0]);
                var replacer = function(key, value) { return value === null ? '' : value };
                var csv = flattenJsonActivities.map(function(row) {
                  return fields.map(function(fieldName){
                    return JSON.stringify(row[fieldName], replacer)
                  }).join(',')
                });
                csv.unshift(fields.join(','));
                csv = csv.join('\r\n');
                
                let data = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
                let exportLink = document.getElementById('exportCsvLink');
                exportLink.setAttribute("href", data);
                exportLink.setAttribute("download", "activities.csv");
                exportLink.click();
            }
        }
    }
</script>
