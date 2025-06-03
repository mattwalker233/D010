import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const orders = await db.getDivisionOrders()
    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Error fetching division orders:", error)
    return NextResponse.json({ error: "Failed to fetch division orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, extractedData } = body

    const order = await db.createDivisionOrder({
      fileName,
      uploadDate: new Date().toISOString(),
      operator: extractedData.operator || "Unknown Operator",
      entity: extractedData.entity || "Unknown Entity",
      effectiveDate: extractedData.effectiveDate || new Date().toISOString(),
      county: extractedData.county || "Unknown County",
      wells: extractedData.wells || [{
        wellName: "Unknown Well",
        propertyDescription: "No description provided"
      }],
      preparedDate: new Date().toISOString(),
      confidence: extractedData.confidence || 0,
    })

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error creating division order:", error)
    return NextResponse.json({ error: "Failed to create division order" }, { status: 500 })
  }
}
