import { NextResponse } from 'next/server';

// PANOPTICON: No direct execution from UI/HTTP payloads.
// WarRoom #43: only a reviewed canonical broker may perform controlled operations.
// Re-enable solely through a separately approved, typed and audited broker adapter.
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'MUTATION_DISABLED' },
    { status: 403, headers: { 'Cache-Control': 'no-store' } }
  );
}
