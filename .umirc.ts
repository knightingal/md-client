import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  routes: [
    {
      path: '/md-page',
      component: '../layouts/mdpage',
      routes:[
        {path:'/md-page/', component:'../pages/register'},
        {path:'/md-page/terminal-list', component:'../pages/terminalList'},
        {path:'/md-page/msg-recv', component:'../pages/msgRecv'}
      ]
    },
    {
      path: '/flow1000',
      component: '../layouts/flow1000',
      routes:[
        {path:'/flow1000/', component:'../pages/flow1000/sectionList'},
        {path:'/flow1000/sectionContent/', component:'../pages/flow1000/sectionContent'}
      ]
    },
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' }
      ]
    },
  ],
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/local1000/': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/tarsylia_resources/': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true,
      },
      '/static/': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true,
      },
      '/message/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false,
      },
      '/web-socket/': {
        target: 'ws://127.0.0.1:8080',
        changeOrigin: false,
        ws:true
      }
    },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: true,
      dynamicImport: false,
      title: 'sim-client-front',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
