const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})


let proxyObj = {}

proxyObj['/'] = {
    //websocket
    ws: false,
    //后台服务地址
    target: 'http://localhost:8888',
    //发送请求头中host会设置成target
    changeOrigin: true,
    //不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}


module.exports = {
    devServer: {
        host: '0.0.0.0',
        // host: 'localhost',
        port: 8088,
        // port: 55037,
        proxy: proxyObj
    }
}
