function getSearchText(card) {
  return (card.dataset.search || "").toLowerCase();
}

function getSectionLabel(section, selector) {
  return (section.querySelector(selector)?.textContent || "").trim();
}

function getCardTitle(card) {
  return (card.querySelector("strong")?.textContent || "").trim();
}

function addSelectOptions(select, values) {
  const seen = new Set();

  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);

    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
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
  const categoryFilter = document.querySelector("#courseCategoryFilter");
  const trackFilter = document.querySelector("#courseTrackFilter");
  const sections = Array.from(document.querySelectorAll("[data-category-section]"));
  const count = document.querySelector("#resultCount");
  if (!input || !categoryFilter || !trackFilter || !sections.length) return;

  addSelectOptions(
    categoryFilter,
    sections
      .filter((section) => getSectionLabel(section, ".category-head p") === "제1부 교과(군)별")
      .map((section) => getSectionLabel(section, ".category-head h2"))
  );
  addSelectOptions(
    trackFilter,
    sections
      .filter((section) => getSectionLabel(section, ".category-head p") === "제2부 계열별")
      .map((section) => getSectionLabel(section, ".category-head h2"))
  );

  function updateSearch() {
    const query = input.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedTrack = trackFilter.value;
    let visible = 0;

    for (const section of sections) {
      const sectionType = getSectionLabel(section, ".category-head p");
      const sectionName = getSectionLabel(section, ".category-head h2");
      const filterMatches =
        (!selectedCategory && !selectedTrack) ||
        (selectedCategory && sectionType === "제1부 교과(군)별" && sectionName === selectedCategory) ||
        (selectedTrack && sectionType === "제2부 계열별" && sectionName === selectedTrack);
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

  categoryFilter.addEventListener("change", () => {
    trackFilter.value = "";
    updateSearch();
  });
  trackFilter.addEventListener("change", () => {
    categoryFilter.value = "";
    updateSearch();
  });
  input.addEventListener("input", updateSearch);
  updateSearch();
}

function initDepartmentSearch() {
  const input = document.querySelector("#departmentSearch");
  const nameFilter = document.querySelector("#departmentNameFilter");
  const sectionFilter = document.querySelector("#departmentSectionFilter");
  const sections = Array.from(document.querySelectorAll("[data-department-section]"));
  const count = document.querySelector("#departmentResultCount");
  const cards = Array.from(document.querySelectorAll("[data-department-card]"));
  if (!input || !nameFilter || !sectionFilter || !sections.length || !cards.length) return;

  addSelectOptions(nameFilter, cards.map(getCardTitle));
  addSelectOptions(sectionFilter, sections.map((section) => getSectionLabel(section, ".category-head h2")));

  function updateSearch() {
    const query = input.value.trim().toLowerCase();
    const selectedDepartment = nameFilter.value;
    const selectedSection = sectionFilter.value;
    let visible = 0;

    for (const section of sections) {
      const sectionName = getSectionLabel(section, ".category-head h2");
      const sectionMatches = !selectedSection || sectionName === selectedSection;
      const sectionCards = Array.from(section.querySelectorAll("[data-department-card]"));
      let sectionVisible = false;

      for (const card of sectionCards) {
        const departmentMatches = !selectedDepartment || getCardTitle(card) === selectedDepartment;
        const filterMatches = selectedDepartment ? departmentMatches : sectionMatches;
        const matches = filterMatches && (!query || getSearchText(card).includes(query));
        card.hidden = !matches;
        if (matches) {
          visible += 1;
          sectionVisible = true;
        }
      }

      section.hidden = !sectionVisible;
    }

    if (count) count.textContent = visible + "개 학과";
  }

  nameFilter.addEventListener("change", () => {
    sectionFilter.value = "";
    updateSearch();
  });
  sectionFilter.addEventListener("change", () => {
    nameFilter.value = "";
    updateSearch();
  });
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
