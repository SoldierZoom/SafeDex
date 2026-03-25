export function processPolygon(boundaryPoints) {
    const polygonPoints = [];
    if (boundaryPoints) {
        boundaryPoints.forEach((b) => {
            polygonPoints.push([b.latitude, b.longitude]);
        });
    }
    return polygonPoints;
}

export function displayCrimeType(crimeType) {
    const crimeTypeDisplayName = {
        "shoplifting": "Shoplifting",
        "bicycle-theft": "Bicycle Theft",
        "anti-social-behaviour": "Anti Social Behaviour",
        "drugs": "Drugs",
        "theft-from-the-person": "Theft from the person",
        "robbery": "Robbery",
        "violent-crime": "Violent Crime",
        "public-order": "Public Order",
        "vehicle-crime": "Vehicle Crime",
        "burglary": "Burglary",
        "other-crime": "Other Crime",
        "other-theft": "Other Theft",
        "possession-of-weapons": "Possession Of Weapons",
        "criminal-damage-arson": "Criminal Damage Arson",
    };

    if (Object.keys(crimeTypeDisplayName).includes(crimeType)) {
        return crimeTypeDisplayName[crimeType];
    } else {
        return crimeType;
    }
}
