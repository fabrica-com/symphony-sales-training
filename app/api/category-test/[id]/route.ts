import { getCategoryTestFromDb } from "@/lib/db/categories"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const test = await getCategoryTestFromDb(id)

  if (!test) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 })
  }

  return NextResponse.json(test)
}
