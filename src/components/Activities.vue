<template>
  <div>
    <v-data-table :items="activities" :headers="headers" :items-per-page="10" class="elevation-1" :loading="isLoading" loading-text="Loading...">
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
    const firebase = require('../firebaseConfig.js')

    export default {
        data() {
            return {
                activities: [],
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
                    { text: 'Price', value: 'price', sortable: true },
                    { text: 'Passenger', value: 'passenger', sortable: true },
                    { text: 'Passenger Price', value: 'passengerPrice', sortable: true },
                    { text: 'Gas', value: 'gas', sortable: true },
                    { text: 'Action', value: 'action', sortable: false },
                ],
                isLoading: false
            }
        },
        mounted: function () {
            this.isLoading = true;
            this.loadActivities();
        },
        methods: {
            async loadActivities() {
                try {
                    let snapshot = await firebase.activitiesCollection.orderBy('date', 'desc').get();
                    snapshot.forEach(doc => {
                        let activity = doc.data();
                        activity.id = doc.id;
                        this.activities.push(activity);
                    });
                } catch(error) {
                    console.error(error);
                }
                this.isLoading = false;
            },
            deleteActivity(activity) {
                this.isLoading = true;
                this.activities = [];
                try {
                    firebase.activitiesCollection.doc(activity.id).delete();
                } catch(error) {
                    console.error(error);
                }
                this.loadActivities();
            }
        }
    }
</script>
