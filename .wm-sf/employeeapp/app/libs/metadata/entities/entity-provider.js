
const metadata = {
};

export const getEntityPropertyMap = (liveSource, entityName) => {
    return metadata[liveSource] &&
    metadata[liveSource][entityName] &&
    metadata[liveSource][entityName].propertiesMap;
}

export const getEntityRelatedTables = (liveSource, entityName) => {
    return metadata[liveSource] &&
    metadata[liveSource][entityName] &&
    metadata[liveSource][entityName].relatedTables;
}