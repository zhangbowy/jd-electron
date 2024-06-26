<template>
  <div id="app-base-screen">
    <a-form :moda="form" laba-position="top">
          <a-form-item :label="'商品链接'">
            <a-row>
              <a-col v-for="(item,index) in form.urlList" :key="index" :span="24">
                <a-input v-model="item.url" size="small" placeholder="" style="width: 50%">
                  <template slot="prepend">{{ `1` }}</template>
                </a-input>
                <a-button
                  v-if="index !== form.urlList.length - 1"
                  size="small"
                  type="danger"
                  style="vertical-align: top;margin: 0"
                  @click="deleteTemplate(index)"
                >{{ '删除' }}</a-button>
                <a-button
                  v-if="index === form.urlList.length - 1"
                  size="small"
                  style="vertical-align: top;"
                  @click="addTemplate()"
                >{{ '添加' }}</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-button size="small" @click="importGoods">{{ '导入商品' }}</a-button>
          </a-form-item>
        </a-form>

  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';

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
          url: '2222'
        }]
      },
    };
  },
  mounted () {
  },
  methods: {
    deleteTemplate(index) {
      this.form.urlList.splice(index, 1)
    },
    addTemplate() {
      if (!this.form.urlList[this.form.urlList.length - 1].url) {
        // this.$message(`'请输入商品链接'`)
        return
      }
      this.form.urlList.push({
        url: ''
      })
    },
    importGoods() {},
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
