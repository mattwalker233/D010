import { type NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/lib/tesseract-service"

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File
    const stateCode = formData.get("stateCode") as string

    if (!file || !stateCode) {
      return NextResponse.json({ error: "Missing required fields: file and stateCode" }, { status: 400 })
    }

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Process the document with OCR
      console.log(`Processing ${file.name} (${file.type}) for state ${stateCode}`)
      const extractedData = await processDocument(buffer)

      // Extract key information using patterns
      const keyInfo = {
        tractSize: null as string | null,
        royaltyInterest: null as string | null,
        sectionNumber: null as string | null,
        county: getDefaultCounty(stateCode),
        ownerNames: [] as string[],
      }

      // Look for tract size (e.g., "320 acres", "160.5 acres")
      const tractSizeMatch = extractedData.text.match(/(\d+(?:\.\d+)?)\s*acres?/i)
      if (tractSizeMatch) {
        keyInfo.tractSize = tractSizeMatch[0]
      }

      // Look for royalty interest (e.g., "18.75%", "0.1875")
      const royaltyMatch = extractedData.text.match(/(\d+(?:\.\d+)?)\s*%|\b0?\.\d+\b/)
      if (royaltyMatch) {
        keyInfo.royaltyInterest = royaltyMatch[0]
      }

      // Look for section numbers (e.g., "Section 14", "Sec. 23")
      const sectionMatch = extractedData.text.match(/(?:section|sec\.?)\s*(\d+)/i)
      if (sectionMatch) {
        keyInfo.sectionNumber = `Section ${sectionMatch[1]}`
      }

      // Look for potential owner names (capitalized words)
      const nameLines = extractedData.text.split('\n')
        .filter(line => /^[A-Z][A-Za-z\s,\.]+$/.test(line.trim()))
        .map(line => line.trim())
      keyInfo.ownerNames = nameLines

      // Return both the raw OCR data and the extracted key information
      return NextResponse.json({
        success: true,
        ocrData: {
          text: extractedData.text,
          confidence: extractedData.confidence,
          formFields: extractedData.formFields
        },
        extractedInfo: keyInfo
      })
    } catch (processingError) {
      console.error("Error processing document:", processingError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process document",
          details: processingError instanceof Error ? processingError.message : String(processingError),
        },
        { status: 200 }
      )
    }
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
