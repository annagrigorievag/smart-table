import {createComparison} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.3 — настроить компаратор
    const comparison = createComparison(['seller', 'customer'], [
        (source, target) => {
            if (!target.seller) return true;
            return source.seller === target.seller;
        },
        (source, target) => {
            if (!target.customer) return true;
            return source.customer === target.customer;
        }
    ]);

    // @todo: #4.1 — заполнить выпадающие списки опциями
    if (elements?.seller && indexes?.sellers) {
        const sellers = [...new Set(indexes.sellers.map(item => item.seller))];
        elements.seller.innerHTML = '<option value="">Все продавцы</option>';
        sellers.forEach(seller => {
            const option = document.createElement('option');
            option.value = seller;
            option.textContent = seller;
            elements.seller.appendChild(option);
        });
    }
    
    if (elements?.customer && indexes?.customers) {
        const customers = [...new Set(indexes.customers.map(item => item.customer))];
        elements.customer.innerHTML = '<option value="">Все покупатели</option>';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer;
            option.textContent = customer;
            elements.customer.appendChild(option);
        });
    }

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action?.name === 'reset') {
            if (elements?.seller) elements.seller.value = '';
            if (elements?.customer) elements.customer.value = '';
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        if (!state.seller && !state.customer) {
            return data;
        }
        
        return data.filter(item => comparison(item, state));
    }
}