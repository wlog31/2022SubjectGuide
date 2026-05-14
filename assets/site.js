function initSearch({ inputSelector, cardSelector, sectionSelector, countSelector, unit }) {
  const input = document.querySelector(inputSelector);
  const cards = Array.from(document.querySelectorAll(cardSelector));
  const sections = Array.from(document.querySelectorAll(sectionSelector));
  const count = document.querySelector(countSelector);
  if (!input || !cards.length) return;

  function updateSearch() {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    for (const card of cards) {
      const matches = !query || card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    }

    for (const section of sections) {
      const sectionCards = Array.from(section.querySelectorAll(cardSelector));
      section.hidden = sectionCards.length > 0 && !sectionCards.some((card) => !card.hidden);
    }

    if (count) count.textContent = visible + unit;
  }

  input.addEventListener("input", updateSearch);
  updateSearch();
}

initSearch({
  inputSelector: "#courseSearch",
  cardSelector: "[data-course-card]",
  sectionSelector: "[data-category-section]",
  countSelector: "#resultCount",
  unit: "개 과목",
});

initSearch({
  inputSelector: "#trackSearch",
  cardSelector: "[data-track-card]",
  sectionSelector: "[data-track-section]",
  countSelector: "#trackResultCount",
  unit: "개 계열",
});

initSearch({
  inputSelector: "#departmentSearch",
  cardSelector: "[data-department-card]",
  sectionSelector: "[data-department-section]",
  countSelector: "#departmentResultCount",
  unit: "개 학과",
});
