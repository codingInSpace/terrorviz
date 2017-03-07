/**
 * Show a card with detailed information of a cluster
 */
class ClusterInfoBox {
  constructor() {
    this.domElement = document.querySelector('#cluster-info-card')
    this.contentElement = document.querySelector('#cluster-info-text')
  }

  show(data) {
    console.log(data)
    this.data = data

    const content = `
      Incidents: ${data.amountIncidents} <br/>
      Fatalities: ${data.amountFatalities} <br/>
    `

    this.contentElement.innerHTML = content
    this.domElement.style.display = 'block'
  }

  hide() {
    this.domElement.style.display = 'none'
  }
}

export default ClusterInfoBox