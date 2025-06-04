import type { Context } from "../../server/src/lib/context";

export type User = NonNullable<Context["session"]>["user"];
export type Session = NonNullable<Context["session"]>;
