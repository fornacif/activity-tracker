<template>
  <v-app id="login">
    <v-row>
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="performLogin" id="formLogin">
              <v-text-field label="Login" v-model="login" prepend-icon="mdi-account" type="email"/>
              <v-text-field label="Password" v-model="password" prepend-icon="mdi-lock-question" type="password"/>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn form="formLogin" type="submit" color="blue darken-3" dark :loading="loading">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
    const firebase = require('../firebaseConfig.js')

    export default {
        data() {
            return {
                login: '',
                password: '',
                loading: false
            }
        },
        methods: {
            performLogin() {
                this.loading = true;
                firebase.auth.signInWithEmailAndPassword(this.login, this.password).then(() => {
                    this.loading = false;
                  	this.$router.push('/');
                }).catch(error => {
                    console.log(error);
                    this.loading = false;
                }) 
            }
        }
    }

</script>