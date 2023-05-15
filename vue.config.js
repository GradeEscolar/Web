const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production' 
        ? '/grade_escolar_web_ts/' 
        : '/',
    outputDir: 'docs'
})