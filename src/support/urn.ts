import { createUrnUtil } from "urn-lib";
import { z } from "zod";
import { encode, decode, isEncoded } from "./coding";

const urnSchema = z.object({
  section: z.string().refine((value) => value == "fs", {
    message: "only fs section is supported",
  }),
  type: z.string().refine((value) => value == "cloud" || value == "trash", {
    message: "only cloud and trash types are supported",
  }),
  resource: z.string().refine((value) => isEncoded(value), {
    message: "resource has to be base64 encoded",
  }),
});

const util = createUrnUtil("frn", {
  separator: ":",
  components: ["section", "type", "resource"],
});

export const urnApi = {
  format: ({
    section,
    type,
    resource,
  }: {
    section: string;
    type: string;
    resource: string;
  }) => {
    const encodedResource = encode(resource);

    return util.format({ section, type, resource: encodedResource });
  },
  parse: (urn: string) => {
    const parsed = util.parse(urn);
    const _urn = urnSchema.parse(parsed);

    const decodedResource = decode(_urn.resource);

    return { ..._urn, resource: decodedResource };
  },
};
