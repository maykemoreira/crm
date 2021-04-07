<template>
  <div>
    <router-view></router-view>
  </div>

</template>

<script>
export default {
  name: 'App',

  components: {

  },

  data: () => ({
    drawer: true,
    loginFeito: false
  })
}
</script>
