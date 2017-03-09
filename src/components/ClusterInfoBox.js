/**
 * Show a card with detailed information of a cluster
 */
class ClusterInfoBox {

  /**
   * Constructor
   * @param {Function} clearBoxData - Function to clear box data in redux store
   */
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

  /**
   *
   * @param {Object} data - data to display in box
   * @param data.numberOfPoints - Number of terrorist incidents that occurred in cluster
   * @param data.fatalities - Number of fatalities that occurred in cluster
   * ...
   */
  show(data) {
    this.data = data

    const content = `
      Incidents: ${data.numberOfPoints} <br/>
      Fatalities: ${data.fatalities} <br/>
    `

    this.contentElement.innerHTML = content
    this.domElement.style.display = 'block'
  }

  /**
   * Hide box
   */
  hide() {
    this.domElement.style.display = 'none'
  }
}

export default ClusterInfoBox