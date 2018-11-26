const fs = require('fs')
const path = '/Users/wangguisong/Documents/my-test/vue/car_alliance/skeleton/_index.b8de7c7f34e5c0b59b5f55dc7bc82dd1.jpg'

let data = fs.readFileSync(path, 'base64')
let base64 = "data:image/jpg;base64,"  + data;

console.log(base64)