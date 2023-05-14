const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    // publicPath: process.env.NODE_ENV === 'production' 
    //     ? '/grade_escolar_web_ts/' 
    //     : '/',
    publicPath: '/grade_escolar_web/',
    outputDir: 'docs'
})