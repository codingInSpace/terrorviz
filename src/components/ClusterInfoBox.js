/**
 * Show a card with detailed information of a cluster
 */
class ClusterInfoBox {
  constructor(clearBoxData) {
    this.clearBoxData = clearBoxData
    this.domElement = document.querySelector('#cluster-info-card')
    this.contentElement = document.querySelector('#cluster-info-text')
    this.closeButton = document.querySelector('#cluster-info-close')

    this.closeButton.addEventListener('click', () => {
      this.clearBoxData()
      this.hide()
    })
  }

  show(data) {
    this.data = data

    const content = `
      Incidents: ${data.numberOfPoints} <br/>
      Fatalities: ${data.fatalities} <br/>
    `

    this.contentElement.innerHTML = content
    this.domElement.style.display = 'block'
  }

  hide() {
    this.domElement.style.display = 'none'
  }
}

export default ClusterInfoBox