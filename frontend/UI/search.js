const input = document.querySelector('#search');
const btn = document.querySelector('#searchBtn');


export function initSearchHandler(onSearch){
    input.addEventListener('input', () => {
        onSearch(input.value);
    })

    btn.addEventListener('click', () => {
        onSearch(input.value);
        input.value = ''
    })
}

