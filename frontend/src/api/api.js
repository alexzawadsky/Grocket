import axios from 'axios'

class Api {
    constructor() {
        this._api = axios.create({
            baseURL: 'http://127.0.0.1:5000'
        })
    }

    checkResponse(res) {
        return new Promise((resolve, reject) => {
            const data = res.json()
            console.log(data)
            if (200 <= res.status <= 299) {
                return resolve(data)
            } else {
                return reject(data)
            }
            // const func = res.status < 400 ? resolve : reject
            // res.json().then(data => func(data))
        })
    }

    statusToState(status) {
        return 200 <= status <= 299
    }

    login({ email, pwd }) {
        this._api.post('/signin', {
            email: email, password: pwd
        }).then(res => this.checkResponse(res)).catch(err => alert('Server error'))
    }

    register(name, lastName, email, pwd, setState) {
        this._api.post('/register', {
            name: name, last_name: lastName, email: email, password: pwd
        }).then((res) => setState(this.statusToState(res.status))).catch((err) => alert('error while register'))
    }

    toggleFavourite(productId, setState) {
        this._api.post('/set-favourite', {
            id: productId
        }).then((res) => setState(this.statusToState(res.status))).catch((err) => alert('error while toggle fav'))
    }
}

export default new Api()