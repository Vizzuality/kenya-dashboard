// Libraries
import flatten from 'lodash/flatten';


function getRegionName(regions, selectedRegion) {
  if (regions && regions.length) {
    // TODO: don't loop through all the entities, it would be better to do an API call
    const region = flatten(regions.map(r => r.list)).find(r => +r.id === +selectedRegion);
    return (region && region.name) || 'Location';
  }

  return 'Location';
}

export { getRegionName };
