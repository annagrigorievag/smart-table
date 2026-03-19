import {createComparison} from "../lib/compare.js";

export function initSearching() {
    // @todo: #5.1 — настроить компаратор
    const comparison = createComparison(['search'], [
        (source, target) => {
            if (!target.search) return true;
            
            const searchTerm = target.search.toLowerCase();
            return Object.values(source).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            );
        }
    ]);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        if (!state.search || state.search.trim() === '') {
            return data;
        }
        
        return data.filter(item => comparison(item, { search: state.search }));
    }
}