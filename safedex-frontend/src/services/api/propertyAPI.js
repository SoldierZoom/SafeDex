import * as Api from 'lib/utils/apiUtils';

const basePath = "properties";

function buildFilterQuery(pageNumber,query,minPrice,maxPrice,minSafetyScore,minBedrooms,maxBedrooms,minBathrooms,maxBathrooms,houseTypes,sortBy,order) {
    let filters = [];
    
    if (pageNumber) {
        filters.push(`page=${pageNumber}`);
    }
    if (query) {
        filters.push(`query=${encodeURIComponent(query)}`);
    }
    if (minPrice !== null) {
        filters.push(`minPrice=${minPrice}`);
    }
    if (maxPrice !== null) {
        filters.push(`maxPrice=${maxPrice}`);
    }
    if (minSafetyScore !== null) {
        filters.push(`minSafetyScore=${minSafetyScore}`);
    }
    if (minBedrooms !== null) {
        filters.push(`minBedrooms=${minBedrooms}`);
    }
    if (maxBedrooms !== null) {
        filters.push(`maxBedrooms=${maxBedrooms}`);
    }
    if (minBathrooms !== null) {
        filters.push(`minBathrooms=${minBathrooms}`);
    }
    if (maxBathrooms !== null) {
        filters.push(`maxBathrooms=${maxBathrooms}`);
    }
    if (houseTypes && houseTypes.length > 0) {
        filters.push(`types=${houseTypes.join(',')}`);
    }
    if (sortBy) {
        filters.push(`sortBy=${sortBy}`);
    }
    if (order) {
        filters.push(`order=${order}`);
    }

    return filters.join('&');
}

export function getPropertiesPage(pageNumber,query,minPrice,maxPrice,minSafetyScore,minBedrooms,maxBedrooms,minBathrooms,maxBathrooms,houseTypes,sortBy,order) {
    let result = buildFilterQuery(pageNumber,query,minPrice,maxPrice,minSafetyScore,minBedrooms,maxBedrooms,minBathrooms,maxBathrooms,houseTypes,sortBy,order);
    let url = Api.buildApiUrl(`${basePath}?${result}`);
    console.log(url);
    return Api.getData(url);
}

export function getPropertyById(id) {
    let url = Api.buildApiUrl(`${basePath}/${encodeURIComponent(id)}`);
    return Api.getData(url);
}