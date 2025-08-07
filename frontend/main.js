document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsDiv = document.getElementById("results");

  if (!keyword.trim()) {
    resultsDiv.innerHTML = "<p>Please enter a keyword.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`http://localhost:3001/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    resultsDiv.innerHTML = data.products.map(p => `
      <div class="product">
        <img src="${p.image}" alt="${p.title}" />
        <strong>${p.title}</strong><br/>
        ⭐ ${p.rating} (${p.reviews} reviews)
      </div>
    `).join("");
  } catch (err) {
    resultsDiv.innerHTML = "<p>Failed to fetch data.</p>";
    console.error(err);
  }
});
