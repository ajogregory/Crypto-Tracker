const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const apiParams = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 20,
    page: 1
};

async function fetchCryptos() {
    try {
        const response = await fetch(`${apiUrl}?vs_currency=${apiParams.vs_currency}&order=${apiParams.order}&per_page=${apiParams.per_page}&page=${apiParams.page}`);
        const data = await response.json();
        displayCryptos(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayCryptos(cryptos) {
    const cryptosContainer = document.getElementById('cryptos');
    cryptosContainer.innerHTML = '';

    cryptos.forEach(crypto => {
        const cryptoCard = document.createElement('div');
        cryptoCard.classList.add('crypto-card');

        cryptoCard.innerHTML = `
            <h3>${crypto.name}</h3>
            <p>Price: $${crypto.current_price}</p>
            <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            <button onclick="addToComparison('${crypto.id}')">Add to Compare</button>
        `;

        cryptosContainer.appendChild(cryptoCard);
    });
}

function addToComparison(cryptoId) {
    const selectedCryptosContainer = document.getElementById('selected-cryptos');
    if (selectedCryptosContainer.querySelector(`#${cryptoId}`)) {
        alert('Cryptocurrency already added to comparison.');
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`)
        .then(response => response.json())
        .then(data => {
            const comparisonCard = document.createElement('div');
            comparisonCard.classList.add('crypto-card');
            comparisonCard.id = cryptoId;

            comparisonCard.innerHTML = `
                <h3>${data.name}</h3>
                <p>Price: $${data.market_data.current_price.usd}</p>
                <p>24h Change: ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
                <p>Market Cap: $${data.market_data.market_cap.usd.toLocaleString()}</p>
                <button onclick="removeFromComparison('${cryptoId}')">Remove</button>
            `;

            selectedCryptosContainer.appendChild(comparisonCard);
        })
        .catch(error => console.error('Error:', error));
}

function removeFromComparison(cryptoId) {
    const cryptoToRemove = document.getElementById(cryptoId);
    if (cryptoToRemove) cryptoToRemove.remove();
}

document.getElementById('price-sort').addEventListener('change', function (event) {
    const sortBy = event.target.value;
    const cryptosContainer = document.getElementById('cryptos');
    const cryptos = Array.from(cryptosContainer.children);

    cryptos.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('p').textContent.replace('Price: $', ''));
        const priceB = parseFloat(b.querySelector('p').textContent.replace('Price: $', ''));

        return sortBy === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });

    cryptos.forEach(crypto => cryptosContainer.appendChild(crypto));
});

document.getElementById('refresh').addEventListener('click', fetchCryptos);

document.addEventListener('DOMContentLoaded', fetchCryptos);
