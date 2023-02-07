import axios from 'axios'

class Api {
    constructor() {
        this._api = axios.create({
            baseURL: ''
        })
    }

    statusToState(status) {
        return 200 <= status <= 299
    }

    login(email, pwd, setState) {
        this._api.post('/auth', {
            email: email, password: pwd
        }).then((res) => setState(this.statusToState(res.status))).catch((err) => alert('error occured while logging in'))
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