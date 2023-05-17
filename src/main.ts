import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from "vue-axios"

const app = createApp(App)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)

axios.interceptors.request.use(
    config => {
        let access_token = localStorage.getItem('access_token');
        if (access_token)
            config.headers.Authorization = `Bearer ${access_token}`;
        
        return config;
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(
    value => value, 
    error => {
        if(error.response.status == 422 || error.response.status == 401){
            console.log(error.response.status);
            localStorage.removeItem('access_token');
        }
            
        
        return Promise.reject(error);
    }
)

app.mount('#app')