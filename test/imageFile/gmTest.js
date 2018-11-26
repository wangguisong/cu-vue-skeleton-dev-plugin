const gm = require('gm')

gm(`${__dirname}/../../tmp/_.png`)
.gravity(10)
  .write(`${__dirname}/../../tmp/test.png`, e => {
    if (e) {
      console.log(e.message)
    } else {
      console.log('done')
    }
  })