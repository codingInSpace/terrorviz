import mongoose from 'mongoose'

/**
 * Get all incidents in db
 */
function getAll(req, res) {
  mongoose.model('Incident').find({}, (err, incidents) => {
    if (err) return console.error(err)

    console.log('incidents length')
    console.log(incidents.length)

    res.json(incidents)
  })
}

export default {
  getAll,
}