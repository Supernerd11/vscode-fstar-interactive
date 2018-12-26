
type Query = {
  "query-id": String,
  query: string,
  args: NonNullable<any>
};

type AutocompleteArgs = {
  "partial-symbol": string
  context?: "open" | "include" | "module-alias" | "set-options" | "reset-options" | "code"
};

type ProtocolInfo = {
  kind: "protocol-info",
  features: string[],
  version: number
};

type Message = {
  "query-id": string
  kind: "message",
  level: "error" | "warning" | "info" | "proof-state",
  contents: any
};

type Response = {
  "query-id": string,
  kind: "response",
  status: "success" | "failure" | "protocol-violation",
  response: any
} | Message | ProtocolInfo;