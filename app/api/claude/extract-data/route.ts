import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, stateCode, confidence } = await request.json()

    if (!text || !stateCode) {
      return NextResponse.json(
        { error: "Missing required fields: text and stateCode" },
        { status: 400 }
      )
    }

    // Mock data extraction
    // In production, this would call the Claude API
    const extractedData = {
      operator: "Sample Oil & Gas",
      entity: "Sample LLC",
      effectiveDate: new Date().toISOString().split('T')[0],
      county: getDefaultCounty(stateCode),
      wells: [
        {
          wellName: "Test Well #1",
          propertyDescription: "Section 14, Block A",
          royaltyInterest: 0.125,
          tractAcres: 320
        }
      ],
      confidence: confidence || 0.95,
      additionalDetails: {
        documentType: "Division Order",
        processingDate: new Date().toISOString()
      }
    }

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