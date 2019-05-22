module.exports = {
  devServer: {
    port: 3030,
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
