# WarRoom — legacy prototype for Panopticon Command Center

**Status: LEGACY / NOT A COMMISSIONED PANOPTICON CONTROL PLANE.**

WarRoom was originally developed as a Brotherhood observability and autonomous
remediation dashboard. It is now a **reference for design concepts and operator
experience**, **not** the canonical Panopticon product or execution authority.

The successor product lives in
[Panopticon-AB/panopticon-command-center](https://github.com/Panopticon-AB/panopticon-command-center).
Its first slices are **read-only, explicit SIMULATED demo and untrusted local
GitHub snapshots**; they are not an operationally verified control surface.
WarRoom's mutations and legacy credential/runtime assumptions must not be
ported into that product.

## Migration

Read the [WarRoom -> Command Center migration map](docs/warroom-command-center-migration.md)
and [WarRoom migration issue #29](https://github.com/Panopticon-AB/WarRoom/issues/29).

<!-- markdownlint-disable MD013 -->
The accepted [Command Center ownership ADR 0005](https://github.com/Techlemariam/panopticon-infra/blob/main/docs/architecture/adr/0005-command-center-repo-runtime-ownership.md)
<!-- markdownlint-enable MD013 -->
assigns product UI to Command Center and security/runtime/deployment authority
to Panopticon infra and canonical domain services. GitHub remains the
source of truth for work; Command Center is a read/decision projection only.

| WarRoom pattern | Safer successor concept |
| --- | --- |
| Mission Board | Factory Portfolio / factory line status |
| EntropyRadar | Factory Health, bottlenecks and Andon |
| FocusPanel | Active Focus / next safe action |
| DecisionLog | Canonical Operator Decision Queue projection |
| Token/Burn Tracker | Advisory AI usage and capacity with source/freshness |
| InfraMonitor | Read-only health and recovery evidence |
| WorkflowConsole | Work Order status and canonical handoff links, not direct execution |

## Legacy security and runtime warning

**Existing default-branch code cannot be assumed secure or dormant.**
WarRoom [#41](https://github.com/Panopticon-AB/WarRoom/issues/41) tracks
direct branch self-heal writes and deployment coupled to Git pushes;
[#43](https://github.com/Panopticon-AB/WarRoom/issues/43) tracks unauthenticated
remediation/dispatch API mutation. Actual deployed availability and active
credentials have **not** been verified here.

Proposed quarantine: [PR #44](https://github.com/Panopticon-AB/WarRoom/pull/44)
(workflows) and overlapping [#45](https://github.com/Panopticon-AB/WarRoom/pull/45) /
[#46](https://github.com/Panopticon-AB/WarRoom/pull/46) (HTTP/exec paths).
[#47](https://github.com/Panopticon-AB/WarRoom/pull/47) duplicates the
workflow containment intent. These are drafts requiring reconciliation,
review and an explicit deployment/availability decision before any claim
that legacy execution is contained.

WarRoom's `POST /api/remedy`, `POST /api/dispatch`, self-heal, direct
GitHub dispatch and Coolify deployment are **not** acceptable Command
Center integrations. Do not trigger or expose them as a workaround.

## Historical functionality (reference only)

Previous prototypes included an EntropyRadar, token usage dashboard,
mission/focus boards, workflow console, infrastructure cards and
prescriptive remediation ideas. These components may inform a new
read-only view but their network/credentials/execution internals are
out of scope for migration.

For local historical code inspection (not production commissioning),
review source and tests directly. This README does not prescribe
running the old Next.js service or connecting it to live systems.

## Source of truth and next steps

- [Command Center MVP #1](https://github.com/Panopticon-AB/panopticon-command-center/issues/1)
  and [read-only GitHub evidence #3](https://github.com/Panopticon-AB/panopticon-command-center/issues/3)
  own current product implementation.
- [Infra Command Center delivery #2825](https://github.com/Techlemariam/panopticon-infra/issues/2825)
  owns staging, provider adoption, evidence and hosting gates.
- [Control-plane #94](https://github.com/Panopticon-AB/panopticon-control-plane/issues/94)
  must reconcile Operator Protocol, Quest Log and brief ownership before
  live operator-state consumption.
- Active Focus CT150 [infra #482](https://github.com/Techlemariam/panopticon-infra/issues/482)
  is unchanged. No live, GitHub settings, approval, credential or deployment
  authority follows from this documentation update.
