var siteDes={
  // 新site需要添加的地方
  
  "beehive-alipay":{
    "siteDsp":"支付宝交易流水",
    "type":"digital",//取数码形式
    "appName":"支付宝APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 支付宝APP发送交易流水数据至此邮箱，成功收到后您将收到取数码短信，留意短信查收后前往下一步取数操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往支付宝账单页下载对应格式流水，`
      },
      {
        'header':`2、未收到取数码短信`,
        'content':`若您已确认成功发送流水至指定邮箱，<b>因受第三方平台下发流水时效性影响</b>，您的取数短信下发会对应延迟，请您持续关注短信列表`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟内仍未收到取数短信',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'alipays://platformapi/startapp?appId=20000003',
      'ios':'alipays://platformapi/startapp?appId=20000003'
    },
  },

  "beehive-spdb":{
    "siteDsp":"浦发银行交易流水",
    "type":"digital",//取数码形式
    "appName":"浦发银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 浦发银行手机银行APP，根据操作指引，发送交易流水数据至此邮箱，成功收到后您将收到取数码短信，留意短信查收后继续下一步操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 浦发银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到取数码短信`,
        'content':`若您已确认成功发送交易流水至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，或短信运营商发送时效性影响，可能略有延迟，请您持续关注短信通知`,
                   
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后仍未收到取数码短信',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'spdbbank://wap.spdb.com.cn://',
      'ios':'spdbbank://wap.spdb.com.cn://'
    },
  },
 
  "beehive-ewallet":{
    "siteDsp":"电子票夹医疗票据",
    "type":"digital",//取数码形式
    "appName":"微信APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往微信支付下载微信电子票夹医药票据至此邮箱，成功收到后您将收到取数码短信，留意短信查收后前往下一步取数操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往微信医疗票夹下载对应格式流水，`
      },
      {
        'header':`2、未收到取数码短信`,
        'content':`若您已确认成功发送流水至指定邮箱，<b>因受第三方平台下发流水时效性影响</b>，您的取数短信下发会对应延迟，请您持续关注短信列表`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟内仍未收到取数短信',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'weixin://',
      'ios':'weixin://'
    },
  },

  "beehive-pabc":{
    "siteDsp":"平安银行交易流水",
    "type":"digital",//取数码形式
    "appName":"平安银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 平安银行手机银行APP，根据操作指引，发送交易流水数据至此邮箱，成功收到后您将收到取数码短信，留意短信查收后继续下一步操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 平安银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到取数码短信`,
        'content':`若您已确认成功发送交易流水至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，或短信运营商发送时效性影响，可能略有延迟，请您持续关注短信通知`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后仍未收到取数码短信',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'paesuperbank://',
      'ios':'paesuperbank://'
    },
  },

  'beehive-cmbc':{
    'siteDsp': '民生银行交易明细',
    'type': 'digital',
    'appName': '民生银行手机银行APP',
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 民生银行手机银行APP，根据操作指引，发送交易明细数据至此邮箱，成功收到后您将收到取数码短信，留意短信查收后继续下一步操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 民生银行手机银行app下载对应格式明细`
      },
      {
        'header':`2、未收到取数码短信`,
        'content':`若您已确认成功发送交易明细至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，或短信运营商发送时效性影响，可能略有延迟，请您持续关注短信通知`,
                        
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后仍未收到取数码短信',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'cmbc://qd.mbank://',
      // 'android':'cmsb:cmbc://qd.mbank://',
      'ios':'cmbc://qd.mbank://',
      // 'ios':'cmsb:cmbc://qd.mbank://',
      // 'ios':'cmsb:com.cmbc.cn.ihone://',
    },
  },

  'beehive-bcm':{
    'siteDsp': '交通银行交易明细',
    'type': 'digital',
    'appName': '交通银行手机银行APP',
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 交通银行手机银行APP，根据操作指引，发送交易明细数据至此邮箱，成功收到后您将收到取数码短信，留意短信查收后继续下一步操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 交通银行手机银行APP下载对应格式明细，`
      },
      {
        'header':`2、未收到取数码短信`,
        'content':`若您已确认成功发送交易明细至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，或短信运营商发送时效性影响，可能略有延迟，请您持续关注短信通知`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后仍未收到取数码短信',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'bocom://',
      'ios':'bocom://'
    },
  },
  
  "beehive-wechatpay":{
    "siteDsp":"微信支付交易明细",
    "type":"decode",//解压码码形式
    "appName":"微信APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往微信支付下载交易明细数据至此邮箱，请留意微信支付公众号发送的解压码后前往下一步取数操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往微信支付账单页下载对应格式流水`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易明细至指定邮箱，因受时效性影响，您的解压码会在微信支付公众号下发，请您持续关注微信首页消息通知`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟内仍未收到解压码',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'weixin://',
      'ios':'weixin://'
    },
  },


  "beehive-ccb":{
    "siteDsp":"中国建设银行交易明细",
    "type":"decode",//解压码码形式
    "appName":"中国建设银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 建设银行手机银行APP，根据操作指引，发送交易明细数据至此邮箱，请查询APP申请记录中对应的解压码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 中国建设银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易明细至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码（解压密码）在您银行app明细申请的申请记录内查看，请您查收解压码（解压密码）后在继续流程。`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':`我在银行APP发送流水后找不到对应解压码（解压密码）`,
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'ccbapp://main.ccb.com://',
      'ios':'ccbapp://main.ccb.com://'
    },
  },

  "beehive-abc":{
    "siteDsp":"中国农业银行交易明细",
    "type":"decode",//解压码码形式
    "appName":"中国农业银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 中国农业银行手机银行APP，根据操作指引，发送交易明细数据至此邮箱，请查询APP申请记录中对应的解压码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 中国农业银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易明细至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码在您银行app明细申请的申请记录内查看，请您查收解压码后在继续流程。`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':`我在银行APP发送流水后找不到对应解压码（解压密码）`,
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'bankabc://',
      'ios':'bankabc://'
    },
  },

  "beehive-cmb":{
    "siteDsp":"招商银行交易流水",
    "type":"decode",//解压码码形式
    "appName":"招商银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 招商银行手机银行APP，根据操作指引，发送交易流水数据至此邮箱，请查询APP申请记录中对应的文件密码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 招商银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易流水至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码在您银行APP流水打印-申请记录内查看，请您查收解压码后在继续流程`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':'我在银行APP发送流水后找不到对应解压码',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'cmbmobilebank://',
      'ios':'cmbmobilebank://'
    },
  },


  "beehive-icbc":{
    "siteDsp":"中国工商银行历史明细",
    "type":"decode",//解压码码形式
    "appName":"中国工商银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 中国工商银行手机银行APP，根据操作指引，发送历史明细数据至此邮箱，请查询APP申请记录中对应的文件密码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 中国工商银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送历史明细至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码（文件密码）在您银行APP历史明细打印的订单详情内查看，请您查收解压码（文件密码）后在继续流程`,
      },
      {
        'header':`3、若下载时选择不加密文件是否可以？`,
        'content':`为保障您的数据安全，请参考指引，下载时默认勾选文件加密，通过银行APP历史明细打印的订单详情中对应的文件密码来进行取数，若您开具非加密数据，则会出现“暂无可用邮件”提示`
      }
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':`我在银行APP发送流水后找不到对应解压码（解压密码）`,
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'com.icbc.androidclient://',
      'ios':'com.icbc.iphoneclient://'
    },
  },

  "beehive-gdb":{
    "siteDsp":"广发银行交易流水",
    "type":"decode",//解压码码形式
    "appName":"广发银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 广发银行手机银行APP，根据操作指引，发送交易流水数据至此邮箱，请查询APP申请记录中对应的文件密码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 广发银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易流水至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码在您银行APP流水打印-申请记录内查看，请您查收解压码后在继续流程`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':'我在银行APP发送流水后找不到对应解压码',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'cgb://lua/openxml://',
      'ios':'cgb://lua/openxml://'
    },
  },

  "beehive-citicb":{
    "siteDsp":"中信银行交易流水",
    "type":"decode",//解压码形式
    "appName":"中信银行手机银行APP",
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 中信银行手机银行APP，根据操作指引，发送交易流水数据至此邮箱，请查询APP申请记录中对应的文件密码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 中信银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易流水至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码在您银行APP我的证明-交易流水证明内查看，请您查收解压码后在继续流程`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':'我在银行APP发送流水后找不到对应解压码',
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'wakeupciticmobilebank://splashActivity:8899/citicbank',
      'ios':'citicbankpay://unionPay:8899://'
    },
  },



  'beehive-boc': {
    'siteDsp': '中国银行交易流水',
    'type': 'decode',
    'appName': '中国银行手机银行APP',
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 中国银行手机银行APP，根据操作指引，发送交易流水数据至此邮箱，请查询APP申请记录中对应的打开密码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 中国银行手机银行APP下载对应格式流水，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送交易流水至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码（打开密码）在您银行app交易流水打印的申请记录内查看，请您查收解压码（打开密码）后在继续流程`,
      },
      {
        'header':`3、如何下载一年交易流水`,
        'content':`因中国银行官方下载流水的最长时间跨度不能大于6个月，所以当次提交仅支持下载半年流水。若您想下载一年流水，请分开下发操作两次`
      }
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':`我在银行APP发送流水后找不到对应解压码（解压密码）`,
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'boc://com.chinamworld.bocmbci/startWith',
      // 'android':'bocmbciphone://h5',
      // 'android':'bocmbciphone://h5://',
      'ios':'bocmbciphone://',
      // 'ios':'bocmbciphone://h5',
      // 'ios':'bocmbciphone://h5://',
      // 'ios':'BOCMBCIphone://app',
    },
  },


  'beehive-czb':{
    'siteDsp': '浙商银行账户明细',
    'type': 'decode',
    'appName': '浙商银行手机银行APP',
    "orgFullName":'成都市中大公证处已为您生成专属邮箱',
    "handleIntroduce":`请复制邮箱地址去往 浙商银行手机银行APP，根据操作指引，发送账户明细数据至此邮箱，请查询APP申请记录中对应的文件密码后点击下方按钮继续操作。`,
    "Qlist": [
      {
        'header':`1、未使用正确邮箱发送流水`,
        'content':`前往 浙商银行手机银行APP下载对应格式明细，`
      },
      {
        'header':`2、未收到解压码`,
        'content':`若您已确认成功发送账户明细至指定邮箱，<b>因受第三方发送邮件时效性影响</b>，可能略有延迟，您的解压码在您银行APP电子账单发送-申请记录内查看，请您查收解压码后在继续流程`,
      },
    ],
    "Alist": [
      {
        'code':10000,
        'desc':'已解决'
      },
      {
        'code':10001,
        'desc':'未解决',
        'children':[
          {
            'code':10001,
            'desc':'发送流水时提示邮箱格式错误',
          },
          {
            'code':10002,
            'desc':'成功发送流水后，5分钟后重试，仍提示无可用邮件',
          },
          {
            'code':10003,
            'desc':`我在银行APP发送流水后找不到对应解压码`,
          },
          {
            'code':10010,
            'desc':'其他',
          }
        ]
      }
    ],
    "pathUrl":{
      'android':'smsczbmbank://push_czbank://',
      'ios':'smsczbmbank://push_czbank://'
    },
  },
}

module.exports = {
  siteDes:siteDes
}