import dbContainer from '../db'
const db = new dbContainer()

function getYear(req, res) {
	console.log('get year')
  const year = parseFloat(req.params.y)
  db.incidents.find({'iyear': year})
    .toArray()
    .then(data => {
      return res.json(data)
    })
    .catch(reason => {
      console.error(reason)
    })
}

function getYears(req, res) {
  const years = req.body.rangeToGet

  if (!years)
    return res.json([{status: 500, msg: 'Undefined input'}])

  db.incidents.find({
    'iyear': { '$in': years }
  })
    .toArray()
    .then(data => {
      return res.json(data)
    })
    .catch(reason => {
      console.error(reason)
    })
}

function getYearRange(req, res) {
  const years = req.params.range

  if (years.length > 8)
    return res.json([{status: 500, msg: 'Bad input'}])

  const year1 = parseFloat(years.slice(0, 4))
  const year2 = parseFloat(years.slice(4, 8))

  db.incidents.find({
    'iyear': { '$gte': year1, '$lte': year2 }
  })
    .toArray()
    .then(data => {
      return res.json(data)
    })
    .catch(reason => {
      console.error(reason)
    })

}

export default {
  getYear,
  getYears,
  getYearRange
}
