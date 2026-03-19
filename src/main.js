import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение
import {initSearching} from "./components/searching.js";
import {initFiltering} from "./components/filtering.js";
import {initSorting} from "./components/sorting.js";
import {initPagination} from "./components/pagination.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

// @todo: инициализация
// Получаем ссылки на элементы фильтров
const filterElements = {
    seller: document.querySelector('[name="seller"]'),
    customer: document.querySelector('[name="customer"]')
};

// Элементы пагинации
const paginationElements = {
    pages: document.querySelector('[data-name="pages"]'),
    fromRow: document.querySelector('[data-name="fromRow"]'),
    toRow: document.querySelector('[data-name="toRow"]'),
    totalRows: document.querySelector('[data-name="totalRows"]')
};

// Функция создания кнопки страницы
const createPageButton = (pageNum) => {
    const label = document.createElement('label');
    label.className = 'pagination-button';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'page';
    radio.value = pageNum;
    
    const span = document.createElement('span');
    span.textContent = pageNum;
    
    label.appendChild(radio);
    label.appendChild(span);
    
    return label;
};

// Инициализируем модули
const search = initSearching();
const filter = initFiltering(filterElements, indexes);
const sort = initSorting();
const pagination = initPagination(paginationElements, createPageButton);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return {
        ...state
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let result = [...data];
    // @todo: использование
    result = search(result, state, action);
    result = filter(result, state, action);
    result = sort(result, state, action);
    result = pagination(result, state, action);

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'filter'],
    after: ['pagination']
}, render);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();