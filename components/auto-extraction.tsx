"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle, FileUp } from "lucide-react"
import type { ExtractedData, AutoExtractionProps } from "@/lib/types"

export function AutoExtraction({
  file,
  stateCode,
  stateName,
  companyId,
  companyName,
  onExtracted,
  onError,
}: AutoExtractionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStage, setProcessingStage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (file) {
      processDocument()
    }
  }, [file])

  const processDocument = async () => {
    setIsProcessing(true)
    setProgress(0)
    setProcessingStage("Starting document processing...")
    setError(null)

    try {
      // Simulate processing stages
      await simulateProcessingStages()

      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("stateCode", stateCode)
      formData.append("companyId", companyId)
      formData.append("companyName", companyName)

      // In a real implementation, you would send the file to your API
      // const response = await fetch("/api/process-document", {
      //   method: "POST",
      //   body: formData,
      // })

      // For now, simulate a successful response with mock data
      const extractedData = createMockExtractedData(stateCode, stateName, companyName)

      // Call the onExtracted callback with the extracted data
      onExtracted(extractedData)
    } catch (err: any) {
      console.error("Error processing document:", err)
      setError(err.message || "Error processing document")
      onError(err.message || "Error processing document")
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateProcessingStages = async () => {
    setProcessingStage("Uploading document...")
    setProgress(10)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProcessingStage("Analyzing document layout...")
    setProgress(30)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProcessingStage("Extracting text and fields...")
    setProgress(50)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProcessingStage("Processing extracted information...")
    setProgress(70)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProcessingStage("Finalizing results...")
    setProgress(90)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProcessingStage("Processing complete!")
    setProgress(100)
  }

  const createMockExtractedData = (stateCode: string, stateName: string, operatorName: string): ExtractedData => {
    const countyMap: Record<string, string> = {
      TX: "Reeves County",
      OK: "Kingfisher County",
      NM: "Lea County",
      ND: "McKenzie County",
      PA: "Washington County",
      OH: "Belmont County",
      WV: "Doddridge County",
      LA: "Caddo Parish",
      CO: "Weld County",
      WY: "Campbell County"
    }

    const county = countyMap[stateCode] || "Unknown County"

    return {
      ownerNames: ["Sample Owner"],
      wellNames: [`${operatorName} Well 1H`],
      county: county,
      operator: operatorName,
      totalTractAcreage: 320,
      averageRoyaltyRate: 0.1875,
      sectionBreakdowns: [
        {
          sectionNumber: "Section 1",
          netAcres: 320,
          grossAcres: 640,
          royaltyInterest: 0.1875,
          calculatedRoyalty: 320 * 0.1875 * 75,
          confidenceScore: 85,
        },
      ],
      allocationValid: true,
      confidenceScores: {
        ownerNames: 85,
        wellNames: 85,
        county: 90,
        totalTractAcreage: 80,
        averageRoyaltyRate: 85,
      },
      tractSize: "320 acres",
      royaltyInterest: "18.75%",
      sectionNumber: "Section 1",
      propertyDescription: "Section 1, Township 26S, Range 32E",
      entity: "Sample Owner LLC",
      effectiveDate: "01/15/2023",
      preparedDate: "01/10/2023"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="h-5 w-5 mr-2" />
          Automatic Document Extraction
        </CardTitle>
        <CardDescription>
          Processing division order for {companyName} in {stateName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{processingStage}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              <span className="font-bold">Success!</span> Document processed successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            <strong>File:</strong> {file.name}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Type:</strong> {file.type || "Unknown"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {error && (
          <Button variant="outline" onClick={processDocument} className="w-full">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
