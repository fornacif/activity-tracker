<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-home-analytics</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider :inset="inset"></v-divider>
        <v-list-item to="/activity">
          <v-list-item-action>
            <v-icon>mdi-table-large-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Activity</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/map">
          <v-list-item-action>
            <v-icon>mdi-google-maps</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Map</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/activities">
          <v-list-item-action>
            <v-icon>mdi-table-large</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Activities</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider :inset="inset"></v-divider>
        <v-list-item to="/profile">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Activity Tracker - 1.2.0</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
    }),
  }
</script>