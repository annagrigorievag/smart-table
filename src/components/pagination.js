import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    // Очищаем контейнер пагинации
    if (pages) pages.innerHTML = '';

    return (data, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const pageSize = 10;
        const totalItems = data.length;
        const maxPage = Math.ceil(totalItems / pageSize) || 1;
        const currentPage = parseInt(state.page) || 1;
        const validPage = Math.min(Math.max(currentPage, 1), maxPage);

        // @todo: #2.6 — обработать действия
        let newPage = validPage;
        if (action) {
            if (action.name === 'first') newPage = 1;
            if (action.name === 'prev') newPage = Math.max(1, validPage - 1);
            if (action.name === 'next') newPage = Math.min(maxPage, validPage + 1);
            if (action.name === 'last') newPage = maxPage;
            if (action.name === 'page') newPage = parseInt(action.value) || 1;
            
            if (newPage !== validPage) {
                state.page = newPage;
            }
        }

        // @todo: #2.4 — получить список видимых страниц и вывести их
        if (pages) {
            pages.innerHTML = '';
            const visiblePages = getPages(newPage, maxPage, 5);
            
            visiblePages.forEach(pageNum => {
                const pageElement = createPage(pageNum);
                
                // Отмечаем активную страницу
                const radio = pageElement.querySelector('input');
                if (radio && pageNum === newPage) {
                    radio.checked = true;
                }
                
                pages.appendChild(pageElement);
            });
        }

        // @todo: #2.5 — обновить статус пагинации
        if (fromRow && toRow && totalRows) {
            const startItem = totalItems ? (newPage - 1) * pageSize + 1 : 0;
            const endItem = Math.min(newPage * pageSize, totalItems);
            
            fromRow.textContent = startItem;
            toRow.textContent = endItem;
            totalRows.textContent = totalItems;
        }

        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (newPage - 1) * pageSize;
        return data.slice(skip, skip + pageSize);
    }
}