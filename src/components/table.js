import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    if (before && before.length > 0) {
        before.forEach(templateId => {
            const template = cloneTemplate(templateId);
            root.container.insertBefore(template.container, root.container.firstChild);
        });
    }
    
    if (after && after.length > 0) {
        after.forEach(templateId => {
            const template = cloneTemplate(templateId);
            root.container.appendChild(template.container);
        });
    }

    // @todo: #1.3 — обработать события и вызвать onAction()
    // Обрабатываем клики по кнопкам сортировки
    const sortButtons = root.container.querySelectorAll('[name="sort"]');
    sortButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            onAction({
                name: 'sort',
                value: button.dataset.field
            });
        });
    });
    
    // Обрабатываем изменения в полях формы
    const formElements = root.container.querySelectorAll('select, input');
    formElements.forEach(element => {
        element.addEventListener('change', () => {
            onAction({name: 'filter'});
        });
        element.addEventListener('input', () => {
            onAction({name: 'filter'});
        });
    });
    
    // Обрабатываем кнопки пагинации
    const paginationButtons = root.container.querySelectorAll('[name="first"], [name="prev"], [name="next"], [name="last"]');
    paginationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            onAction({
                name: button.name
            });
        });
    });
    
    // Обрабатываем радио-кнопки страниц
    const pageRadios = root.container.querySelectorAll('input[name="page"]');
    pageRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            onAction({
                name: 'page',
                value: e.target.value
            });
        });
    });
    
    // Обрабатываем сброс формы
    const resetButton = root.container.querySelector('[name="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();
            const form = root.container.querySelector('form');
            if (form) form.reset();
            onAction({name: 'reset', type: 'reset'});
        });
    }

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = [];
        
        data.forEach(item => {
            const row = cloneTemplate(rowTemplate);
            
            // Заполняем ячейки данными
            if (row.elements.date) row.elements.date.textContent = item.date;
            if (row.elements.customer) row.elements.customer.textContent = item.customer;
            if (row.elements.seller) row.elements.seller.textContent = item.seller;
            if (row.elements.total) row.elements.total.textContent = item.total;
            
            nextRows.push(row.container);
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}