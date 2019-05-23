module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/RollTheBones/' : '/',
  devServer: {
    port: 3030, // like del
    https: true
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/variables.scss";`
      }
    }
  }
}
