<template>
  <div id="app-base-window">
    <div class="one-block-1">
      <span>
       京东备案自动关联
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <span>{{shopInfo.name}}</span>
        <a-tag>{{isLogin? '已登录' : '未登录'}}</a-tag>
        <a-button @click="createWindow(0)">登录商家后台</a-button>
      </a-space>
    </div>
    <div class="one-block-2">
      <div class="dark">
          <span style="color: #FAFAFA">{{isLogin? '持续监控中' : '请先登录'}}</span>
      </div>
      <a-space>

      </a-space>
    </div>
    
    <!-- <div class="one-block-1">
    //   <span>
    //     2. 新窗口中加载html内容
    //   </span>
    // </div>  
    // <div class="one-block-2">
    //   <a-space>
    //     <a-button @click="createWindow(1)">打开html页面</a-button>
    //   </a-space>
    // </div>
    // <div class="one-block-1">
    //   <span>
    //     3. 新窗口中加载当前项目页面
    //   </span>
    // </div>  
    // <div class="one-block-2">
    //   <a-space>
    //     <a-button @click="createWindow(2)">打开vue页面</a-button>
    //   </a-space>
    // </div>     -->
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import { toRaw } from 'vue';
let timer = null
export default {
  data() {
    return {
      shopInfo: {},
      isLogin: false,
      views: [
        {
          type: 'web',
          content: 'https://porder.shop.jd.com/order/orderlist/allOrders?t=1714983558569',
          windowName: 'window-web',
          windowTitle: '京东商家后台'
        },
        {
          type: 'html',
          content: '/public/html/view_example.html',
          windowName: 'window-html',
          windowTitle: 'html window'
        },
        {
          type: 'vue',
          content: '#/special/subwindow',
          windowName: 'window-vue',
          windowTitle: 'vue window'
        },    
      ],
    };
  },
  methods: {
    createWindow (index) {
      ipc.invoke(ipcApiRoute.createWindow, toRaw(this.views[index])).then(r => {
        console.log(r);
      })
    },
    getShopInfo() {
      ipc.invoke('controller.os.getShopInfo').then(r => {
        console.log(r)
        this.shopInfo = r;
      })
    },
    check() {
      ipc.invoke('controller.os.checkLogin').then(r => {
        this.isLogin = !!r;
      })

      this.getShopInfo()
    },
    asyncJdCookies() {

    }
  },
  created() {
    this.check()
    if(timer) clearTimeout(timer)
    timer = setInterval(this.check, 10000);
  }
};
</script>
<style lang="less" scoped>
#app-base-window {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
  .dark {
    background: #000;
    height: 420px;
  }
}
</style>
