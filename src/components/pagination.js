import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    let pageCount;
    
    const applyPagination = (query, state, action) => {
        const limit = parseInt(state.rowsPerPage) || 10;
        let page = parseInt(state.page) || 1;

        // переносим код, который делали под @todo: #2.6
        if (action) {
            if (action.name === 'first') page = 1;
            if (action.name === 'prev') page = Math.max(1, page - 1);
            if (action.name === 'next') page = page + 1;
            if (action.name === 'last') page = pageCount || 1;
            if (action.name === 'page') page = parseInt(action.value) || 1;
        }

        // сохраняем страницу в state
        state.page = page;

        return Object.assign({}, query, {
            limit,
            page
        });
    }
    
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);
        const currentPage = parseInt(page) || 1;
        const maxPage = pageCount || 1;
        const validPage = Math.min(Math.max(currentPage, 1), maxPage);

        // переносим код, который делали под @todo: #2.4
        if (pages) {
            pages.innerHTML = '';
            const visiblePages = getPages(validPage, maxPage, 5);
            
            visiblePages.forEach(pageNum => {
                const pageElement = createPage(pageNum);
                
                const radio = pageElement.querySelector('input');
                if (radio && pageNum === validPage) {
                    radio.checked = true;
                }
                
                pages.appendChild(pageElement);
            });
        }

        // переносим код, который делали под @todo: #2.5
        if (fromRow && toRow && totalRows) {
            const startItem = total ? (validPage - 1) * limit + 1 : 0;
            const endItem = Math.min(validPage * limit, total);
            
            fromRow.textContent = startItem;
            toRow.textContent = endItem;
            totalRows.textContent = total;
        }
    }

    return {
        applyPagination,
        updatePagination
    };
}