import { makeFrontendPath, makeServerPath } from './utils.js'

class Model {
    constructor(token) {
        this.$sDomain = document.getElementById('server')
        this.$sProtocol = document.getElementById('server-TLS')
        this.$fDomain = document.getElementById('frontend')
        this.$fProtocol = document.getElementById('frontend-TLS')
        this.token = token
    }

    get sDomain() { return this.$sDomain.value }
    get fDomain() { return this.$fDomain.value }
    get sProtocol() { return this.$sProtocol.checked === true ? 'https' : 'http' }
    get fProtocol() { return this.$fProtocol.checked === true ? 'https' : 'http' }
    get serverURI() { return `${this.sProtocol}://${this.sDomain}` }
    get frontendURI() { return `${this.fProtocol}://${this.fDomain}` }

    getData() {
        return this.fetchRawReports()
            .then(reports => reports.map(({
                numReports, code, parentType, questionID, reviewID, commentID, title, body
            }) => ({
                parentType,
                numReports,
                code,
                title,
                body,
                apiLink: `${this.serverURI}/${makeServerPath(code, parentType, questionID, reviewID, commentID)}`,
                link: `${this.frontendURI}/${makeFrontendPath(code, parentType, questionID, reviewID, commentID)}`
            })))
    }

    fetchRawReports() {
        const url = `${this.serverURI}/api/uni/reports`
        return fetch(url,
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            })
            .then((res) => res.json())
    }

    deleteReports(locations) {
        return Promise.all(
            locations.map(loc => fetch(loc, {
              headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                  },
              method: 'DELETE'
            })))
    }
}

export default Model
