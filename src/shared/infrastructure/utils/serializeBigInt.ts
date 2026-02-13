export const serializeBigInt = <T>(payload: T): T =>
  JSON.parse(
    JSON.stringify(payload, (_, value) => (typeof value === "bigint" ? value.toString() : value))
  );
