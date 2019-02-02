import Authenticator from './auth.js'
import Model from './model.js'
import View from './view.js'

let app = null

// setup
const Auth = new Authenticator(() => {
  const [authContainer, ...others] = document.querySelectorAll('.container')
  authContainer.classList.add('hide')
  others.forEach(container => {
    container.classList.remove('hide')
  })

  if (!app) {
    app = new App(new Model(Auth.token), new View())
  }
})

class App {
  constructor(model, view) {
    this.model = model
    this.view  = view
    window.addEventListener('click', ({target}) => {
      if (target.dataset && target.dataset.button) {
        const action = target.dataset.button
        this[action]()
      }
    })
  }

  get() {
    console.info('Fetching data...')
    this.model.getData()
      .then(data => this.view.renderTable(data))
  }

  delete() {
    const rows = [...this.view.$root.querySelectorAll('tr')]
    const toDelete = [...this.view.$root.querySelectorAll('input[type="checkbox"]')]
      .filter(row => row.checked)
      .map(row => rows[row.dataset.delete].dataset.location)

    // check if you really wanna delete them
    if (!confirm(`Delete ${toDelete.length} posts?`)) return;

    this.model.deleteReports(toDelete)
      .then(() => this.get())
  }

}
