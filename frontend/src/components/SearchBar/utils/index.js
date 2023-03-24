export const filterChildCategories = (categories, parentId) => {
    return categories?.filter(el => el?.parent === parentId)
}

export const stateToQuery = (state) => {
    const query = state
        .split(/(\s+)/)
        .filter(e => e.trim().length > 0)
        .join('+')
    return query
}