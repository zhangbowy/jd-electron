<template>
  <keep-alive>
  <router-view/>
  </keep-alive>
</template>

<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
export default {
  name: 'App',
  setup() {
    document.getElementById('loadingPage').remove()
  },
  created() {
    this.loginWindow()
  },
  methods: {
    loginWindow () {
      this.$router.push({ name: 'SpecialLoginWindow', params: {}});
      ipc.invoke(ipcApiRoute.loginWindow, {width: 800, height: 600}).then(r => {      
        // 
      })
    },
  }
}
</script>
<style lang="less"></style>
