import { useRoute } from "vue-router";

export default function (name: string): string | undefined {
  const route = useRoute();
  const params = route.params as { [key: string]: string | string[] | undefined };
  return params[name]
    ? Array.isArray(params[name])
      ? params[name][0]?.toString()
      : params[name]?.toString()
    : undefined;
}
