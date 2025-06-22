import type { QTableProps } from "quasar";

export default function (): QTableProps["pagination"] {
  return {
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  };
}
