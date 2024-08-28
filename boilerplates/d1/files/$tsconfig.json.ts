import { loadAsJson, type TransformerProps } from "@batijs/core";

export default async function getTsConfig(props: TransformerProps) {
  const tsConfig = await loadAsJson(props);

  tsConfig.compilerOptions.types = [...(tsConfig.compilerOptions.types ?? []), "@cloudflare/workers-types"];

  return tsConfig;
}
