const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

let cryptoData = [];

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    cryptoData = data;
    renderList(cryptoData);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function renderList(data) {
  const list = document.getElementById("cryptoList");
  list.innerHTML = "";

  data.forEach((coin) => {
    const changeClass =
      coin.price_change_percentage_24h >= 0
        ? "change-positive"
        : "change-negative";

    const row = document.createElement("div");
    row.className = "crypto-row";

    row.innerHTML = `
      <div class="crypto-left">
        <img src="${coin.image}" alt="${coin.name}">
        <div>
          <div class="crypto-name">${coin.name}</div>
          <div class="crypto-symbol">${coin.symbol.toUpperCase()}</div>
        </div>
      </div>

      <div class="crypto-right">
        <div class="price">$${coin.current_price.toLocaleString()}</div>
        <div class="${changeClass}">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </div>
        <div class="mktcap">Mkt Cap: $${coin.market_cap.toLocaleString()}</div>
      </div>
    `;

    list.appendChild(row);
  });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = cryptoData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  );
  renderList(filtered);
});

document.getElementById("sortMarketCapBtn").addEventListener("click", () => {
  const sorted = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
  renderList(sorted);
});

document.getElementById("sortChangeBtn").addEventListener("click", () => {
  const sorted = [...cryptoData].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  renderList(sorted);
});

fetchData();