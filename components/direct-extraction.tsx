"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { ExtractedData } from "@/lib/types"

interface DirectExtractionProps {
  file: File
  stateCode: string
  stateName: string
  operatorName: string
  onExtractionComplete: (data: ExtractedData) => void
  onCancel: () => void
}

export function DirectExtraction({
  file,
  stateCode,
  stateName,
  operatorName,
  onExtractionComplete,
  onCancel,
}: DirectExtractionProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [keyFields, setKeyFields] = useState<{
    tractSize: string
    royaltyInterest: string
    sectionNumber: string
  } | null>(null)

  // Start extraction when component mounts
  useEffect(() => {
    startExtraction()
  }, [])

  // Simulate extraction process with full document scanning
  const startExtraction = async () => {
    setIsProcessing(true)
    setProgress(0)
    setProcessingError(null)
    setKeyFields(null)

    try {
      // Simulate progress updates for full document scanning
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2
          if (newProgress >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return newProgress
        })
      }, 100)

      // Simulate API call delay for thorough document processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create extracted data object with the key fields we're looking for
      const data: ExtractedData = {
        ownerNames: ["John Smith", "Southwest Minerals LLC"],
        wellNames: ["Sample Well 1H"],
        county: stateCode === "TX" ? "Reeves County" : stateCode === "NM" ? "Lea County" : "Sample County",
        totalTractAcreage: 320,
        averageRoyaltyRate: 0.1875,
        sectionBreakdowns: [
          {
            sectionNumber: "Section 14",
            netAcres: 320,
            grossAcres: 640,
            royaltyInterest: 0.1875,
            calculatedRoyalty: 320 * 0.1875 * 75,
            confidenceScore: 95,
          },
        ],
        allocationValid: true,
        confidenceScores: {
          ownerNames: 92,
          wellNames: 91,
          county: 96,
          totalTractAcreage: 95,
          averageRoyaltyRate: 95,
        },
        tractSize: "320 acres",
        royaltyInterest: "18.75%",
        sectionNumber: "Section 14",
      }

      // Set the key fields we're specifically looking for
      setKeyFields({
        tractSize: "320 acres",
        royaltyInterest: "18.75%",
        sectionNumber: "Section 14",
      })

      setExtractedData(data)

      // Complete the extraction
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)

      // Automatically pass the extracted data back to the parent component
      onExtractionComplete(data)
    } catch (error) {
      console.error("Error in extraction:", error)
      setProcessingError("Error during extraction. Please try again.")
      setIsProcessing(false)
    }
  }

  // Handle download of extracted data
  const handleDownload = () => {
    if (!extractedData) return

    const dataStr = JSON.stringify(
      {
        tractSize: extractedData.tractSize,
        royaltyInterest: extractedData.royaltyInterest,
        sectionNumber: extractedData.sectionNumber,
        county: extractedData.county,
        operator: operatorName,
      },
      null,
      2,
    )

    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "extracted_division_order_data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Extracting Information
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Extraction Results
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing document...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Scanning for tract size, royalty interest, and section number...
              </p>
            </div>
          )}

          {processingError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{processingError}</AlertDescription>
            </Alert>
          )}

          {!isProcessing && keyFields && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    Tract Size
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">95% confidence</Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-lg font-semibold">{keyFields.tractSize}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    Royalty Interest
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">95% confidence</Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-lg font-semibold">{keyFields.royaltyInterest}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center">
                    Section Number
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">95% confidence</Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-lg font-semibold">{keyFields.sectionNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">County</div>
                  <div className="p-2 bg-muted rounded-md">{extractedData?.county}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Operator</div>
                  <div className="p-2 bg-muted rounded-md">{operatorName}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Upload Another
        </Button>
        {!isProcessing && extractedData && (
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Data
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
