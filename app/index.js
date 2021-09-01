const express = require('express')
const redis = require('ioredis')

const client = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'localhost'
})

const app = express()
const port = process.env.PORT || 3000

/* app.get('/', (req, res) => {
  console.log(req.headers['sec-ch-ua'])
}) */

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))


app.post('/', async (req, res) => {
  async function isOverLimit(ip) {
    let res
    try {
      res = await client.incr(ip)
    } catch (err) {
      console.error('could not increment key')
      throw err
    }

    console.log(`${ip} has value ${res}`)

    if (res > 5) {
      return true
    }
    client.expire(ip, 30)

  }
  // check rate limit
  let overLimit = await isOverLimit(req.ip)

  if (overLimit) {
    res.status(429).send('Too many requests - try again later')
    return
  }
  // allow access
  res.send("Resources accessed")
})


client.on('connect', function () {
  console.log('connected to redis');
});