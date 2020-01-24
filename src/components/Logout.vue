<template>
  <div></div>
</template>

<script>
    const firebase = require('../firebaseConfig.js')

    export default {
        mounted: function() {
          firebase.auth.signOut();
          this.$router.push('login');
        }
    }

</script>