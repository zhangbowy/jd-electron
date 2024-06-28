<template>
  <keep-alive>
  <router-view/>
  </keep-alive>
</template>

<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import {message} from "ant-design-vue";
export default {
  name: 'App',
  setup() {
    // document.getElementById('loadingPage').remove()
  },
  created() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      fetch('http://122.51.6.129:8001/admin/Zt/index', {
        method: 'post',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({})
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          if(data.status === 411) {
            this.loginWindow()
            return message.error('该账号已被禁用, 请联系管理员', 6000)
          }
          if(data.status === 200) {
            // if (data.admin.status === 0) {
            //   alert('该账号已被禁用, 请联系管理员')
            //   return
            //   // return message.error('该账号已被禁用, 请联系管理员', 6000)
            // }
          } else {
            this.loginWindow()
          }
        })
    },
    loginWindow () {
      this.$router.push({ name: 'SpecialLoginWindow', params: {}});
      ipc.invoke(ipcApiRoute.loginWindow, {width: 400, height: 300}).then(r => {
        //
      })
    },
  }
}
</script>
<style lang="less"></style>
