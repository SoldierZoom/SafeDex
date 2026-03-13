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

export function addNeighbourhood(formData) {
    let url = Api.buildApiUrl(`${basePath}`);
    return Api.putData(url, formData);
}
