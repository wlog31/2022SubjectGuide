const input = document.querySelector("#courseSearch");
const cards = Array.from(document.querySelectorAll("[data-course-card]"));
const sections = Array.from(document.querySelectorAll("[data-category-section]"));
const count = document.querySelector("#resultCount");

function updateSearch() {
  const query = (input?.value || "").trim().toLowerCase();
  let visible = 0;

  for (const card of cards) {
    const matches = !query || card.dataset.search.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  }

  for (const section of sections) {
    const anyVisible = Array.from(section.querySelectorAll("[data-course-card]")).some((card) => !card.hidden);
    section.hidden = !anyVisible;
  }

  if (count) count.textContent = visible + "개 과목";
}

input?.addEventListener("input", updateSearch);
updateSearch();
