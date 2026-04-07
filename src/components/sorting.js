// import {sortMap} from "../lib/sort.js"; // sortCollection больше не нужен

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            field = action.value;
            
            const currentOrder = state.sort === `${field}_up` ? 'up' : 
                                state.sort === `${field}_down` ? 'down' : 'none';
            
            if (currentOrder === 'none') {
                order = 'asc';
                state.sort = `${field}_up`;
            } else if (currentOrder === 'up') {
                order = 'desc';
                state.sort = `${field}_down`;
            } else {
                order = 'none';
                state.sort = null;
            }

            if (columns) {
                Object.keys(columns).forEach(columnName => {
                    const button = columns[columnName];
                    if (button) {
                        button.classList.remove('sorted-up', 'sorted-down');
                    }
                });
            }
        } else {
            if (state.sort) {
                if (state.sort.includes('_up')) {
                    field = state.sort.replace('_up', '');
                    order = 'asc';
                } else if (state.sort.includes('_down')) {
                    field = state.sort.replace('_down', '');
                    order = 'desc';
                }
            }
        }

        // ГЛАВНОЕ ИЗМЕНЕНИЕ: возвращаем параметр sort для сервера
        const sort = (field && order && order !== 'none') ? `${field}:${order}` : null;

        return sort ? Object.assign({}, query, { sort }) : query;
    }
}