import dbContainer from '../db'
const db = new dbContainer()

// List items
function list(req, res) {
  const limit = parseFloat(req.params.limit) || 10000
  db.incidents.find().limit(limit).toArray((err, data) => {
    if (err) console.error(err)
    res.json(data)
  })
}

// Test
function test(req, res) {
  db.incidents.find({
    'qeventid': 201512310037
  })
  .toArray((err, data) => {
    if (err) console.error(err)
    res.json(data)
  })
}

function getYear(req, res) {
  const year = parseFloat(req.params.y)
  db.incidents.find({'iyear': year}).toArray((err, data) => {
    if (err) console.error(err)
    res.json(data)
  })
}

export default {
  list,
  test,
  getYear
}