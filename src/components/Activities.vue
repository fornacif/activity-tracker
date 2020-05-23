<template>
   <div>
      <v-card outlined>
         <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
               <v-icon dark>mdi-table-large</v-icon>
            </v-avatar>
            Flight Records
         </v-banner>
         <v-card-text>
            <v-alert dense text type="info" color="blue-grey darken-1" class="body-2">
               <strong>PIC</strong> name (for P/UT flights), <strong>PASSENGERS</strong>, <strong>SHARED</strong> and <strong>PAX PRICE</strong> are editable. Just click the cell to update.
               <br />To update more fields, <strong>delete</strong> the activity and create a new one.
            </v-alert>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Type to search..." clearable single-line hide-details dense></v-text-field>
         </v-card-text>
         <v-data-table :items="$store.state.activities" :headers="headers" :items-per-page="10" :search="search" :loading="$store.state.isLoading" loading-text="Loading..." :mobile-breakpoint="$store.state.mobileBreakpoint">
            <template v-slot:item.category="{ item }">
               <v-chip label :color="getCategoryColor(item)" dark>{{ item.category }}</v-chip>
            </template>
            <template v-slot:item.pic="{ item }">
               <v-edit-dialog v-if="item.category != 'PIC'"
                  :return-value.sync="item.pic"
                  @save="updateActivity(item)"
                  large
                  persistent>
                  {{ item.pic }}
                  <template v-slot:input>
                    <v-text-field v-model="item.pic" label="Pilot In Command" v-show="item.category != 'PIC'"></v-text-field>
                  </template>
                </v-edit-dialog>
                <span v-if="item.category == 'PIC'">{{ item.pic }}</span>
            </template>
            <template v-slot:item.fromLocation.code="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ item.fromLocation.code }}</span>
                  </template>
                  <span>{{ item.fromLocation.name }}</span>
                </v-tooltip>
            </template>
            <template v-slot:item.toLocation.code="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ item.toLocation.code }}</span>
                  </template>
                  <span>{{ item.toLocation.name }}</span>
                </v-tooltip>
            </template>
            <template v-slot:item.shared="{ item }">
               <v-edit-dialog
                  :return-value.sync="item.shared"
                  @save="updateActivity(item)"
                  large
                  persistent>
                  {{ item.shared }}
                  <template v-slot:input >
                    <v-switch dense label="Share Price" v-model="item.shared" inset/>
                  </template>
                </v-edit-dialog>
            </template>
            <template v-slot:item.passengers="{ item }">
               <v-edit-dialog
                  :return-value.sync="item.passengers"
                   @save="updateActivity(item)"
                  large
                  persistent>
                  {{ item.passengers }}
                  <template v-slot:input>
                    <v-text-field v-model="item.passengers" label="Passenger Names"></v-text-field>
                  </template>
                </v-edit-dialog>
            </template>
            <template v-slot:item.passengerPrice="{ item }">
               <v-edit-dialog
                  :return-value.sync="item.passengerPrice"
                   @save="updateActivity(item)"
                  large
                  persistent>
                  {{ item.passengerPrice }}
                  <template v-slot:input>
                    <v-text-field v-model="item.passengerPrice" label="PAX Price" v-mask="'####'"></v-text-field>
                  </template>
                </v-edit-dialog>
            </template>
            <template v-slot:item.action="{ item }">
               <v-speed-dial v-model="item.selected" direction="left">
                  <template v-slot:activator>
                     <v-btn text x-small v-model="item.selected" fab>
                        <v-icon v-if="item.selected">mdi-close</v-icon>
                        <v-icon v-else>mdi-delete</v-icon>
                     </v-btn>
                  </template>
                  <v-btn fab x-small>
                     <v-icon @click="deleteActivity(item)">mdi-trash-can</v-icon>
                  </v-btn>
               </v-speed-dial>
            </template>
            <template v-slot:item.date="{ item }">
               {{ $moment(item.date).format('DD/MM/YYYY') }}
            </template>
         </v-data-table>
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
                search: '',
                headers: [
                    { text: 'DATE', value: 'date', sortable: true },
                    { text: 'REGISTRATION', value: 'registration', sortable: true },
                    { text: 'TYPE', value: 'type', sortable: true },
                    { text: 'CATEGORY', value: 'category', sortable: true },
                    { text: 'PIC', value: 'pic', sortable: true },
                    { text: 'FROM', value: 'fromLocation.code', sortable: true },
                    { text: 'TO', value: 'toLocation.code', sortable: true },
                    { text: 'DURATION', value: 'duration', sortable: true },
                    { text: 'START', value: 'startTime', sortable: true },
                    { text: 'END', value: 'endTime', sortable: true },
                    { text: 'TOTAL', value: 'totalTime', sortable: true },
                    { text: 'FUEL', value: 'fuel', sortable: true },
                    { text: 'PRICE', value: 'price', sortable: true },
                    { text: 'PASSENGERS', value: 'passengers', sortable: true },
                    { text: 'SHARED', value: 'shared', sortable: true },
                    { text: 'PAX PRICE', value: 'passengerPrice', sortable: true },
                    { text: 'ACTION', value: 'action', sortable: false },
                ]
            }
        },
        mounted: function () {
            this.$store.dispatch('getActivities');
        },
        methods: {
            async deleteActivity(activity) {
                await this.$store.dispatch('deleteActivity', activity);
            },
            getCategoryColor(activity) {
                return activity.category == "PIC" ? 'blue-grey darken-1' : 'lime darken-4';
            },
            updateActivity(activity) {
                this.$store.dispatch('updateActivity', activity);
            }
        }
    }
</script>
