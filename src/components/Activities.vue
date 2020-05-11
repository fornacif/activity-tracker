<template>
  <div>
    <v-card>
        <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                <v-icon dark>mdi-table-large</v-icon>
            </v-avatar>
            Flight Records
        </v-banner>
        <v-card-text>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Type to search..." clearable single-line hide-details dense></v-text-field>
        </v-card-text>
        <v-data-table :items="$store.state.activities" :headers="headers" :items-per-page="10" :search="search" :loading="$store.state.isLoading" loading-text="Loading..." mobile-breakpoint="400">
            <template v-slot:item.category="{ item }">
                <v-chip :color="getCategoryColor(item)" dark>{{ item.category }}</v-chip>
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

    export default {
        data() {
            return {
                search: '',
                headers: [
                    { text: 'DATE', value: 'date', sortable: true },
                    { text: 'MODEL', value: 'model', sortable: true },
                    { text: 'REGISTRATION', value: 'registration', sortable: true },
                    { text: 'CATEGORY', value: 'category', sortable: true },
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
                this.$store.dispatch('getActivities');
            },
            getCategoryColor(activity) {
                return activity.category == "CDB" ? 'blue-grey darken-1' : 'lime darken-4';
            }
        }
    }
</script>
