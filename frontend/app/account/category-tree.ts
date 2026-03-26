import {Category} from "@/app/context/api/queries/categories";

export const childrenOf = (category: Category, categories: Category[]) => {
    return categories.filter(c => c.parent === category.id);
}

export const hasChildren = (category: Category, categories: Category[]) => {
    return childrenOf(category, categories).length > 0;
}

export const allChildrenOf = (category: Category, categories: Category[]) => {
    const children: Category[] = childrenOf(category, categories)
        .map(cat => allChildrenOf(cat, categories))
        .flat();
    return [category, ...children];
}

export const parentOf = (category: Category, categories: Category[]) => {
    return categories.find(c => c.id === category.parent);
}

export const allParentsOf = (category: Category, categories: Category[]) => {
    const parents: Category[] = [];
    let current: Category | undefined = category;
    while (current !== undefined) {
        parents.push(current);
        current = parentOf(current, categories);
    }
    return parents;
}

export const levelOf = (category: Category, categories: Category[]) => {
    let level = 0;
    let current: Category | undefined = category;
    while (current !== undefined) {
        level++;
        current = parentOf(current, categories);
    }
    return level;
}