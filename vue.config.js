module.exports = {
  filenameHashing: false,
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
