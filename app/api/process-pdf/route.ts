import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File
    const stateCode = formData.get("stateCode") as string

    if (!file || !stateCode) {
      return NextResponse.json({ error: "Missing required fields: file and stateCode" }, { status: 400 })
    }

    // For now, return a placeholder response
    // This will be replaced with actual OCR processing later
    const keyInfo = {
      tractSize: null as string | null,
      royaltyInterest: null as string | null,
      sectionNumber: null as string | null,
      county: getDefaultCounty(stateCode),
      ownerNames: [] as string[],
    }

    return NextResponse.json({
      success: true,
      ocrData: {
        text: "OCR processing will be implemented",
        confidence: 0,
        formFields: {}
      },
      extractedInfo: keyInfo
    })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
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
