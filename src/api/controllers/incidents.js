import Incident from '../models/incident'

// List items
function list(req, res) {
  Incident.list(100)
    .then(incidents => res.json(incidents))
    .catch(e => console.error(e));
}

// Test
function test(req, res) {
  Incident.testGetOne()
    .then(incident => {
      console.log(incident)
      res.json(incident)
    })
    .catch(e => console.error(e));
}

export default {
  list,
  test
}