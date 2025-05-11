import type { GeneratorVerbOptions } from "@orval/core";

export default {
  api: {
    input: {
      target: "./openapi.json",
    },
    output: {
      mode: "tags-split",
      clear: ["src/shared/api/endpoints", "src/shared/api/models"],
      target: "src/shared/api/endpoints",
      schemas: "src/shared/api/models",
      client: "react-query",
      baseUrl: "http://localhost:3000/api",
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
          name: "httpClient",
        },
        transformer: (verb: GeneratorVerbOptions): GeneratorVerbOptions => {
          if (verb.response?.definition.errors === "void") {
            verb.response.definition.errors = "null";
          }

          return verb;
        },
        contentType: {
          include: ['application/json'],
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
      clear: ["src/shared/api/endpoints"],
      client: "zod",
      target: "src/shared/api/endpoints",
      fileExtension: ".zod.ts",
      biome: true,
    },
  },
};
