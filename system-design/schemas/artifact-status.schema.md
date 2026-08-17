# Artifact Status Semantic Schema

## Maturity

| Status | Meaning |
| --- | --- |
| `WORKING` | mutable authoring stage represented by immutable Draft versions; not downstream authority |
| `SKELETON_CONFIRMED` | architecture direction reviewed and blocking feasibility closed |
| `DESIGN_REVIEWED` | complete design review Findings closed; downstream obligation classification may remain |
| `IMPLEMENTATION_READY` | design authority frozen with design-owned parameters closed and downstream handoffs owner-complete |
| `SUPERSEDED` | preserved historical authority replaced by a later version |

## Dependency Validity

| Status | Meaning |
| --- | --- |
| `CURRENT` | all exact dependencies still match |
| `STALE_PENDING_IMPACT` | at least one exact dependency changed; impact not closed |
| `INVALIDATED` | changed dependency affects the artifact; return Action is known |
| `REVALIDATED` | a new record/version proves changed upstream content does not affect semantics |

No maturity transition may occur while dependency validity is stale or invalidated.
