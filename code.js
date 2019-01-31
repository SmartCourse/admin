// auth token
let token = ''
// api locations to all reported posts - for deleting and querying
let apiLocations = []

function login() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  firebaseLogin(email, password)
    .then(()=>{ document.getElementById("login-message").innerHTML = "success" })
    .catch((e)=>{ document.getElementById("login-message").innerHTML = e })
}

function firebaseLogin(email, password) {
  return fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyANscpcUrt-ECaX8lqu3vQTtEyggcZ_7X4',
    {
        'credentials': 'omit',
        'headers': {},
        'referrer': 'http://localhost:8080/login',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': `{"email":"${email}","password":"${password}","returnSecureToken":true}`,
        'method': 'POST',
        'mode': 'cors'
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw Error(data.error.message)
      }
      token = data.idToken
    })
}

function makeFrontendPath(code, parentType, questionID, reviewID, commentID) {
  // note that currently in the frontend there's no way to view an individual comment, so we just link to the parent
  const [ parentParentType, parentParentID ] = questionID ? [ 'question', questionID ] : [ 'review', reviewID ]
  return `course/${code}/${parentParentType}/${parentParentID}`
}

function makeServerPath(code, parentType, questionID, reviewID, commentID) {
  const [ parentParentType, parentParentID ] = questionID ? [ 'question', questionID ] : [ 'review', reviewID ]
  if (parentType === 'comment') {
    const commentType = questionID ? 'answer' : 'reply'
    return `api/course/${code}/${parentParentType}/${parentParentID}/${commentType}/${commentID}`
  }
  return `api/course/${code}/${parentParentType}/${parentParentID}`
}

function getReports() {
  // get server info from form
  const sDomain = document.getElementById("server").value
  const sProtocol = document.getElementById("server-TLS").checked === true ? 'https' : 'http'
  const serverURI = `${sProtocol}://${sDomain}`
  const fDomain = document.getElementById("frontend").value
  const fProtocol = document.getElementById("frontend-TLS").checked === true ? 'https' : 'http'
  const frontendURI = `${fProtocol}://${fDomain}`

  // populate table
  fetchReports(serverURI).then((reports)=> {

    const reportsNode = document.getElementById("reports")

    reports.forEach(({ numReports, code, parentType, questionID, reviewID, commentID, title, body }, i) => {
      const linkToPost = `${frontendURI}/${makeFrontendPath(code, parentType, questionID, reviewID, commentID)}`
      const row = document.createElement('tr')

      row.innerHTML = `<td><input type="checkbox" id="row-${i}"></td>
        <td>${numReports}</td>
        <td>${parentType}</td>
        <td>${code}</td>
        <td class="text-row"><a href="${linkToPost}" target="_blank">${title}</a></td>
        <td class="text-row">${body}</td>`

      reportsNode.appendChild(row)

      const apiLocation = `${serverURI}/${makeServerPath(code, parentType, questionID, reviewID, commentID)}`
      apiLocations.push(apiLocation)
    })
  })

}

function fetchReports(serverURI) {
  const url = `${serverURI}/api/uni/reports`
  return fetch(url,
      {
        'headers': {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
    .then((res) => res.json())
}

function deleteChecked() {
  locations = []
  for (let i = 0; i < apiLocations.length; ++i) {
    if (document.getElementById(`row-${i}`).checked) {
      locations.push(apiLocations[i])
    }
  }
  if (!confirm(`Delete ${locations.length} posts?`)) return;
  let succeeded = 0
  let failed = 0
  Promise.all(locations.map(loc => fetch(loc, {
    'headers': {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
    'method': 'DELETE'
  }))).then(responses => responses.map(result => {
    if (result.ok) {
      succeeded++
    } else {
      failed++
    }
  })).then(()=>alert(`${succeeded} succeeded, ${failed} failed`))
}
