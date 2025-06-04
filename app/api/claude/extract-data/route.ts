import { type NextRequest, NextResponse } from "next/server"
import { extractDivisionOrderData } from "@/lib/claude-client"

export async function POST(request: NextRequest) {
  try {
    const { text, stateCode } = await request.json()

    if (!text || !stateCode) {
      return NextResponse.json(
        { error: "Missing required fields: text and stateCode" },
        { status: 400 }
      )
    }

    const extractedData = await extractDivisionOrderData(text, stateCode)

    return NextResponse.json({
      success: true,
      data: extractedData
    })
  } catch (error) {
    console.error("Error in Claude API route:", error)
    return NextResponse.json(
      { 
        error: "Failed to extract data",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Helper function to get default county by state
function getDefaultCounty(stateCode: string): string {
  const countyMap: Record<string, string> = {
    TX: "Reeves County",
    OK: "Kingfisher County",
    NM: "Lea County",
    ND: "McKenzie County",
    PA: "Washington County",
    OH: "Belmont County",
    LA: "Caddo Parish",
    WV: "Doddridge County",
  }
  return countyMap[stateCode] || "Unknown County"
} 