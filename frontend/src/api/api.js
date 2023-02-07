import axios from 'axios'

class Api {
    constructor() {
        this._api = axios.create({
            baseURL: ''
        })
    }

    toggleFavourite(productId) {
        console.log(productId, 'fav toggle')
        // this._api.post('/')
    }
}

export default new Api()