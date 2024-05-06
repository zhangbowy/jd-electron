'use strict';

const _ = require('lodash');
const path = require('path');
const { Controller } = require('ee-core');
const {
  app: electronApp, dialog, shell, Notification, 
  powerMonitor, screen, nativeTheme, session
} = require('electron');
const Conf = require('ee-core/config');
const Ps = require('ee-core/ps');
const Services = require('ee-core/services');
const Addon = require('ee-core/addon');
const HttpClient = require('ee-core/httpclient');
const { log } = require('console');


/**
 * 操作系统 - 功能demo
 * @class
 */
class OsController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.getCodeCookie()
    console.log(this.checkLogin(), 'this.checkLogin()')
  }

  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * 消息提示对话框
   */
  messageShow() {
    dialog.showMessageBoxSync({
      type: 'info', // "none", "info", "error", "question" 或者 "warning"
      title: '自定义标题-message',
      message: '自定义消息内容',
      detail: '其它的额外信息'
    })
  
    return '打开了消息框';
  }

  /**
   * 消息提示与确认对话框
   */
  messageShowConfirm() {
    const res = dialog.showMessageBoxSync({
      type: 'info',
      title: '自定义标题-message',
      message: '自定义消息内容',
      detail: '其它的额外信息',
      cancelId: 1, // 用于取消对话框的按钮的索引
      defaultId: 0, // 设置默认选中的按钮
      buttons: ['确认', '取消'], // 按钮及索引
    })
    let data = (res === 0) ? '点击确认按钮' : '点击取消按钮';
  
    return data;
  }

  /**
   * 选择目录
   */
  selectFolder() {
    const filePaths = dialog.showOpenDialogSync({
      properties: ['openDirectory', 'createDirectory']
    });

    if (_.isEmpty(filePaths)) {
      return null
    }

    return filePaths[0];
  } 

  /**
   * 打开目录
   */
  openDirectory(args) {
    if (!args.id) {
      return false;
    }
    let dir = '';
    if (path.isAbsolute(args.id)) {
      dir = args.id;
    } else {
      dir = electronApp.getPath(args.id);
    }

    shell.openPath(dir);
    return true;
  }

  /**
   * 选择图片
   */
  selectPic() {
    const filePaths = dialog.showOpenDialogSync({
      title: 'select pic',
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      ]
    });
    if (_.isEmpty(filePaths)) {
      return null
    }

    return filePaths[0];
  }   

  /**
   * 加载视图内容
   */
  loadViewContent(args) {
    const { type, content } = args;
    let contentUrl = content;
    if (type == 'html') {
      contentUrl = path.join('file://', electronApp.getAppPath(), content);
    }

    Services.get('os').createBrowserView(contentUrl);

    return true
  }

  /**
   * 移除视图内容
   */
  removeViewContent() {
    Services.get('os').removeBrowserView();
    return true
  }  

  /**
   * 打开新窗口
   */
  createWindow(args) {
    const { type, content, windowName, windowTitle } = args;
    let contentUrl = null;
    if (type == 'html') {
      contentUrl = path.join('file://', electronApp.getAppPath(), content)
    } else if (type == 'web') {
      contentUrl = content;
    } else if (type == 'vue') {
      let addr = 'http://localhost:8080'
      if (Ps.isProd()) {
        const mainServer = Conf.getValue('mainServer');
        if (Conf.isFileProtocol(mainServer)) {
          addr = mainServer.protocol + path.join(Ps.getHomeDir(), mainServer.indexPath);
        } else {
          addr = mainServer.protocol + mainServer.host + ':' + mainServer.port;
        }
      }

      contentUrl = addr + content;
    } else {
      // some
    }

    console.log('contentUrl: ', contentUrl);
    let opt = {
      title: windowTitle
    }
    const win = Addon.get('window').create(windowName, opt);
    const winContentsId = win.webContents.id;

    // load page
    win.loadURL(contentUrl);

    return winContentsId;
  }


  getCodeCookie = async () => {
    const cookies = await session.defaultSession.cookies.get({});
    const newArr = cookies.filter(item => item.domain == '.jd.com' || item.domain == '.shop.jd.com'	).map((c) => {
      return `${c.name}=${c.value}`
  })
  return newArr
    // 打印所有cookie
    // console.log(cookies, 'cookies');
    // 或者根据需求进行其他操作
  };


  async checkLogin() {
    const cookies = await this.getCodeCookie()
    this.getShopInfo()
    try {
      const hc = new HttpClient();
      const res = await hc.request("https://porder.shop.jd.com/order/orderlist", {
          "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
              "content-type": "application/json;charset=UTF-8",
              "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              // "cookie": "language=zh_CN; __jdv=56585130|direct|-|none|-|1703600265575; pinId=Mk_A6Nbv7MenkDneLmJDcA; unick=%E5%86%B0%E5%86%B0%E5%B0%8F%E5%BA%97111; pin=%E5%86%B0%E5%86%B0%E5%B0%8F%E5%BA%97111; _tp=WWkrE5q1uaY3bnuvPN7mC0Jy7Qj98SqryFRfDnmAGXBfj3EZkqYEdCCNPQpAbAri; ceshi3.com=000; _pst=%E5%86%B0%E5%86%B0%E5%B0%8F%E5%BA%97111; __jdu=17036002655721718781778; __USE_NEW_PAGEFRAME__=false; __USE_NEW_PAGEFRAME_VERSION__=v9; chat.jd.com=20170206; flash=2_gIf-6hV0n-3D-owJHuVRpoG10QbYhFqtf8iq_PAPhP_zARQSoNehkDTUKX2bRosNurZi5lwdeYPjJ6lyjjCj6DfYmyPcMhCrz4uSJ8Kexsq*; TrackID=1ZSq5cEcVwiknpIRBT-fNmlAXfS_Vw6wS43RS8OYzM1HL5lsU9ffdVyq7YqBUIo-a; thor=6901B38FCABE2222F893FE4DA6A41AD2E3C483C9683B39E7396B71698DCB11C14EC8CD85133AC917234988D59EE06B23F7FEF3328DD8ADAFC4EAB61C5186AE21E4701CF1263EB28EDD024710F49B0ECD72FD38E9917280EDE8E802A8F5CDEC75B3A323ADC1B43DFB4FB87AB43993FE1C74AFBCBF673834D99FD3094B90C3789565784C8BCE4E664302CF9229EC53115B; _vender_=TNK3O6PALVQGGMI642LJKJZPNN56IZEONGC7GL4VVDUXDFCCPPZQLPMTKJILMAPLE66HGX6H6FTDBCGJT2CHIQVGBEALDGQXK7G2A7QXSDNOYW6CAGCLDWEQCPKGC3KUGVRB646PDVLYUQI3BDJ566XYIWJK3BINEVNTZU4XPHS7MGPM3IRXP3KQCYUEFTMPHRWL6CUN7T6NJ73NKFWGRSQYITLV2HHO3WE5JGLOWXRT3TAPTQSGGNICGAJHKSRTNTSC54R6Q4CXGZB2XWZYYTWTKUI23OXFVXEK3PE6BHKXEXJ5ZBTE7AQ4DRO7SJ75N23E6IGHEDQCT72I5345J2I36SSU434I7P6CY7EB2AEQ7LYOCV7OPGUYC4YKELPF3MGRB5OZSQZPV5DBDCN2OVVT3WHFGAZIBXIZMBNTMAJCDBGXFURYZVWQPSCD3VDH4ZBLXMMUXPQJVVPYTHZOTYSQGOZPT3VJVDPGXA56A3LCJRUMD33LCTZXPFSMQ3XWZN2XCXEU377PYBSOJ5KDPWYFTXBCW4XVKE32CJKDJPI6QP6QVQYT5GF65B3DWLM6EW57FJQBO6Q762KFYJFVOUQ3HS27ZJL7T2BV2L72ABR2ZXET3GKM3JAUMD6LEL6M7JBTCI4GVDBYSZ7BSSE6PVI7NJIBQV5MVVI6CUJN7K7J2L4XHGOBDC35OONJCFTROGKKKV2WQVCB4JRYRBOMWGBWLI54R5PAXPC62DI; b-sec=H7A3ZVYOXG5O6CIG7HQL4J7UIHCOAOXSWXVJGQ6BOBAGYGTIVDEJSOPSWOPURFK5; _vender_new_=GI63BGTJFDBQ5VFYRAGXDIUTOUGBH4IELSA4HBAE7MB4S5HIL5QMHN2LMW7LKWD43YCKHJGXPJWTPRAEQ2QTFLJHKJUFHCXGGYIHCD7WSWY4PLU54NT3HGWB4MCDSKE4VJSCWBCJJ3C6Z2VI46TWP7ZJBWNTMPWIQ77NXK4VVKW6ABLW3LCTHZEYXQSC5L6SULQYZLAOLYQIKX2KPA4NEI5RHY4F2FAXI5CPTHP6BXFL757MRIFGERH2CQC2D3RAAFDYIVNI7B7NTLXWX5NEUT7IONYJQA2GVEUHKGHLAXO2JD6UI7C57LRQ4MAILLWECXYYZ2YLJ5HVL6HMAVKWPNRUQV7VQ4TJYKV2GUWP66XJIZDXBYZKDAO54T5BBWUA7DONKSVFDJCTNT7XV2KGI5YOGKQYDXPE7IINVADYCCF5H6RHZCCNDAPJ5WDJVY2XHWD7VVNICVT7PTKMSBW33L3BBSATV65XAXG72Z3QJ45MXA6IP2XQELXE7F47VC57UTM3EBWFRS7SWZCFQ5TPOT46JIQ6PNSYVA4453VSW4EAUWK6FRG3WAOQPSHG6BYFS7IG5ZCONS7EQAHSIUWPVDMBEDVBVCXW7ZSOG2U73QD4GGSJJ64QEOMY6A6GSGUVQ3LK46TGOU55INQYNJ63G3NK4M; universityLanguage=zh_CN; xue_userTypeCookieName50b60fba08fddfff319d0b5acc9d6eee=\"{\\\"1\\\":\\\"POP\\\"}\"; xue_userTypePageCookieName50b60fba08fddfff319d0b5acc9d6eee=1; _base_=YKH2KDFHMOZBLCUV7NSRBWQUJPBI7JIMU5R3EFJ5UDHJ5LCU7R2NILKK5UJ6GLA2RGYT464UKXAI4Z6HPCTN4UQM3WHVQ4ENFP57OC675CBWSP3REU42YTAQTNJUDXURTCNE6YVKRXISUFXTDU7V3U7QL2S3GKYL2ZCNGXSSG4SOQWCP5WPWO6EFS7HEHMRWVKBRVHB33TFD46QKR5DC3ZOXYJJSMQ7LPFV7Q42XNFW3B6USLKSP4DOKX736ZCQKMJCPUFAFUHXCAGBCJZTXPG55TUBDTGHQHRURVFNRRRQCPZ7EBOWHANCWVFJHFVSTEQXZ6XDSAY7EABH3APEXJ2C7MDIZP2K6O4UWVEXBLKE677BPFI2A; __jda=191429163.17036002655721718781778.1703600266.1703729497.1703749795.11; __jdc=191429163; _BELONG_CLIENT_=WPSC4XJXWK5USS4JNZY2X7VRLR5MCBKRSVHEXABGTHDGISIQK5YOLZUXYE7IOIM7MOKO74H6CRN6WHAAR4TMDV3XZWMXZRCRT5XRNE3V356BTOB2Y7LPK66VWQK6HPTGWVXIDXDCPVE3W5WMHAIO6AT2LX2XXVNUCXR34ZWFK6HY45CORGIKOSYDYZBF27WOKTUX6BS4FZMIJWNUX6CB4JAA25ZLF7ZEKYOO4QV5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BMTUJZACIBHXQFAVLRF76VQY5PNJGGJNBEZHSFYYJA3YORRT7FB5AHCOIFQKF3W5RWNUX6CB4JAA26JNMO7AYWNUPZF5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BWZDKMOJ5BS6II53ERY6ALV3ZWPF42L4CPUHEGPYIII35KDC4FCNVCORCXFD6IVNLBEDPB2GGP4UHWNRUDOQBDIW7RZJXBA2WV5ANZOTEGUCDWYRVQS2YUTIZNZ276PRYG4N56V6YTII7MBKBC7LYHO7C555HTSBXGNRM3E466AYN67DHWVM5HQFJ4NFDO5BSMLEHDIVX2QBZKIZSDNVQVV6ZDQ; __jdb=191429163.18.17036002655721718781778|11.1703749795; 3AB9D23F7A4B3C9B=OGIXHURWL4W2YOBLDZKWX2VSTPUXUVFYH3HXSX6VWZ4MSS2JDBQWZMFRLY5X3GAAGK5NRR2F5XYUYPKWK4MHQUTQLU",
              "cookie": cookies,
              "Referer": "https://porder.shop.jd.com/order/orderlist/suspend?t=1703826675241",
              "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": "{\"current\":1,\"pageSize\":10,\"sortName\":\"desc\",\"orderId\":\"\",\"skuName\":\"\",\"orderCreateDateRange\":[],\"orderCompleteDateRange\":[],\"receiverName\":\"\",\"receiverTel\":\"\",\"userPin\":\"\",\"skuId\":\"\",\"logiNo\":\"\",\"paymentType\":\"\",\"orderType\":\"\",\"orderSource\":\"\",\"deliveryType\":\"\",\"storeId\":\"\",\"huoHao\":\"\",\"orderStatusArray\":[],\"o2oStoreIds\":null,\"provinceIds\":[],\"orderTag\":null,\"selectedTabName\":\"suspend\"}",
          "method": "POST",
          "dataType": 'json'
      })
      if (res.data.code === 1001) {
        return false
      }
      return true
  } catch (e) {
      console.log('findStopOrder', '---')
      return {
          orderList: []
      }
  }

 }

 async getShopInfo() {
  const cookies = await this.getCodeCookie()
  const hc = new HttpClient();
  try {
      const result = await hc.request("https://i.shop.jd.com/optional/topMenu/overview?callback=jsonpCB_1703864564162_0hr4lix2mzgt&appName=jdos_porder-shop&menuId=1500&systemId=1", {
          "headers": {
              "accept": "*/*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
              "cache-control": "no-cache",
              "pragma": "no-cache",
              "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "script",
              "sec-fetch-mode": "no-cors",
              "sec-fetch-site": "same-site",
              "cookie": cookies,
              // "cookie": "__jdv=56585130|direct|-|none|-|1703600265575; pinId=Mk_A6Nbv7MenkDneLmJDcA; unick=%E5%86%B0%E5%86%B0%E5%B0%8F%E5%BA%97111; pin=%E5%86%B0%E5%86%B0%E5%B0%8F%E5%BA%97111; _tp=WWkrE5q1uaY3bnuvPN7mC0Jy7Qj98SqryFRfDnmAGXBfj3EZkqYEdCCNPQpAbAri; _pst=%E5%86%B0%E5%86%B0%E5%B0%8F%E5%BA%97111; __jdu=17036002655721718781778; 3AB9D23F7A4B3CSS=jdd03OGIXHURWL4W2YOBLDZKWX2VSTPUXUVFYH3HXSX6VWZ4MSS2JDBQWZMFRLY5X3GAAGK5NRR2F5XYUYPKWK4MHQUTQLUAAAAMMWCNULEAAAAAACOUKVNVUZZMDCUX; areaId=15; ipLoc-djd=15-1213-0-0; PCSYCityID=CN_330000_330100_0; language=zh_CN; smb_track=02DE91E68A90440681C0768B8C50A8BD; __USE_NEW_PAGEFRAME__=false; __USE_NEW_PAGEFRAME_VERSION__=v9; chat.jd.com=20170206; shshshfpb=AAiuCuLWMEpILfXnDP1RQdOco4vsSWBcDNClSUAAAAAA; QRCodeKEY=FC836460F1597075BD11887C4243E4A30E91A73D1DBCC75EEA63772BECCE94D89D2938D1818DA81A6C2501F503C01641; AESKEY=0EF530754B66CB9E; UIDKEY=102388463689062392; flash=2_IH1En_p4pwB7anzpN4g9YeEy6Cq8ndW6Gl4ZpRhSmLrJ3vp8VvF25G6kyptLLnI-5nsJ-ZlwdYkoPIncHUxs9ZmzBuYtJ21Mi-ReZGcdKmN*; TrackID=1tQ2ZaAoH6gQDGLIezMKIcWKp1ZonH3gP7yCOW311TyIqCWAL-VXhYZmVSowlStoC; thor=6901B38FCABE2222F893FE4DA6A41AD2EFBE1AE6D506095B2FAEDCEB50D6317CF4ED710E59A5BDC07B494EF3DEDA3AE77FF31FAE97C6939F67A9A90C4BB9533D6895B99957A61581CA0D1D092A6614CD5F6CE1A5E8216EFA2E7DC597CC1C9E9BDB25B69C9A9E8864B98C566DF2DFC030725042F0FEA51948BF9FA21D5D465EFDDC06968E1D3CA878812E3F9037676FEC; ceshi3.com=000; _vender_=TNK3O6PALVQGGMI642LJKJZPNN56IZEONGC7GL4VVDUXDFCCPPZQLPMTKJILMAPLXETACDXPW6K7OJOQKR2XAEWZEUALDGQXK7G2A7QXSDNOYW6CAGCPRLP5Z3NIZCHA4EL275ID7OHDWKJCG3IKWJEKBLKXNRBLHPI43M6V7YP2SC4RQRZXNIFA6PUCI7UIJYQMBTNIZIILXODG4AMBHU7KVXB7C3FVYYIDB6CNUJRIY3OXKRFOLJ5NJPZVGTXO3MGRB5OZSQZPUXK7OTV5QTIP7NLKLLY3WYJPC4VDZHQGTTOSIIB5LHCFEU46QULB2S23NQFGX3NFYRWZZ4RSVT5V5XCLCR6ORQNFC6Z6LN7AOMH5WXHCJZAENA6SMDSKCIYM3B25NWIYPAC4U3MBP2BDLJVVANWICDN6T6NZ5EU4TAACUTVVOVRLM6JTGYD7NX4IWYHATFWDNHVJJUNUDUHMVNYQT2FAZY4YIO2ZIMJX5UUINOJOE5UGJGNEXRP3LEVEOKPEKYZQTGIEMICOMRE5O6LV2SNJ2JIEFB6S7UW65Q4TE6WWMAOJYZN26OZVDWM5N6CVR2ER6YG3W4SVEC3KWSVM7MJTUZNQVYDSJGIVLO3MU25PV33A5NUN7KDRRNKGCEK4V6MSOXETOVWA664XIMTDRCC4ZMMDMWXRXDHQ7WUHLISPYU7RSWJYVDGDHNBIGEPD7YSQU; b-sec=H7A3ZVYOXG5O6CIG7HQL4J7UIHCOAOXSWXVJGQ7OXEFJWRMO6T445JWTKI3BCRCC; _base_=YKH2KDFHMOZBLCUV7NSRBWQUJPBI7JIMU5R3EFJ5UDHJ5LCU7R2NILKK5UJ6GLA2RGYT464UKXAI4Z6HPCTN4UQM3WHVQ4ENFP57OC675CBWSP3REU42YTAQTNJUDXURTCNE6YVKRXISUFXTDU7V3U7QL2S3GKYL2ZCNGXSSG4SOQWCP5WPWO6EFS7HEHMRWVKBRVHB33TFD46QKR5DC3ZOXYJJSMQ7LPFV7Q42XNFW3B6USLKSP4DOKX736ZCQKMJCPUFAFUHXCAGBCJZTXPG55TUBDTGHQHRURVFM7GAY55D5OEZS72URFS7BAH2G5EQXZ6XDSAY7EABH3APEXJ2C7MDIZP2K6O4UWVEXBLKE677BPFI2A; _BELONG_CLIENT_=WPSC4XJXWK5USS4JNZY2X7VRLR5MCBKRSVHEXABGTHDGISIQK5YOLZUXYE7IOIM7MOKO74H6CRN6WHAAR4TMDV3XZWMXZRCRT5XRNE3V356BTOB2Y7LPK66VWQK6HPTGWVXIDXDCPVE3W5WMHAIO6AT2LX2XXVNUCXR34ZWFK6HY45CORGIKOSYDYZBF27WOKTUX6BS4FZMIJWNUX6CB4JAA25ZLF7ZEKYOO4QV5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BMTUJZACIBHXQFAVLRF76VQY5PNJGGJNBEZHSFYYJA3YORRT7FB5AHCOIFQKF3W5RWNUX6CB4JAA26JNMO7AYWNUPZF5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BWZDKMOJ5BS6II53ERY6ALV3ZWPF42L4CPUHEGPYIII35KDC4FCNVCORCXFD6IVNLBEDPB2GGP4UHWNRUDOQBDIW7RZJXBA2WV5ANZOTEGUCDWYRVQS2YUTIZNZ276PRYG4N56V6YTII7MBKBC7LYHO7C555HTSBXGNRM3E466AYN67DHWVM5HQFJ4NFDO5BTFZDZIGJ4U53CZAYTLL4JRDKKAA; _vender_new_=GI63BGTJFDBQ5VFYRAGXDIUTOUGBH4IELSA4HBAE7MB4S5HIL5QMHN2LMW7LKWD43YCKHJGXPJWTPRAEQ2QTFLJHKJUFHCXGGYIHCD7HNPX7P53NJYJBLEQQWIG3SGOKANYJB4AHZAIO2L2TATYNMMFW2T7ATNFOZD4PRFANVIODWIGDFMXKRJ4I6UJ43SNLVNG3LECZBJRH7CNAV24UOKLAU3DX3TBTR5D36HX3PK3QE6SIHOTS432W6FB24YGMPFIXXWGFUD5N4OM5BGIAMJJTSTBINZ7M65V2STDONSMADD2X7KWKLUZTWX3YXOD6XLJPSELOEX5KVPUQJPFLEYACZTDLSK7COP6VUHF22L4RC3RF7KVL5ECLZKZGAAWMEI5HBNI3AHLGZG24ZAN4N7GAGWVI4ZDKBF7ZYJAPU6GHUX2BV7IT2ELA7PH3JOOEANSFTFAJTXVVKULEH4XATPV477XMOLCIYERGKGFXTPLTIGOEN5JDFRA2366QQO5FV2AT2XABQCAT4PRSM6IW44RRTC3OBHJXEAXD2I4FDTV2FPOYRS5HCDD4DBLC7FPXYSMCF5FO7EVNPE3L4QREKVCPKBOC6ZHI7S3X65CN5NLZUA4FQV26AUOUUBOMBMBA; __jda=191429163.17036002655721718781778.1703600266.1703826608.1703855791.17; __jdc=191429163; 3AB9D23F7A4B3C9B=OGIXHURWL4W2YOBLDZKWX2VSTPUXUVFYH3HXSX6VWZ4MSS2JDBQWZMFRLY5X3GAAGK5NRR2F5XYUYPKWK4MHQUTQLU; __jdb=191429163.72.17036002655721718781778|17.1703855791",
              "Referer": "https://porder.shop.jd.com/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": null,
          "method": "GET",
          'dataType': 'text'
      })
      console.log(result)
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = result.data.match(reg)
      if(matches){
          const ret = JSON.parse(matches[1])
          // matches[0]为整个字符串
          // matches[1]为匹配到的分组
          if (ret.shopSimpleVO) {
              // if (ret.shopSimpleVO.name) {
              //     this.shopInfo = ret.shopSimpleVO
              // }
          }
          console.log(ret.shopSimpleVO)
          return ret.shopSimpleVO
      }
      return result
  } catch (e) {
      return {}
  }
}
  
  /**
   * 获取窗口contents id
   */
  getWCid(args) {
    // 主窗口的name默认是main，其它窗口name开发者自己定义
    const name = args;
    const id = Addon.get('window').getWCid(name);

    return id;
  }

  /**
   * 加载扩展程序
   */
  // async loadExtension (args) {
  //   const crxFile = args[0];
  //   if (_.isEmpty(crxFile)) {
  //     return false;
  //   }
  //   const extensionId = path.basename(crxFile, '.crx');
  //   const chromeExtensionDir = chromeExtension.getDirectory();
  //   const extensionDir = path.join(chromeExtensionDir, extensionId);

  //   Log.info("[api] [example] [loadExtension] extension id:", extensionId);
  //   unzip(crxFile, extensionDir).then(() => {    
  //     Log.info("[api] [example] [loadExtension] unzip success!");
  //     chromeExtension.load(extensionId);
  //   });

  //   return true;
  // }

  /**
   * 创建系统通知
   */
  sendNotification(args, event) {
    const { title, subtitle, body, silent} = args;

    if (!Notification.isSupported()) {
      return '当前系统不支持通知';
    }

    let options = {};
    if (!_.isEmpty(title)) {
      options.title = title;
    }
    if (!_.isEmpty(subtitle)) {
      options.subtitle = subtitle;
    }
    if (!_.isEmpty(body)) {
      options.body = body;
    }
    if (!_.isEmpty(silent)) {
      options.silent = silent;
    }

    Services.get('os').createNotification(options, event);

    return true
  }  

  /**
   * 电源监控
   */
  initPowerMonitor(args, event) {
    const channel = 'controller.os.initPowerMonitor';
    powerMonitor.on('on-ac', (e) => {
      let data = {
        type: 'on-ac',
        msg: '接入了电源'
      }
      event.reply(`${channel}`, data)
    });

    powerMonitor.on('on-battery', (e) => {
      let data = {
        type: 'on-battery',
        msg: '使用电池中'
      }
      event.reply(`${channel}`, data)
    });

    powerMonitor.on('lock-screen', (e) => {
      let data = {
        type: 'lock-screen',
        msg: '锁屏了'
      }
      event.reply(`${channel}`, data)
    });

    powerMonitor.on('unlock-screen', (e) => {
      let data = {
        type: 'unlock-screen',
        msg: '解锁了'
      }
      event.reply(`${channel}`, data)
    });

    return true
  }  

  /**
   * 获取屏幕信息
   */
  getScreen(args) {
    let data = [];
    let res = {};
    if (args == 0) {
      let res = screen.getCursorScreenPoint();
      data = [
        {
          title: '横坐标',
          desc: res.x
        },
        {
          title: '纵坐标',
          desc: res.y
        },
      ]
      
      return data;
    }
    if (args == 1) {
      res = screen.getPrimaryDisplay();
    }
    if (args == 2) {
      let resArr = screen.getAllDisplays();
      // 数组，只取一个吧
      res = resArr[0];
    }
    // Log.info('[electron] [ipc] [example] [getScreen] res:', res);
    data = [
      {
        title: '分辨率',
        desc: res.bounds.width + ' x ' + res.bounds.height
      },
      {
        title: '单色显示器',
        desc: res.monochrome ? '是' : '否'
      },
      {
        title: '色深',
        desc: res. colorDepth
      },
      {
        title: '色域',
        desc: res.colorSpace
      },
      {
        title: 'scaleFactor',
        desc: res.scaleFactor
      },
      {
        title: '加速器',
        desc: res.accelerometerSupport
      },
      {
        title: '触控',
        desc: res.touchSupport == 'unknown' ? '不支持' : '支持'
      },
    ]

    return data;
  }

  /**
   * 获取系统主题
   */
  getTheme() {
    let theme = 'system';
    if (nativeTheme.shouldUseHighContrastColors) {
      theme = 'light';
    } else if (nativeTheme.shouldUseInvertedColorScheme) {
      theme = 'dark';
    }

    return theme;
  }

  /**
   * 设置系统主题
   */
  setTheme(args) {

    // TODO 好像没有什么明显效果
    nativeTheme.themeSource = args;

    return args;
  }  
}

OsController.toString = () => '[class OsController]';
module.exports = OsController;