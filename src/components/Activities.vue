<template>
  <div>
    <v-banner>
        <v-avatar slot="icon" color="blue-grey darken-3" size="40">
            <v-icon dark>mdi-table-large</v-icon>
        </v-avatar>
        Flight records
    </v-banner>
    <v-data-table :items="$store.state.activities" :headers="headers" :items-per-page="10" class="elevation-1" :loading="$store.state.isLoading" loading-text="Loading...">
        <template v-slot:item.category="{ item }">
            <v-chip :color="getCategoryColor(item)" dark>{{ item.category }}</v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small @click="deleteActivity(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.date="{ item }">
           {{ $moment(item.date).format('DD/MM/YYYY') }}
        </template>
    </v-data-table>
  </div>
</template>

<script>

    export default {
        data() {
            return {
                headers: [
                    { text: 'Date', value: 'date', sortable: true },
                    { text: 'Model', value: 'model', sortable: true },
                    { text: 'Registration', value: 'registration', sortable: true },
                    { text: 'Category', value: 'category', sortable: true },
                    { text: 'From Location', value: 'fromLocation.code', sortable: true },
                    { text: 'To Location', value: 'toLocation.code', sortable: true },
                    { text: 'Duration', value: 'duration', sortable: true },
                    { text: 'Start Time', value: 'startTime', sortable: true },
                    { text: 'End Time', value: 'endTime', sortable: true },
                    { text: 'Total Time', value: 'totalTime', sortable: true },
                    { text: 'Gas', value: 'gas', sortable: true },
                    { text: 'Price', value: 'price', sortable: true },
                    { text: 'Passengers', value: 'passengers', sortable: true },
                    { text: 'Shared', value: 'shared', sortable: true },
                    { text: 'Passenger Price', value: 'passengerPrice', sortable: true },
                    { text: 'Action', value: 'action', sortable: false },
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
