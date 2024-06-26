<template>
  <div id="app-base-notification">
    <div class="one-block-1">
      <span>
        可以用来关联的UPC列表
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <!-- <a-button @click="sendNotification(0)">默认</a-button>
        <a-button @click="sendNotification(1)">发出提示音</a-button>
        <a-button @click="sendNotification(2)">点击通知触发事件</a-button>
        <a-button @click="sendNotification(3)">关闭通知触发事件</a-button> -->
      </a-space>
      <a-table :dataSource="data" :columns="columns"></a-table>
    </div>
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import { toRaw } from 'vue';

export default {
  data() {
    return {
      data: [],
      columns: [
          {
            title: '主备安UPC',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '已关联数量',
            dataIndex: 'value',
            key: 'age',
          },
        ],
      views: [
        {
          type: 'main',
          title: '通知标题',
          subtitle: '副标题', // macOS系统专有属性
          body: '这是通知内容-默认',
          silent: true,
        },
        {
          type: 'main',
          title: '提示音',
          subtitle: '副标题-提示音',
          body: '这是通知内容-提示音',
          silent: false,
        },
        {
          type: 'main',
          title: '点击通知事件',
          subtitle: '副标题-点击通知事件',
          body: '这是通知内容-点击通知事件',
          clickEvent: true
        },
        {
          type: 'main',
          title: '关闭通知事件',
          subtitle: '副标题-关闭通知事件',
          body: '这是通知内容-点击通知事件',
          closeEvent: true
        },             
      ],
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    async init() {
      const thread = await ipc.invoke('controller.os.getThread');
      fetch("http://122.51.6.129:7001/getMainPool?thread=" + thread, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then(res => res.json()).then(RES => {

        this.data = Object.keys(RES.ucpPool).map(item => {
          return {
            name: item,
            value: RES.ucpPool[item]
          }
        })
        /*  */
      });

    },
    sendNotification (index) {
      ipc.send(ipcApiRoute.sendNotification, toRaw(this.views[index]));
    },
  }
};
</script>
<style lang="less" scoped>
#app-base-notification {
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
}
</style>
