(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-250eb7b8"],{9177:function(e,t,o){},a358:function(e,t,o){"use strict";o.d(t,"b",(function(){return i})),o.d(t,"a",(function(){return r})),o.d(t,"c",(function(){return l}));var n=o("b775"),a={uploadFile:"/api/example/uploadFile",openSoftware:"/api/example/openSoftware",messageShow:"/api/example/messageShow",messageShowConfirm:"/api/example/messageShowConfirm",dbOperation:"/api/example/dbOperation",test1:"/api/example/test1"},r={messageShow:"controller.example.messageShow",messageShowConfirm:"controller.example.messageShowConfirm",selectFolder:"controller.example.selectFolder",openDirectory:"controller.example.openDirectory",socketMessageStart:"controller.example.socketMessageStart",socketMessageStop:"controller.example.socketMessageStop",hello:"controller.example.hello",executeJS:"controller.example.executeJS",loadViewContent:"controller.example.loadViewContent",removeViewContent:"controller.example.removeViewContent",createWindow:"controller.example.createWindow",sendNotification:"controller.example.sendNotification",initPowerMonitor:"controller.example.initPowerMonitor",getScreen:"controller.example.getScreen",openSoftware:"controller.example.openSoftware",autoLaunch:"controller.example.autoLaunch",setTheme:"controller.example.setTheme",getTheme:"controller.example.getTheme",checkForUpdater:"controller.example.checkForUpdater",downloadApp:"controller.example.downloadApp",dbOperation:"controller.example.dbOperation",uploadFile:"controller.example.uploadFile"},l={appUpdater:"app.updater"},i=function(e,t){return Object(n["b"])({url:a[e],method:"post",data:t})}},b38d:function(e,t,o){"use strict";o("9177")},c9d6:function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"app-base-file"}},[o("div",{staticClass:"one-block-2"},[0!==e.image_info.length?o("a-list",{attrs:{size:"small",bordered:"","data-source":e.image_info},scopedSlots:e._u([{key:"renderItem",fn:function(t){return o("a-list-item",{staticStyle:{"text-align":"left"}},[e._v(" "+e._s(t.id)+". "+e._s(t.imageUrlText)+":  "),o("a",{attrs:{href:t.url,target:"_blank"}},[e._v(e._s(t.url))])])}}],null,!1,1145998633)}):e._e()],1),e._m(0),o("div",{staticClass:"one-block-2"},[o("a-space",[o("a-button",{on:{click:function(t){return e.messageShow("ipc")}}},[e._v("消息提示(ipc)")]),o("a-button",{on:{click:function(t){return e.messageShowConfirm("ipc")}}},[e._v("消息提示与确认(ipc)")])],1)],1),e._m(1),o("div",{staticClass:"one-block-2"},[o("a-row",[o("a-col",{attrs:{span:12}},[o("a-input",{attrs:{value:e.dir_path,"addon-before":"保存目录"},model:{value:e.dir_path,callback:function(t){e.dir_path=t},expression:"dir_path"}})],1),o("a-col",{attrs:{span:12}},[o("a-button",{on:{click:e.selectDir}},[e._v(" 修改目录 ")])],1)],1)],1),e._m(2),o("div",{staticClass:"one-block-2"},[o("a-list",{attrs:{grid:{gutter:16,column:4},"data-source":e.file_list},scopedSlots:e._u([{key:"renderItem",fn:function(t){return o("a-list-item",{on:{click:function(o){return e.openDirectry(t.id)}}},[o("a-card",{attrs:{title:t.content}},[o("a-button",{attrs:{type:"link"}},[e._v(" 打开 ")])],1)],1)}}])})],1),o("div",{staticClass:"footer"})])},a=[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"one-block-1"},[o("span",[e._v(" 1. 系统原生对话框 ")])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"one-block-1"},[o("span",[e._v(" 2. 选择保存目录 ")])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"one-block-1"},[o("span",[e._v(" 4. 打开文件夹 ")])])}],r=o("a358"),l=[{content:"【下载】目录",id:"downloads"},{content:"【图片】目录",id:"pictures"},{content:"【文档】目录",id:"documents"},{content:"【音乐】目录",id:"music"}],i={data:function(){return{file_list:l,image_info:[],num:0,dir_path:"D:\\www\\ee"}},methods:{openDirectry:function(e){this.$ipcCall(r["a"].openDirectory,{id:e}).then((function(e){}))},selectDir:function(){var e=this;e.$ipcCall(r["a"].selectFolder,"").then((function(t){e.dir_path=t,e.$message.info(t)}))},messageShow:function(e){var t=this;console.log("[messageShow] type:",e),"http"==e?Object(r["b"])("messageShow",{}).then((function(e){if(0!==e.code)return!1;console.log("res:",e)})).catch((function(e){t.$message.error(e+"异常")})):t.$ipcCall(r["a"].messageShow,"").then((function(e){t.$message.info(e)}))},messageShowConfirm:function(e){var t=this;console.log("[messageShowConfirm] type:",e),"http"==e?Object(r["b"])("messageShowConfirm",{}).then((function(e){if(0!==e.code)return!1;console.log("res:",e)})).catch((function(e){t.$message.error(e+"异常")})):t.$ipcCall(r["a"].messageShowConfirm,"").then((function(e){t.$message.info(e)}))}}},s=i,c=(o("b38d"),o("2877")),p=Object(c["a"])(s,n,a,!1,null,"17d07b44",null);t["default"]=p.exports}}]);
//# sourceMappingURL=chunk-250eb7b8.26cffca5.js.map