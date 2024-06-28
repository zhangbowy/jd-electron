<template>
  <div id="effect-login-window">
    <div class="block-1">
      <a-input style="margin-bottom: 10px" v-model:value="username" placeholder="请输入账号"></a-input>
      <a-input style="margin-bottom: 10px"  v-model:value="password" placeholder="请输入密码"></a-input>
      <a v-if="!loading" @click="login">
        <a-button type="primary">
          登录
        </a-button>
      </a>
      <span v-else>{{ loginText }}</span>
    </div>
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import { message } from 'ant-design-vue';

export default {
  data() {
    return {
      loading: false,
      loginText: '正在登陆......',
      username: "",
      password: "",
    };
  },
  methods: {

    login() {
      this.loading = true;
      fetch('http://122.51.6.129:8001/admin/login/index', {
        method: 'post',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        })
      }).then(res => res.json())
        .then(data => {
          if(data.status === 411) {
            message.error(data.msg)
          }
          if (data.status === 200) {
            message.success('登录成功')
            setTimeout(() => {
              this.$router.push({ name: 'OsWindowViewIndex', params: {}});
              ipc.invoke(ipcApiRoute.restoreWindow, {width: 980, height: 650}).then(r => {
                //
              })
            }, 500);
          }
        }).finally(() => {
        this.loading = false;
      })
    }
  }
};
</script>
<style lang="less" scoped>
#effect-login-window {
  width: 100%;
  min-height: 100%;
  background: #f0f2f5 url(/src/assets/login.png) no-repeat 50%;
  display: flex;
  .block-1 {
    font-size: 16px;
    align-items: center;
    margin: auto;
    display: inline-block;
  }
}
</style>
