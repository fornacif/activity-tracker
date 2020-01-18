<template>
  <div>
    <v-banner>
        <v-avatar slot="icon" color="blue-grey darken-3" size="40">
            <v-icon dark>mdi-google-maps</v-icon>
        </v-avatar>
        Departure and destination points
    </v-banner>
    <GmapMap :center="{lat:48.7519, lng:2.10619}" :zoom="8" map-type-id="terrain" style="width: 100%; height: 76vh">
        <GmapMarker :key="index" v-for="(marker, index) in markers" :position="marker"/>
    </GmapMap>
  </div>
</template>

<script>
    const firebase = require('../firebaseConfig.js')

    export default {
        data() {
            return {
                markers: []
            }
        },
        mounted: function () {
            this.loadActivities();
        },
        methods: {
            async loadActivities() {
                let snapshot = await firebase.activitiesCollection.get();
                snapshot.forEach(doc => {
                    let fromPosition = {
                        lat: doc.data().fromLocation.coordinates.latitude,
                        lng: doc.data().fromLocation.coordinates.longitude
                    }
                    let toPosition = {
                        lat: doc.data().toLocation.coordinates.latitude,
                        lng: doc.data().toLocation.coordinates.longitude
                    }
                    this.markers.push(fromPosition, toPosition);
                });
            }
        }
    }
</script>

