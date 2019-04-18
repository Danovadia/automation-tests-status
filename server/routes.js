class Routes {
  constructor({ router }) {
    this.router = router;
  }

  init() {
    // this.router.get('/data', (req, res, next) => {
    //     res.setHeader('Content-Type', 'application/json');
    //     return res.send('tests')
    // });
  }
}

module.exports = Routes;