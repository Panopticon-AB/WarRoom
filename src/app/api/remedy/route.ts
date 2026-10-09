import { NextResponse } from 'next/server';

// WarRoom is an observability client, not an authorization/execution service.
// Legacy POST accepted arbitrary remediation payloads and invoked a mutating bridge
// without a trusted actor, exact-scope approval, idempotency or replay guard.
// Fail closed until the canonical protected-operation broker is commissioned.
// See Panopticon-AB/WarRoom#43 and Panopticon infra#1547.
export async function POST() {
  return NextResponse.json(
    {
      error: 'MUTATION_DISABLED',
      message: 'WarRoom remediation execution requires a separate approved operation broker.',
    },
    {
      status: 403,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
