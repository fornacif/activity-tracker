<template>
  <div>
    <v-card>
        <v-banner>
            <v-avatar slot="icon" color="blue-grey darken-3" size="40">
                <v-icon dark>mdi-account</v-icon>
            </v-avatar>
            Manage your profile
        </v-banner>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field label="Birth Date" v-model="accountForm.birthDate" :rules="required" required type="date"/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-text-field label="Medical Date" v-model="accountForm.medicalDate" :rules="required" required type="date"/>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col sm="12">
                        <v-btn color="blue darken-3" dark @click="updateAccount" :loading="$store.state.isLoading">UPDATE</v-btn>
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
                accountForm: {},
                required: [
                    v => !!v || 'Input is required'
                ],
                isLoading: false
            }
        },
        mounted: async function () {
            await this.$store.dispatch('getAccount');
            this.accountForm = this.$store.state.account;
        },
        methods: {
            async updateAccount() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch('setAccount', this.accountForm);
                }
            }
        }
    }
</script>
