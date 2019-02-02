const googleApiUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyANscpcUrt-ECaX8lqu3vQTtEyggcZ_7X4'
const emailKey = 'email'
const passwordKey = 'password'

class Authenticator {
    constructor(callback) {
        this.isLoggedIn = false
        this.callback = callback

        if (window.localStorage) {
            this.email = localStorage.getItem(emailKey)
            this.password = localStorage.getItem(passwordKey)
        }

        this.$email = document.getElementById('email')
        this.$password = document.getElementById('password')
        this.$loginButton = document.getElementById('login')
        this.$message = document.getElementById('login-message')
        this.$loginButton.addEventListener('click', this.loginByForm.bind(this))

        if (this.email && this.password) {
            // attempt auto login from previous creds
            this.login(this.email, this.password, callback)
        }
    }

    loginByForm() {
        const email = this.$email.value
        const pass = this.$password.value

        if (!(email && pass)) {
            this.$message.textContent = 'Credentials Required'
            return;
        }

        // valid
        return this.login(email, pass)
            .catch((err) => {
                this.$message.textContent = err
            })
    }

    // returns promise
    login(email, password) {
        console.info('Attempting login as..', email)
        return fetch(googleApiUrl,
            {
                credentials: 'omit',
                headers: {},
                referrer: 'https://admin.smartcourse.me',
                referrerPolicy: 'no-referrer-when-downgrade',
                body: `{'email':'${email}','password':'${password}','returnSecureToken':true}`,
                method: 'POST',
                mode: 'cors'
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    throw Error(data.error.message)
                }
                this.token = data.idToken
            })
            .then(() => this.handleSuccess(email, password))
    }

    handleSuccess(email, password) {
        console.info('Successfully logged in.')
        this.$message.textContent = 'Success'

        if (window.localStorage) {
            localStorage.setItem(emailKey, email)
            localStorage.setItem(passwordKey, password)
        }

        this.isLoggedIn = true

        setTimeout(this.callback, 100)
    }
}

export default Authenticator