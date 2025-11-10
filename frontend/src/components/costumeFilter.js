import { useI18n } from "../lib/i18n";

export function useCostumeFilters() {
  const { t } = useI18n();

  return [
    { key: "all", label: t("filter.visi") },
    { key: "moterims", label: t("filter.moterims")},
    { key: "vyrams", label: t("filter.vyrams") },
    { key: "mergaitėms", label: t("filter.mergaitems") },
    { key: "berniukams", label: t("filter.berniukams") },
  ];
}
