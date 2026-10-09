import { NextResponse } from 'next/server';

// PANOPTICON: Direct GitHub dispatch from caller-supplied owner/repo/workflow
// bypasses canonical Work Order, identity, capability and approval checks.
// WarRoom #43: fail closed until a reviewed operation broker exists.
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'MUTATION_DISABLED' },
    { status: 403, headers: { 'Cache-Control': 'no-store' } }
  );
}
