const { exec } = require('child_process')

let p = exec(`node ${__dirname}/../../src/ws/server.js`)

p.stdout.on('data', data => {
  console.log(data)
})

p.stderr.on('data', data => {
  console.error(data)
})

console.log('start')