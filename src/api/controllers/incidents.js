import dbContainer from '../db'
const db = new dbContainer()

// List items
function list(req, res) {
  const limit = parseFloat(req.params.limit) || 1000000
  db.incidents.find().limit(limit).toArray()
    .then(results => {
      res.json(results)
    })
    .catch(reason => {
      console.error(reason)
    })
}

// Test
function test(req, res) {
  db.incidents.find({
    'qeventid': 201512310037
  })
    .toArray()
    .then(data => {
      res.json(data)
    })
    .catch(reason => {
      console.error(reason)
    })
}

function getYear(req, res) {
	console.log('get year')
  const year = parseFloat(req.params.y)
  db.incidents.find({'iyear': year})
    .toArray()
    .then(data => {
      res.json(data)
    })
    .catch(reason => {
      console.error(reason)
    })
}

export default {
  list,
  test,
  getYear
}
