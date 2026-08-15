---
name: Orval zod v4 import fix
description: Orval-generated zod client needs zod/v4 imports; codegen script rewrites them
---
Orval generates zod code using the zod v4 API (e.g. `zod.int()`), but emits `from 'zod'` imports which resolve to the v3 top-level API in this workspace — typecheck fails with many TS2339 errors.

**Why:** zod 3.25.x ships v4 under the `zod/v4` subpath; the workspace convention is to import from `zod/v4`.

**How to apply:** The `codegen` script in `lib/api-spec/package.json` already runs a sed step rewriting `from 'zod'` → `from 'zod/v4'` in `lib/api-zod/src/generated/api.ts` between orval and typecheck. Keep that step if the script is regenerated or edited.
