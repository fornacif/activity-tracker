<template>
  <div>
    <v-card outlined>
        <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                <v-icon dark>mdi-account</v-icon>
            </v-avatar>
            Manage your Profile
        </v-banner>
        
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
            
              <v-row dense>
                <v-col sm="12">
                  <p class="font-weight-bold">Aircrafts</p>
                </v-col>
              </v-row>
              
              <v-data-table :items="profile.aircrafts" :headers="aircraftsHeaders" :items-per-page="10" :loading="$store.state.isLoading" loading-text="Loading..." :mobile-breakpoint="$store.state.mobileBreakpoint">
              <template v-slot:top>
                <v-dialog v-model="aircraftDialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn class="mb-2" v-on="on">New Aircraft</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ aircraftDialogTitle }}</span>
                    </v-card-title>
        
                    <v-card-text>
                      <v-form ref="aircraftForm" v-model="valid" lazy-validation>
                      <v-row dense>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraft.registration" label="Registration" :rules="required" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraft.model" label="Model" :rules="required" required></v-text-field>
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
                      <v-btn color="blue darken-1" text @click="closeAircraftDialog">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="saveAircraft">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn text fab x-small>
                  <v-icon @click="editAircraft(item)">mdi-pencil</v-icon>
                </v-btn>
                <v-btn text fab x-small>
                  <v-icon @click="deleteAircraft(item)">mdi-trash-can</v-icon>
                </v-btn>
              </template>
            </v-data-table>
               
            <v-row dense>
              <v-col sm="12">
                <p class="font-weight-bold">Personal Information</p>
              </v-col>
            </v-row>
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
                    <v-btn @click="updateProfile" :loading="$store.state.isLoading">UPDATE</v-btn>
                </v-col>
            </v-row>
          </v-form>

          <v-row dense class="mt-5">
            <v-col sm="12">
              <p class="font-weight-bold">Manage Data</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col sm="12">
              <v-btn @click="exportActivities">EXPORT ACTIVITIES</v-btn>
              <a id="exportLink" style="display:none"></a>
            </v-col>
          </v-row>
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
            async exportActivities() {
				await this.$store.dispatch('getActivities');
				let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.$store.state.activities, null, 2));
				let exportLink = document.getElementById('exportLink');
				exportLink.setAttribute("href", data);
				exportLink.setAttribute("download", "activities.json");
				exportLink.click();
            }
        }
    }
</script>
