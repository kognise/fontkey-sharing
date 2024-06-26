const S1 = require('s1db')
const store = new S1(process.env.S1_TOKEN)

const uid = require('uid-promise')
const concat = require('concat-stream')
const app = require('express')()

app.use((req, res, next) => {
  req.pipe(concat((data) => {
    req.body = data.toString()
    next()
  }))
})

app.get('/', (req, res) => {
  res.redirect('https://fontkey.kognise.dev')
})

app.post('/', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (!req.body) return res.sendStatus(400)

  const id = await uid(10)
  await store.set(id, req.body)
  res.send(`https://fk.kognise.dev/${id}`)
})

app.get('/:id', async (req, res) => {
  const query = await store.get(req.params.id)
  if (query) {
    console.log('Regular store')
    res.redirect(`https://fontkey.kognise.dev/app${query}`)
  } else {
    console.log('No store')
    return res.sendStatus(404)
  }
})

app.listen(() => console.log('Listening'))

module.exports = app