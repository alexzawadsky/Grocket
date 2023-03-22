export const filterChildCategories = (categories, parentId) => {
    return categories?.filter(el => el?.parent === parentId)
}
