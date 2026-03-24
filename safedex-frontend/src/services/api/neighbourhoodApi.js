import * as Api from 'lib/utils/apiUtils';

const basePath = "neighbourhoods";

export function getAllNeighbourhoods() {
    let url = Api.buildApiUrl(`${basePath}`);
    return Api.getData(url);
}

export function getNeighbourhoodById(id) {
    let url = Api.buildApiUrl(`${basePath}/${encodeURIComponent(id)}`);
    return Api.getData(url);
}
