import * as Api from 'lib/utils/apiUtils';

const basePath = "neighbourhoods";

export function getAllNeighbourhoods() {
    let url = Api.buildApiUrl(`${basePath}`);
    console.log(url);
    return Api.getData(url);
}

export function getNeighbourhoodById(id) {
    let url = Api.buildApiUrl(`${basePath}/${encodeURIComponent(id)}`);
    return Api.getData(url);
}

export function getRecentCrimes(id, page = 1) {
    let url = Api.buildApiUrl(`${basePath}/${encodeURIComponent(id)}/recentCrimes?page=${page}`);
    return Api.getData(url);
}
