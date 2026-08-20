// =========================================================
// LOOKUP HELPERS
// =========================================================

export function buildLookup(items, key = "id") {

    const map = new Map();

    if (!Array.isArray(items)) {

        return map;
    }

    items.forEach((item) => {

        if (item?.[key] != null) {

            map.set(item[key], item);
        }
    });

    return map;
}


export function normalizeList(data) {

    if (Array.isArray(data)) {

        return data;
    }

    if (data && Array.isArray(data.content)) {

        return data.content;
    }

    return [];
}
