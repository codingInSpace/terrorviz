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
      res.json(incident)
    })
    .catch(e => console.error(e));


}

// Get year
function getYear(req, res) {
  const year = parseFloat(req.params.y);
  Incident.getYear(year)
    .then(incidents => res.json(incidents))
    .catch(e => console.error(e));
}

export default {
  list,
  test,
  getYear
}