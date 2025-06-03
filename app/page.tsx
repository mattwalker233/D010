'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { stateData } from "@/lib/state-data"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Division Orderly</h1>
          <p className="text-xl text-muted-foreground mb-8">
            AI-Powered Division Order Management for Oil & Gas Properties
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#states">Browse States</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section id="states" className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Select a State to Begin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateData.map((state) => (
            <Card key={state.code} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                      <span className="font-bold text-primary">{state.code}</span>
                    </div>
                    {state.name}
                  </CardTitle>
                </div>
                <CardDescription>{state.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/states/${state.code.toLowerCase()}/division-orders`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Well Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Handle multiple wells in a single division order while maintaining shared properties across wells.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>State-Specific Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Customized forms and validation for different state regulations and requirements.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically extract key information from division order documents using advanced AI technology.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Streamline Your Division Order Management?
            </h2>
            <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
              Start managing your multi-well division orders today with our state-specific, AI-powered platform.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
