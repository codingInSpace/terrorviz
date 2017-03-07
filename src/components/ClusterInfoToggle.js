/**
 * Toggle to control whether to show clickable cirles instead of clusters or just clusters
 */
class ClusterInfoToggle {

  /**
   * Constructor
   * @param {function} setActive - function to set active
   * @param {function} setInactive - function to set inactive
   * @param {bool} state - current state, true or false
   */
  constructor(setActive, setInactive, state) {
    this.state = state
    this.domElement = document.querySelector('#cluster-info-toggle-input')
    console.log(state)

    this.domElement.addEventListener('change', () => {
      return this.getState() === true ? setInactive() : setActive()
    })
  }

  setState(state) {
    this.state = state
  }

  getState() {
    return this.state
  }
}

export default ClusterInfoToggle