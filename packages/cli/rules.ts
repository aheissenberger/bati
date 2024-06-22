import { RulesMessage } from "@batijs/features/rules";
import { bold, inverse } from "colorette";

export interface RuleMessage {
  type: "warning" | "error" | "info";
  value: string;
}

function error(value: string): RuleMessage {
  return {
    type: "error",
    value,
  };
}

function info(value: string): RuleMessage {
  return {
    type: "info",
    value,
  };
}

export const rulesMessages = {
  [RulesMessage.ERROR_AUTH_R_SERVER]: error(
    `A ${inverse(bold("Server"))} is required when using ${inverse(
      bold("Auth"),
    )}. Check https://vike.dev/integration#server-side-tools for details and https://batijs.dev for available servers`,
  ),
  [RulesMessage.ERROR_COMPILED_R_REACT]: error(
    `${inverse(bold("React"))} is required when using ${inverse(bold("Compiled"))}.`,
  ),
  [RulesMessage.INFO_HATTIP]: info(`${inverse(bold("HatTip"))} is an experimental project`),
  [RulesMessage.ERROR_DRIZZLE_R_SERVER]: error(
    `A ${inverse(bold("Server"))} is required when using ${inverse(bold("Drizzle"))}.`,
  ),
  [RulesMessage.ERROR_DATA_R_SERVER]: error(
    `A ${inverse(bold("Server"))} is required when using ${inverse(bold("Data fetching"))}.`,
  ),
} satisfies Record<RulesMessage, RuleMessage>;
