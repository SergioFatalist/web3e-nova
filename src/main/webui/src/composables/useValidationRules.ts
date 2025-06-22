import { useI18n } from "vue-i18n";

export default function () {
  const { t } = useI18n({ useScope: "global" });

  return {
    required: (value: unknown) => !!value || t("Field is required"),

    defined: (value: unknown) =>
      (typeof value !== "undefined" && value !== null) || t("Field is required"),

    minLength: (value: unknown, length: number) =>
      String(value).length >= length || t("Minimum characters is {0}", [length]),

    maxLength: (value: unknown, length: number) =>
      String(value).length <= length || t("Maximum characters is {0}", [length]),

    email: (value: string) =>
      !value ||
      /^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+(\.\w{2,3})+$/.test(value) ||
      t("Must be a valid email"),

    domain: (value: string) =>
      !value ||
      /^((?!-)[a-z0–9-]{1,63}(?<!-)\.)+([a-z0-9]{2,12}(?<![-0-9]))$/.test(value.toLowerCase()) ||
      t("Must be a valid domain"),

    telephone: (value: string) =>
      !value || /^([0-9\\-])*$/.test(value) || t("Must be a valid phone number"),

    decimal: (value: unknown, decimalPlace = 2, checkOverDecimalOnly = true) => {
      const regex = new RegExp(
        `^(0|[1-9]\\d*)((\\.)${checkOverDecimalOnly ? "?" : ""}\\d{${
          checkOverDecimalOnly ? "0," : ""
        }${decimalPlace}})$`
      );
      if (value && !value.toString().replace(/\s/g, "").match(regex)) {
        return t("Must be a valid decimal with {0} fraction", [decimalPlace]);
      }
      return true;
    },

    lessThan: (value: string, target: string) =>
      !value ||
      !target ||
      parseFloat(value) < parseFloat(target) ||
      t("Must be less than {0}", [target]),

    greaterThan: (value: string, target: string) =>
      !value ||
      !target ||
      parseFloat(value) > parseFloat(target) ||
      t("Must be greater than {0}", [target]),

    integer: (value: string | number) =>
      Number.isInteger(Number(value)) || t("Must be a valid integer"),

    beforeEpoch: (value: string | number, target: string | number) =>
      !value ||
      !target ||
      parseInt(String(value)) < parseInt(String(target)) ||
      t("Must be before {0}", [target]),

    afterEpoch: (value: string | number, target: string | number) =>
      !value ||
      !target ||
      parseInt(String(value)) > parseInt(String(target)) ||
      t("Must be after {0}", [target]),

    is: (value: string | number, target: string | number) =>
      !value ||
      !target ||
      parseInt(String(value)) === parseInt(String(target)) ||
      t("Must be {0}", [target]),
  };
}
