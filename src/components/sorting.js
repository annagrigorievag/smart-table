import {sortCollection} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            field = action.value;
            
            const currentOrder = state.sort === `${field}_up` ? 'up' : 
                                state.sort === `${field}_down` ? 'down' : 'none';
            
            if (currentOrder === 'none') {
                order = 'up';
                state.sort = `${field}_up`;
            } else if (currentOrder === 'up') {
                order = 'down';
                state.sort = `${field}_down`;
            } else {
                order = 'none';
                state.sort = null;
            }

            // @todo: #3.2 — сбросить сортировки остальных колонок
            if (columns) {
                Object.keys(columns).forEach(columnName => {
                    const button = columns[columnName];
                    if (button) {
                        button.classList.remove('sorted-up', 'sorted-down');
                    }
                });
            }
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            if (state.sort) {
                if (state.sort.includes('_up')) {
                    field = state.sort.replace('_up', '');
                    order = 'up';
                } else if (state.sort.includes('_down')) {
                    field = state.sort.replace('_down', '');
                    order = 'down';
                }
            }
        }

        if (field && order && order !== 'none') {
            return sortCollection(data, field, order);
        }
        return data;
    }
}