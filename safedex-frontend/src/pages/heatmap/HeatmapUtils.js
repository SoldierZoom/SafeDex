export function processPolygon(boundaryPoints) {
    const polygonPoints = [];
    boundaryPoints.forEach((b) => {
        polygonPoints.push([b.latitude, b.longitude]);
    });
    return polygonPoints;
}
