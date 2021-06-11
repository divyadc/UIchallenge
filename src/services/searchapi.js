import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com',
});

// const getAPI = (params) => {
//     let url = process.env.PUBLIC_GIT_URL + process.env.GET_DATA_WITH_SEARCH;
// }

export default api;
