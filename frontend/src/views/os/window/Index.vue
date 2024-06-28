<template>
  <div id="app-base-screen">
    <div class="one-block-1">
      <span>
       得物商品抓取
      </span>
    </div>
    <div>

    </div>
    <a-spin :spinning="spinning" >
      <div style="height: 80vh; overflow: auto">


        <a-form :moda="form" laba-position="top">
            <div>
              <a-popconfirm
                title="确认删除全部链接吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteAll"
              >
                <a-button
                  type="danger"
                  style="margin-left: 100px;margin-top: 8px; margin-bottom: 8px"
                >{{ '删除全部链接' }}</a-button>
              </a-popconfirm>
            </div>
          <a-form-item :label="'得物商品链接'">
            <a-row>

              <a-col v-for="(item,index) in form.urlList" :span="24" style="margin-bottom: 5px">
                <a-input v-model:value="item.url" placeholder="请输入得物短链接" style="width: 50%">
                  <!--                  <template slot="prepend">{{ `1` }}</template>-->
                </a-input>
                <a-button
                  type="danger"
                  style="vertical-align: top;margin: 0 0 0 8px"
                  @click="deleteTemplate(index)"
                >{{ '删除' }}</a-button>

              </a-col>
              <a-button
                type="primary"
                style="margin-top: 8px;"
                @click="addTemplate()"

              >{{ '添加' }}</a-button>

            </a-row>
          </a-form-item>
          <span v-if="form.urlList.length">共 {{form.urlList.length}}条链接</span>

        </a-form>

        <div style="width: 100%; padding: 20px 0 20px 40px; background: #fff;position: fixed; bottom: 0; ">
          <a-button @click="createWindow" style="margin-right: 8px">
            登录妙手
          </a-button>
          <a-button @click="importGoods" type="primary" style="margin-right: 8px">{{ '抓取数据' }}</a-button>
          <a-button @click="uploadMs">{{ '上传妙手' }}</a-button>
          <div style="display: inline-flex; margin-left: 8px; color: red" v-if="dwData">
            已抓取成功 {{dwData.length}} 条数据, 耗时 {{execTime}}s
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import {utils, write} from "xlsx";
import { message } from 'ant-design-vue';
import {toRaw} from "vue";

/**
 * 导出 excel 文件
 * @param array JSON 数组
 * @param sheetName 第一张表名
 * @param fileName 文件名
 */
const exportExcelFile = (array, sheetName = '表1', fileName = 'example.xlsx') => {
  const jsonWorkSheet = utils.json_to_sheet(array);
  const workBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    }
  };

// 生成工作簿的字符串表示
  const wbout = write(workBook, {bookType: 'xlsx', type: 'binary'});

// 将字符串转换为ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

// 将ArrayBuffer转换为Blob对象
  return new Blob([s2ab(wbout)], {type: 'application/octet-stream'})
}

function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}
export default {
  data() {
    return {
      currentThemeMode: '',
      themaist: [
        'system',
        'light',
        'dark'
      ],
      form: {
        urlList: [{
          url: '',
        }]
      },
      execTime: null,
      dwData: null,
      spinning: false
    };
  },
  mounted () {
  },
  methods: {
    createWindow (index) {
      ipc.invoke(ipcApiRoute.createWindow,{
        type: 'web',
        content: 'https://plds.szchengji-inc.com/move/batch/index',
        windowName: 'window-web',
        windowTitle: '妙手'
      }).then(r => {
        console.log(r);
      })
    },
    deleteAll() {
      this.form.urlList = []
      this.form.urlList.push({
        url: ''
      })
    },
    deleteTemplate(index) {
      if(this.form.urlList.length == 1) return
      this.form.urlList.splice(index, 1)
    },
    addTemplate() {
      if (!this.form.urlList[this.form.urlList.length - 1].url) {
        message.error('请输入商品链接');
        return
      }
      this.form.urlList.push({
        url: ''
      })
    },
    importGoods() {
      const urlList = this.form.urlList.filter(item => item.url).map(({url}) => url.trim())
      if (urlList.length === 0) {
        message.error('至少输入一条链接吧哥');
        return
      }
      this.spinning = true
      const time = Date.now()
      ipc.invoke('controller.os.queryDwData', urlList).then(r => {
        console.log(r)
        if (Array.isArray(r)) {
          this.dwData = r.filter(c => c)
          this.execTime = (Date.now() - time) / 1000
          message.success('数据抓取成功');
        } else {
          message.error(r.message || '报错啦');
        }
        this.spinning = false
      }).catch(e => {
        this.spinning = false
        console.log(e)
        message.error(e);
      })
    },
    async uploadMs() {
      if (!this.dwData) {
        message.error('请先抓取数据')
        return
      }
      this.spinning = true
      ipc.invoke('controller.os.getMsCookie').then(async cookies => {
        const loginInfo = await this.checkLogin(cookies);
        if (loginInfo.errno === 401) {
          message.error('妙手未登录')
          loading.hideX()
          return
        }
        return
        const file = exportExcelFile(this.dwData)
        const formData = new FormData();
        formData.append("2", file, `${generateOrderNumber()}.xlsx`);
        formData.append("cookies", cookies || "");
        const url = "http://122.51.6.129:8360/index/uploadToMS";
        const resp = await fetch(url, {
          method: "POST",
          body: formData //自动修改请求头,formdata的默认请求头的格式是 multipart/form-data
        }).then(res =>res.json())
        if(res.errno === 0) {
          message.success('上传妙手成功', 10000)
          setTimeout(() => {
            window.open('https://plds.szchengji-inc.com/move/import/import_copy?copyType=importCopy')
          }, 2000)
          this.dwData = null
        } else {
          message.error('上传妙手失败')
        }
      }).finally(() => {
        this.spinning = false
      })
    },
    async checkLogin(cookiesStr) {
      const formData = new FormData();
      formData.append("cookies", cookiesStr);
      const url = "http://122.51.6.129:8360/index/checkMSLogin";
      const resp = await fetch(url, {
        method: "POST",
        body: formData //自动修改请求头,formdata的默认请求头的格式是 multipart/form-data
      })
      const res = await resp.json();
      console.log(res)
      return res
    },

    setTheme (e) {
      this.currentThemeMode = e.target.value;
      console.log('setTheme currentThemeMode:', this.currentThemeMode)

      ipc.invoke(ipcApiRoute.setTheme, this.currentThemeMode).then(result => {
        console.log('result:', result)
        this.currentThemeMode = result;
      })
    },
    getTheme () {
      ipc.invoke(ipcApiRoute.getTheme).then(result => {
        console.log('result:', result)
        this.currentThemeMode = result;
      })
    },
  }
};
</script>
<style lang="less" scoped>
#app-base-screen {
  margin: 0px 10px;
  text-align: left;
  width: 100%;
  height: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
