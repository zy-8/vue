var baseURL = {

  // baseURL: '[#baseURL]',
  // waEnv: '[#waEnv]',
  // waUrl: '[#waUrl]',

  // 本地调试环境
  baseURL: 'http://localhost:8080',
  waEnv: 'test',
  waUrl: 'https://wa.test.webank.com',




  // // 测试环境  差异化配置值
  // baseURL:'https://testing-vdi.zdgzc.com',
  // waEnv: 'test',
  // waUrl:'https://wa.test.webank.com',



  //  // 生产环境  差异化配置值
  // baseURL:'https://vdi.zdgzc.com',
  // waEnv: 'cloud',
  // waUrl:'https://wa.webank.com',

  // waUrl:'https://datachain.qq.com/test/h',
  // waUrl:'https://datachain.qq.com/h',
 
}
baseURL.baseURL = window.location.origin ? window.location.origin : baseURL.baseURL


window.baseURL = baseURL





