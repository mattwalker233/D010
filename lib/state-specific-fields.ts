// State-specific field definitions for division orders

import type { StateSpecificField } from "./types"

interface StateFieldDefinition {
  stateCode: string
  stateName: string
  fields: StateSpecificField[]
  sampleFields?: {
    [key: string]: string
  }
  textDescription?: string
  formatNotes?: string
}

const stateFieldsData: StateFieldDefinition[] = [
  {
    stateCode: "TX",
    stateName: "Texas",
    fields: [
      { id: "txRrcId", label: "Texas RRC ID", type: "text", required: true },
      { id: "txCountyId", label: "County ID", type: "text", required: true },
      { id: "section", label: "Section", type: "text", required: true },
      { id: "block", label: "Block", type: "text", required: true },
      { id: "survey", label: "Survey", type: "text", required: true },
      { id: "abstract", label: "Abstract", type: "text", required: true }
    ],
    sampleFields: {
      section: "Section 14",
      block: "Block A",
      survey: "H&TC RR Co Survey",
      abstract: "A-123"
    },
    textDescription: "Section, Block, Survey, and Abstract format",
    formatNotes: "Texas division orders typically include Section, Block, and Survey information. Abstract numbers are also commonly used."
  },
  {
    stateCode: "NM",
    stateName: "New Mexico",
    fields: [
      { id: "nmOcdId", label: "NM OCD ID", type: "text", required: true },
      { id: "nmCountyId", label: "County ID", type: "text", required: true },
      { id: "section", label: "Section", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true }
    ],
    sampleFields: {
      section: "Section 14",
      township: "Township 26S",
      range: "Range 32E"
    },
    textDescription: "Section, Township, and Range format",
    formatNotes: "New Mexico uses the Public Land Survey System (PLSS) with Section, Township, and Range."
  },
  {
    stateCode: "OK",
    stateName: "Oklahoma",
    fields: [
      { id: "okTaxId", label: "Oklahoma Tax ID", type: "text", required: true },
      { id: "section", label: "Section", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true },
    ],
    sampleFields: {
      section: "Section 23",
      township: "Township 4N",
      range: "Range 3W",
    },
    textDescription: "Section, Township, Range format with Indian Meridian",
    formatNotes: "Oklahoma division orders require Section, Township, and Range information. The Indian Meridian is commonly used."
  },
  {
    stateCode: "ND",
    stateName: "North Dakota",
    fields: [
      { id: "section", label: "Section", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true },
      { id: "quarterSection", label: "Quarter Section", type: "text", required: true },
      { id: "spacing", label: "Spacing", type: "text", required: true },
      { id: "ndicWellID", label: "NDIC Well ID", type: "text", required: true },
      { id: "northDakotaLeaseNumber", label: "North Dakota Lease Number", type: "text", required: true },
    ],
    sampleFields: {
      section: "Section 14",
      township: "Township 152N",
      range: "Range 96W",
      quarterSection: "SW/4",
      spacing: "1280-acre spacing unit",
      ndicWellID: "ND-WELL-12345",
      northDakotaLeaseNumber: "ND-LEASE-67890",
      legalDescription:
        "The Southwest Quarter (SW/4) of Section 14, Township 152N, Range 96W, McKenzie County, North Dakota",
    },
    textDescription: "Section 14, Township 152N, Range 96W",
    formatNotes:
      "North Dakota division orders require Section, Township, and Range information. Spacing unit size is often specified.",
  },
  {
    stateCode: "CO",
    stateName: "Colorado",
    fields: [
      { id: "section", label: "Section", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true },
      { id: "cogccWellID", label: "COGCC Well ID", type: "text", required: true },
      { id: "coloradoStateLeaseNumber", label: "Colorado State Lease Number", type: "text", required: true },
    ],
    sampleFields: {
      section: "Section 5",
      township: "Township 20N",
      range: "Range 5E",
      cogccWellID: "CO-WELL-12345",
      coloradoStateLeaseNumber: "CO-LEASE-67890",
      legalDescription: "Section 5, Township 20N, Range 5E, Denver County, Colorado",
    },
    textDescription: "Section 5, Township 20N, Range 5E",
    formatNotes:
      "Colorado division orders use Section, Township, and Range. COGCC Well ID is required for identification.",
  },
  {
    stateCode: "OH",
    stateName: "Ohio",
    fields: [
      { id: "tract", label: "Tract", type: "text", required: true },
      { id: "lot", label: "Lot", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "quarterTownship", label: "Quarter Township", type: "text", required: true },
      { id: "taxParcelID", label: "Tax Parcel ID", type: "text", required: true },
      { id: "odnrWellID", label: "ODNR Well ID", type: "text", required: true },
      { id: "ohioLeaseNumber", label: "Ohio Lease Number", type: "text", required: true },
      { id: "ohioSeveranceTaxID", label: "Ohio Severance Tax ID", type: "text", required: true },
    ],
    sampleFields: {
      tract: "Tract 22",
      lot: "Lot 12",
      township: "Green Township",
      quarterTownship: "SE Quarter",
      taxParcelID: "12-345-67",
      odnrWellID: "OH-WELL-12345",
      ohioLeaseNumber: "OH-LEASE-67890",
      ohioSeveranceTaxID: "OH-STAX-54321",
      legalDescription: "Lot 12, Green Township, Belmont County, Ohio",
    },
    textDescription: "Lot 12, Green Township",
    formatNotes:
      "Ohio uses a unique system based on the Original Land Survey with townships divided into quarters and lots. Tax parcel IDs are essential for property identification.",
  },
  {
    stateCode: "WV",
    stateName: "West Virginia",
    fields: [
      { id: "tract", label: "Tract", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true },
      { id: "wvdepWellAPINumber", label: "WVDEP Well API Number", type: "text", required: true },
      { id: "westVirginiaLeaseNumber", label: "West Virginia Lease Number", type: "text", required: true },
      { id: "westVirginiaSeveranceTaxID", label: "West Virginia Severance Tax ID", type: "text", required: true },
    ],
    sampleFields: {
      tract: "Tract 30",
      township: "Township 10N",
      range: "Range 2E",
      wvdepWellAPINumber: "WV-WELL-12345",
      westVirginiaLeaseNumber: "WV-LEASE-67890",
      westVirginiaSeveranceTaxID: "WV-STAX-54321",
      legalDescription: "Tract 30, Township 10N, Range 2E, Kanawha County, West Virginia",
    },
    textDescription: "Tract 30, Township 10N, Range 2E",
    formatNotes:
      "West Virginia division orders use Tract, Township, and Range. WVDEP Well API Number is required for identification.",
  },
  {
    stateCode: "PA",
    stateName: "Pennsylvania",
    fields: [
      { id: "tract", label: "Tract", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "warrantName", label: "Warrant Name", type: "text", required: true },
      { id: "taxParcelID", label: "Tax Parcel ID", type: "text", required: true },
      { id: "deedBook", label: "Deed Book", type: "text", required: true },
      { id: "padepWellAPINumber", label: "PA DEP Well API Number", type: "text", required: true },
      { id: "pennsylvaniaLeaseNumber", label: "Pennsylvania Lease Number", type: "text", required: true },
      { id: "pennsylvaniaWellPermitNumber", label: "Pennsylvania Well Permit Number", type: "text", required: true },
    ],
    sampleFields: {
      tract: "Tract 45",
      township: "Washington Township",
      warrantName: "Smith Warrant",
      taxParcelID: "12-34-567",
      deedBook: "Book 123, Page 456",
      padepWellAPINumber: "PA-WELL-12345",
      pennsylvaniaLeaseNumber: "PA-LEASE-67890",
      pennsylvaniaWellPermitNumber: "PA-PERM-54321",
      legalDescription: "Tract 45, Washington Township, Washington County, Pennsylvania",
    },
    textDescription: "Tract 45, Washington Township",
    formatNotes:
      "Pennsylvania division orders typically use tract numbers and township names rather than the Section, Township, Range system. Deed book references are important for title verification.",
  },
  {
    stateCode: "LA",
    stateName: "Louisiana",
    fields: [
      { id: "section", label: "Section", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true },
      { id: "parish", label: "Parish", type: "text", required: true },
      { id: "unitDesignation", label: "Unit Designation", type: "text", required: true },
    ],
    sampleFields: {
      section: "Section 4",
      township: "Township 12S",
      range: "Range 4E",
      parish: "Caddo Parish",
      unitDesignation: "HA RA SU",
      legalDescription: "Section 4, Township 12S, Range 4E, Caddo Parish, Louisiana",
    },
    textDescription: "Section 4, Township 12S, Range 4E",
    formatNotes:
      "Louisiana division orders use Section, Township, and Range, but refer to counties as 'parishes'. Unit designations are often included for unitized fields.",
  },
  {
    stateCode: "WY",
    stateName: "Wyoming",
    fields: [
      { id: "section", label: "Section", type: "text", required: true },
      { id: "township", label: "Township", type: "text", required: true },
      { id: "range", label: "Range", type: "text", required: true },
      { id: "quarterSection", label: "Quarter Section", type: "text", required: false },
      { id: "wogccPermitNumber", label: "WOGCC Permit Number", type: "text", required: true },
      { id: "wyomingLeaseNumber", label: "Wyoming Lease Number", type: "text", required: false },
      { id: "federalUnitName", label: "Federal Unit Name", type: "text", required: false }
    ],
    sampleFields: {
      section: "Section 12",
      township: "Township 45N",
      range: "Range 72W",
      quarterSection: "NE/4",
      wogccPermitNumber: "WY-WELL-12345",
      wyomingLeaseNumber: "WY-LEASE-67890",
      federalUnitName: "Buffalo Federal Unit",
      legalDescription: "Section 12, Township 45N, Range 72W, Campbell County, Wyoming"
    },
    textDescription: "Section 12, Township 45N, Range 72W",
    formatNotes: "Wyoming division orders use Section, Township, and Range. WOGCC Permit Numbers are required for well identification. Federal Unit Names are important for federal leases."
  }
]

export const stateFields = stateFieldsData

export function getStateSpecificFields(stateCode: string): StateFieldDefinition {
  const state = stateFields.find((s) => s.stateCode === stateCode)
  if (!state) {
    throw new Error(`No field definitions found for state code: ${stateCode}`)
  }
  return state
}
