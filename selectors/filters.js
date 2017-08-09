import { createSelector } from 'reselect';

// Get specific indicators
const getFiltersOptions = state => state.filters.options;
const setSelectedFilters = state => state.filters.selected;


/* Get all selected indicators first layer if they have anyone */
const getSelectedFilterOptions = createSelector(
  getFiltersOptions, setSelectedFilters,
  (filtersOptions, selectedFilters) => {
    const selectedFiltersOptions = {};

    Object.keys(selectedFilters).forEach((key) => {
      const selectedFilterKeyList = [];

      selectedFilters[key].forEach((s) => {
        const option = filtersOptions[key].find(fo => fo.id === s);
        option && selectedFilterKeyList.push(option);
      });
      selectedFiltersOptions[key] = selectedFilterKeyList;
    });

    return selectedFiltersOptions;
  }
);

// Export the selector
export { getSelectedFilterOptions };
