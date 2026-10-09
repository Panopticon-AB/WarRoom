# WarRoom -> Panopticon Command Center: concept extraction and retirement plan

Status: PROPOSED / REPOSITORY-ONLY / NO LIVE MIGRATION
Owner: [WarRoom #29](https://github.com/Panopticon-AB/WarRoom/issues/29)
Source base: WarRoom security quarantine PR #44 head
`25090c32c2ac2769041b2133ab73159453c5f9f6` (2026-10-09).
Do not merge/deploy this document as evidence of runtime containment.

## Decision: keep the product boundary, reuse only qualified ideas

WarRoom is a **legacy prototype and source of interaction patterns**, not
Panopticon's second command authority or the next Command Center product
repository. The actual product is
[Panopticon-AB/panopticon-command-center](https://github.com/Panopticon-AB/panopticon-command-center).

The existing
[accepted ADR 0005](https://github.com/Techlemariam/panopticon-infra/blob/main/docs/architecture/adr/0005-command-center-repo-runtime-ownership.md)
and [infra #2825](https://github.com/Techlemariam/panopticon-infra/issues/2825)
own the split:

- **Command Center repo:** mobile-first read/decision **presentation** and
  optional read-only adapters. Never acts as authority merely because it
  renders a workflow or approval.
- **Panopticon infra:** canonical portfolio/factory, deployment, safety,
  restoration, recovery and runtime placement contracts.
- **Control-plane:** canonical Operator Protocol, checkpoint/resume,
  decision/attention semantics; [#94](https://github.com/Panopticon-AB/panopticon-control-plane/issues/94)
  must reconcile duplicates before a live operator projection.
- **GitHub/domain systems:** canonical work/PR/CI/live evidence; views never
  become the source of truth.
- **WarRoom:** optional historical UX/reference. No new live mutation
  capability or runtime expansion from this repository.
- **ChatGPT + GitHub:** independently usable primary operator path even
  if Command Center, WarRoom, Coolify or a snapshot is unavailable.

## What is reusable vs explicitly rejected

The mapping below is **design input** for Command Center; it is not a
license to copy an API, endpoint, credential, cache or numeric status
into the authoritative Factory Contract.

<!-- markdownlint-disable MD013 -->

| WarRoom source/concept | Command Center projection | Disposition and safety rule |
| --- | --- | --- |
| `src/components/MissionBoard.tsx` | Factory Portfolio / product-line status | **ADAPT CONCEPT.** Factory Contract v1, issue/PR exact refs and per-factory source/freshness; no private local mission state promoted |
| `src/components/EntropyRadar.tsx` | Factory Health / constraints / Andon | **ADAPT SIGNAL.** Consume existing Andon and observability read models; missing signal is UNKNOWN, never computed healthy |
| `src/components/FocusPanel.tsx` | Active Focus and next safe action | **ADAPT UX.** Consume canonical Active Focus and issue state; local add/remove buttons do not mutate focus |
| `src/components/DecisionLog.tsx` | Operator Decision Queue | **ADAPT UX.** Project canonical attention/decision evidence, expiry and approval refs, not a parallel decision log |
| `src/components/BurnTracker.tsx` | AI quota/cost and worker utilization | **PILOT LATER.** Source-class, measurement, TTL and confidence needed; estimated consumption must not be shown as billed amount |
| `src/components/InfraMonitor.tsx` | Deployment, runner, and recovery evidence | **ADAPT READ-ONLY.** Stop before `handleRemedy` / `POST /api/remedy`; deployment triggered != healthy; backup presence != restore proof |
| `src/components/WorkflowConsole.tsx` | Work Order / execution status / handoff links | **DO NOT COPY EXECUTOR.** `handleRun` / `POST /api/dispatch` have no authority. UI may show a proposal and canonical bounded handoff only |
| `src/components/TokenTracker.tsx` | Credential hygiene risk **without** secret handling | **DEFER.** No secret values, token suffixes, account identifiers or sensitive raw topology in UI snapshots |
| `src/lib/autonom.ts` | Non-executable recommendation idea | **REJECT EXECUTION BRIDGE.** No `executeAction` to Coolify/GitHub from a dashboard |
| `src/app/api/dispatch/route.ts` and `src/app/api/remedy/route.ts` | No corresponding new Command Center endpoint | **REJECT / CONTAIN.** New app must not implement arbitrary owner/repo/workflow/target/UUID JSON mutation |
| `.github/workflows/self-heal.yml` and `coolify-deploy.yml` | No Command Center writer/deployer | **REJECT.** Existing [#41](https://github.com/Panopticon-AB/WarRoom/issues/41) must block writer/deploy coupling before any WarRoom branch is merged to the default branch |
| `src/lib/github.ts`, `coolify.ts`, `hetzner.ts` | Separately owned sanitized read adapters if ever justified | **DO NOT PORT CREDENTIAL/NETWORK CODE.** Consume vetted GitHub/Coolify/observability evidence projections via infra-owned contracts |

<!-- markdownlint-enable MD013 -->

## Incremental migration and dependency order

1. **P0: contain legacy mutation paths.**
   [WarRoom PR #44](https://github.com/Panopticon-AB/WarRoom/pull/44)
   proposes deny-only `self-heal` and deploy workflows. PR #47 overlaps #44;
   review/reconcile as alternatives rather than merging both blindly.
   [PR #45](https://github.com/Panopticon-AB/WarRoom/pull/45) and
   [PR #46](https://github.com/Panopticon-AB/WarRoom/pull/46)
   overlap on `/api/remedy`. PR #45 also covers `/api/dispatch` and
   library mutation; PR #46 is stacked on #44. Decide one integrated
   containment sequence under #41/#43. Until actually merged and live
   verified, the default-branch exposure remains **UNKNOWN/UNCONTAINED**,
   not `SAFE`. A source-only fix is not a live incident closure.
2. **P1: use Command Center's existing safe foundation.**
   [Command Center PR #2](https://github.com/Panopticon-AB/panopticon-command-center/pull/2)
   is an explicit SIMULATED-only mobile portfolio; stacked
   [PR #4](https://github.com/Panopticon-AB/panopticon-command-center/pull/4)
   adds local untrusted, read-only GitHub snapshots. Do not fork the codebase
   back into WarRoom or add another Next.js command backend. Existing
   [Command Center #1](https://github.com/Panopticon-AB/panopticon-command-center/issues/1)
   and [#3](https://github.com/Panopticon-AB/panopticon-command-center/issues/3)
   own these slices.
3. **P1: reconcile one operator protocol before binding real state.**
   Control-plane #94 is an explicit P0 conflict for checkpoints, resume,
   Operator Brief and Quest Log. UI is downstream. It may link current
   GitHub sources but must not invent authoritative readiness/approval
   flags or an alternative mutable decision database.
4. **P1: project useful WarRoom ideas from *canonical* sources.**
   Proposed first additional slice only **after** #2/#4 conformance:
   Factory Portfolio risk/Andon summary with explicit source/observed-at,
   freshness, UNKNOWN/STALE/CONFLICTING, and links to canonical evidence.
   [Infra #3012](https://github.com/Techlemariam/panopticon-infra/issues/3012)
   owns Andon event projection; do not invent separate WarRoom alerts.
5. **P2: runtime/adoption choice.**
   Infra [#2708](https://github.com/Techlemariam/panopticon-infra/issues/2708)
   owns any future Coolify hosting decision/approval, not this migration.
   CT150 remains a bounded code worker, not a host.
6. **Retirement decision for WarRoom.**
   Choose `ARCHIVE_AFTER_EVIDENCE` / `KEEP_READ_ONLY_REFERENCE` /
   `TEMPORARILY_OPERATE_WITH_RISK` only after live owner verifies actual
   consumers, current deployments, API callers, credentials, alerts and
   rollback; never archive or remove on a documentation change alone.

## Explicit negative acceptance tests for consumer design

- A Command Center browser with fabricated `LIVE`, `verified` or
  `approved` fields cannot promote its own source file to evidence.
- `POST /api/remedy`, `POST /api/dispatch` or a legacy WarRoom Run button
  cannot be mapped to a Command Center execution endpoint.
- A missing/stale GitHub/Coolify/Andon provider produces UNKNOWN/STALE and
  visible source explanation, never 0/green/deployed.
- A proposed action requiring a protected operation always links to its
  separate canonical approval/executor path; no inline generic shell,
  webhook, root, GitHub admin or deploy bridge.
- A client/caller cannot choose arbitrary repository/branch/workflow,
  deployment UUID or authorization identity in a mutation request.
- Command Center failure never blocks GitHub/ChatGPT direct read, review or
  approved recovery; no hidden dependency on WarRoom availability.
- A deployment trigger success cannot be treated as application health;
  backup success cannot be labelled RESTORE_VERIFIED.
- Exact operator checkpoint, approval and currentness drift invalidates
  the projection via canonical control-plane semantics after #94 is resolved.

## Provenance / safety / rollback

This is a **docs-only migration proposal from already accepted issue #29
and ADR 0005**. It does not modify runtime behavior, credentials, workflows,
API handlers, GitHub settings, branch protection, authorization, CI, Coolify,
Proxmox, deployments or alerts. The PR is intentionally stacked on
**WarRoom #44's quarantine branch**, not default `master`, so it cannot
be treated as an independent authorization or safely merged to master
while legacy push-to-deploy remains active. Preserve original history
and source SHA; on dependency drift, stop and rebuild on reviewed source.

Rollback: revert the documentation commit. No data/runtime migration exists.
