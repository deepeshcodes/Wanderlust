document.getElementById("searchForm").addEventListener('submit', async function (e) {
    //e.preventDefault();
    const query = document.getElementById("searchInput").value;
    const response = await fetch (`/listings/search?q=${query}`, {method: GET});
    const data = await response.text();
    document.getElementById('listingsContainer').innerHTML = data;
}); 