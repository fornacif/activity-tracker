<template>
  <div>
    <v-card outlined>
      <v-banner>
          <v-avatar slot="icon" color="blue-grey darken-3" size="40">
              <v-icon dark>mdi-google-maps</v-icon>
          </v-avatar>
          Departure and Destination Points
      </v-banner>
      <GmapMap :center="{lat:48.7519, lng:2.10619}" :zoom="8" map-type-id="terrain" style="width: 100%; height: 76vh">
          <GmapMarker :key="index" v-for="(marker, index) in markers" :position="marker"/>
      </GmapMap>
    </v-card>
  </div>
</template>

<script>

    export default {
        mounted: function () {
            this.$store.dispatch('getActivities');
        },
        computed: {
            markers : function() {
                let markers = [];
                this.$store.state.activities.forEach(activity => {
                    let fromPosition = {
                        lat: activity.fromLocation.coordinates.latitude,
                        lng: activity.fromLocation.coordinates.longitude
                    }
                    let toPosition = {
                        lat: activity.toLocation.coordinates.latitude,
                        lng: activity.toLocation.coordinates.longitude
                    }
                    markers.push(fromPosition, toPosition);
                });
                return markers;
            }
        }
    }
</script>

