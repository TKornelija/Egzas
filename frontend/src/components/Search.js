/**
 * Filtruoja duomenis pagal searchTerm
 * @param {Array} items - masyvas objektų (pvz., kostiumų)
 * @param {string} searchTerm - įvestas tekstas
 * @param {Array} fields - masyvas laukų, pagal kuriuos filtruojam
 * @returns {Array} filtruoti elementai
 */
export function filterBySearch(items, searchTerm, fields = ["name"]) {
  if (!searchTerm) return items;

  const term = searchTerm.toLowerCase();

  return items.filter(item =>
    fields.some(field =>
      item[field]?.toString().toLowerCase().includes(term)
    )
  );
}

