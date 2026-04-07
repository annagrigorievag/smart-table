import './fonts/ys-display/fonts.css'
import './style.css'

import api from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initSearching} from "./components/searching.js";
import {initFiltering} from "./components/filtering.js";
import {initSorting} from "./components/sorting.js";
import {initPagination} from "./components/pagination.js";

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
const applySearching = initSearching();
const applySorting = initSorting();
const {applyPagination, updatePagination} = initPagination(paginationElements, createPageButton);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return { ...state };
}

async function render(action) {
    let state = collectState();
    let query = {};
    
    query = applySearching(query, state, action); // result заменяем на query
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['filter', 'search'],
    after: ['pagination']
}, render);

// ПОСЛЕ создания таблицы ищем элементы фильтров
const filterElements = {
    seller: sampleTable.container.querySelector('[name="seller"]'),
    customer: sampleTable.container.querySelector('[name="customer"]'),
    date: sampleTable.container.querySelector('[name="date"]'),
    totalFrom: sampleTable.container.querySelector('[name="totalFrom"]'),
    totalTo: sampleTable.container.querySelector('[name="totalTo"]')

};

console.log('🔍 Найденные элементы фильтров:', filterElements);

// Инициализируем фильтры
const {applyFiltering, updateIndexes} = initFiltering(filterElements);

// Создаём sampleTable.filter.elements (как в задании)
sampleTable.filter = {
    elements: filterElements
};

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
         seller: indexes.sellers
    });
}

init().then(() => render());