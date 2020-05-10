<template>
  <div>
    <v-card>
        <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                <v-icon dark>mdi-account</v-icon>
            </v-avatar>
            Manage your Profile
        </v-banner>
        
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
            
              <v-row dense>
                <p class="font-weight-bold">Aircrafts</p>
              </v-row>
              
              <v-data-table :items="profileForm.aircrafts" :headers="headers" :items-per-page="10" :loading="$store.state.isLoading" loading-text="Loading...">
              <template v-slot:top>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn class="mb-2" v-on="on">New Aircraft</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ dialogTitle }}</span>
                    </v-card-title>
        
                    <v-card-text>
                      <v-form ref="aircraftsForm" v-model="valid" lazy-validation>
                      <v-row dense>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraftForm.registration" label="Registration" :rules="required" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraftForm.model" label="Model" :rules="required" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraftForm.fuel" label="Fuel" v-mask="'####'" :rules="required" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraftForm.cdbPrice" label="CDB Price" v-mask="'####'" :rules="required" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <v-text-field v-model="aircraftForm.instPrice" label="INST Price" v-mask="'####'" :rules="required" required></v-text-field>
                        </v-col>
                      </v-row>
                      </v-form>
                    </v-card-text>
        
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
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
                <p class="font-weight-bold">Personal Information</p>
              </v-row>
              <v-row dense>
                  <v-col cols="12" sm="4">
                      <v-text-field label="Birth Date" v-model="profileForm.birthDate" :rules="required" required type="date"/>
                  </v-col>
              </v-row>  
              <v-row dense>
                  <v-col cols="12" sm="4">
                      <v-text-field label="Medical Date" v-model="profileForm.medicalDate" :rules="required" required type="date"/>
                  </v-col>
              </v-row>
              <v-row dense>
                  <v-col sm="12">
                      <v-btn @click="updateProfile" :loading="$store.state.isLoading">UPDATE</v-btn>
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
                profileForm: {},
                aircraftForm: {},
                editedIndex: -1,
                headers: [
					{ text: 'REGISTRATION', value: 'registration', sortable: true },
                    { text: 'MODEL', value: 'model', sortable: true },
                    { text: 'FUEL', value: 'fuel', sortable: true },
                    { text: 'CDB PRICE', value: 'cdbPrice', sortable: true },
                    { text: 'INST PRICE', value: 'instPrice', sortable: true },
                    { text: 'ACTIONS', value: 'actions', sortable: false },
                ],
                dialog: false,
                required: [
                    v => !!v || 'Input is required'
                ],
                isLoading: false
            }
        },
        mounted: async function () {
            await this.$store.dispatch('getProfile');
            this.profileForm = this.$store.state.profile;
        },
        computed: {
          dialogTitle () {
            return this.editedIndex === -1 ? 'New Aircraft' : 'Edit Aircraft'
          },
        },
        watch: {
          dialog (val) {
            val || this.closeDialog();
          },
        },
        methods: {
			editAircraft(item) {
				this.editedIndex = this.profileForm.aircrafts.indexOf(item);
				this.aircraftForm = Object.assign({}, item);
				this.dialog = true;
            },
            deleteAircraft(item) {
				const index = this.profileForm.aircrafts.indexOf(item);
				this.profileForm.aircrafts.splice(index, 1);
				this.$store.dispatch('setProfile', this.profileForm);
            },
            saveAircraft() {
				if (this.$refs.aircraftsForm.validate()) {
					if (this.editedIndex > -1) {
						Object.assign(this.profileForm.aircrafts[this.editedIndex], this.aircraftForm);
                    } else {
						this.profileForm.aircrafts.push(this.aircraftForm);
                    }
					this.$store.dispatch('setProfile', this.profileForm);
					this.closeDialog();
				}
            },
            closeDialog() {
				this.$refs.form.resetValidation();
				this.aircraftForm = {};
				
				this.dialog = false;
				this.editedIndex = -1;
            },
            async updateProfile() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch('setProfile', this.profileForm);
                }
            }
        }
    }
</script>
