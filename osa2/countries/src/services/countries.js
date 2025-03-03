import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/"
const allUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"
const finalnd = "https://studies.cs.helsinki.fi/restcountries/api/name/finland"


const getAll = () => {
    const request = axios.get(allUrl)
    return request.then(response => {
        return response.data
    })
}

export default {getAll}