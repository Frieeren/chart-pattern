import type { GeneratorVerbOptions } from "@orval/core";

export default {
  api: {
    input: {
      target: "./openapi.json",
    },
    output: {
      mode: "tags-split",
      target: "src/shared/api/endpoints",
      schemas: "src/shared/api/models",
      client: "react-query",
      baseUrl: "http://localhost:8000",
      mock: true,
      biome: true,
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useSuspenseQuery: true,
        },
        mutator: {
          path: "./src/shared/api/http.ts",
          name: "http",
        },
        transformer: (verb: GeneratorVerbOptions): GeneratorVerbOptions => {
          if (verb.response?.definition.errors === "void") {
            verb.response.definition.errors = "null";
          }

          return verb;
        },
      },
    },
  },
  zod: {
    input: {
      target: "./openapi.json",
    },
    output: {
      mode: "tags-split",
      client: "zod",
      target: "src/shared/api/endpoints",
      fileExtension: ".zod.ts",
      biome: true,
    },
  },
};
