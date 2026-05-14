function getSearchText(card) {
  return (card.dataset.search || "").toLowerCase();
}

function getSectionLabel(section, selector) {
  return (section.querySelector(selector)?.textContent || "").trim();
}

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
      const matches = !query || getSearchText(card).includes(query);
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

function initCourseSearch() {
  const input = document.querySelector("#courseSearch");
  const filter = document.querySelector("#courseFilter");
  const sections = Array.from(document.querySelectorAll("[data-category-section]"));
  const count = document.querySelector("#resultCount");
  if (!input || !filter || !sections.length) return;

  function updateSearch() {
    const query = input.value.trim().toLowerCase();
    const activeFilter = filter.value;
    let visible = 0;

    for (const section of sections) {
      const sectionFilter = getSectionLabel(section, ".category-head p");
      const filterMatches = sectionFilter === activeFilter;
      const cards = Array.from(section.querySelectorAll("[data-course-card]"));
      let sectionVisible = false;

      for (const card of cards) {
        const matches = filterMatches && (!query || getSearchText(card).includes(query));
        card.hidden = !matches;
        if (matches) {
          visible += 1;
          sectionVisible = true;
        }
      }

      section.hidden = !sectionVisible;
    }

    if (count) count.textContent = visible + "개 과목";
  }

  filter.addEventListener("change", updateSearch);
  input.addEventListener("input", updateSearch);
  updateSearch();
}

function initDepartmentSearch() {
  const input = document.querySelector("#departmentSearch");
  const filter = document.querySelector("#departmentFilter");
  const sections = Array.from(document.querySelectorAll("[data-department-section]"));
  const count = document.querySelector("#departmentResultCount");
  if (!input || !filter || !sections.length) return;

  const placeholderByMode = {
    cards: "학과명, 계열, 선택 과목 검색",
    sections: "계열 분류명 검색",
  };

  function updateSearch() {
    const query = input.value.trim().toLowerCase();
    const activeMode = filter.value;
    const sectionMode = activeMode === "sections";
    let visible = 0;

    input.placeholder = placeholderByMode[activeMode] || placeholderByMode.cards;

    for (const section of sections) {
      const cards = Array.from(section.querySelectorAll("[data-department-card]"));

      if (sectionMode) {
        const sectionName = getSectionLabel(section, ".category-head h2").toLowerCase();
        const isUnclassified = sectionName === "계열 미분류";
        const sectionMatches = !isUnclassified && (!query || sectionName.includes(query));
        section.hidden = !sectionMatches;

        for (const card of cards) {
          card.hidden = false;
        }

        if (sectionMatches) visible += 1;
        continue;
      }

      let sectionVisible = false;
      for (const card of cards) {
        const matches = !query || getSearchText(card).includes(query);
        card.hidden = !matches;
        if (matches) {
          visible += 1;
          sectionVisible = true;
        }
      }

      section.hidden = !sectionVisible;
    }

    if (count) count.textContent = visible + (sectionMode ? "개 계열 분류" : "개 학과");
  }

  filter.addEventListener("change", updateSearch);
  input.addEventListener("input", updateSearch);
  updateSearch();
}

initCourseSearch();

initSearch({
  inputSelector: "#trackSearch",
  cardSelector: "[data-track-card]",
  sectionSelector: "[data-track-section]",
  countSelector: "#trackResultCount",
  unit: "개 계열",
});

initDepartmentSearch();
