import * as Api from 'lib/utils/apiUtils';

const basePath = "properties";

export function getPropertiesPage(pageNumber) {
    let url = Api.buildApiUrl(`${basePath}?page=${pageNumber}`);
    console.log(url);
    return Api.getData(url);
}

export function getPropertyById(id) {
    let url = Api.buildApiUrl(`${basePath}/${encodeURIComponent(id)}`);
    return Api.getData(url);
}