// State-specific field definitions for division orders

interface StateFieldDefinition {
  fields: Array<{
    key: string
    label: string
    required: boolean
    validation?: RegExp
  }>
  textDescription: string
  formatNotes: string
}

const stateFields: Record<string, StateFieldDefinition> = {
  // New Mexico
  NM: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "meridian", label: "Meridian", required: true },
      { key: "unitName", label: "Unit Name", required: false },
      { key: "divisionOrderNumber", label: "Division Order Number", required: true },
      { key: "ocdWellID", label: "OCD Well ID", required: true },
      { key: "newMexicoStateLeaseNumber", label: "New Mexico State Lease Number", required: false },
      { key: "blmLeaseNumber", label: "BLM Lease Number", required: false }
    ],
    textDescription: "Section, Township, Range format with New Mexico Principal Meridian",
    formatNotes: "New Mexico division orders require Section, Township, and Range information. The New Mexico Principal Meridian should be specified."
  },

  // Texas
  TX: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "block", label: "Block", required: true },
      { key: "survey", label: "Survey", required: true },
      { key: "abstract", label: "Abstract", required: true },
      { key: "railroadCommissionID", label: "Railroad Commission ID", required: true },
      { key: "texasSeveranceTaxID", label: "Texas Severance Tax ID", required: false },
      { key: "texasLeaseNumber", label: "Texas Lease Number", required: false }
    ],
    textDescription: "Section, Block, Survey, and Abstract format",
    formatNotes: "Texas division orders typically include Section, Block, and Survey information. Abstract numbers are required for proper legal description."
  },

  // Oklahoma
  OK: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "spotting", label: "Spotting", required: true },
      { key: "quarterSection", label: "Quarter Section", required: true },
      { key: "occWellID", label: "OCC Well ID", required: true },
      { key: "oklahomaTaxID", label: "Oklahoma Tax ID", required: true },
    ],
    sampleFields: {
      section: "Section 23",
      township: "Township 4N",
      range: "Range 3W",
      spotting: "C NE/4",
      quarterSection: "NE/4",
      occWellID: "OK-WELL-12345",
      oklahomaTaxID: "OK-TAX-67890",
      legalDescription: "The Northeast Quarter (NE/4) of Section 23, Township 4N, Range 3W, Garfield County, Oklahoma",
    },
    sampleCounty: "Garfield County",
    sampleAPI: "35-047-45678",
    textDescription: "Section 23, Township 4N, Range 3W",
    formatNotes:
      "Oklahoma division orders require Section, Township, and Range information. Spotting information (e.g., C NE/4) is often included for well locations.",
  },

  // North Dakota
  ND: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "quarterSection", label: "Quarter Section", required: true },
      { key: "spacing", label: "Spacing", required: true },
      { key: "ndicWellID", label: "NDIC Well ID", required: true },
      { key: "northDakotaLeaseNumber", label: "North Dakota Lease Number", required: true },
    ],
    sampleFields: {
      section: "Section 18",
      township: "Township 152N",
      range: "Range 102W",
      quarterSection: "SW/4",
      spacing: "1280-acre spacing unit",
      ndicWellID: "ND-WELL-12345",
      northDakotaLeaseNumber: "ND-LEASE-67890",
      legalDescription:
        "The Southwest Quarter (SW/4) of Section 18, Township 152N, Range 102W, McKenzie County, North Dakota",
    },
    sampleCounty: "McKenzie County",
    sampleAPI: "33-053-45678",
    textDescription: "Section 18, Township 152N, Range 102W",
    formatNotes:
      "North Dakota division orders require Section, Township, and Range information. Spacing unit size is often specified.",
    validationErrors: ["Verify spacing unit size matches the legal description."],
  },

  // Colorado
  CO: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "cogccWellID", label: "COGCC Well ID", required: true },
      { key: "coloradoStateLeaseNumber", label: "Colorado State Lease Number", required: true },
    ],
    sampleFields: {
      section: "Section 5",
      township: "Township 20N",
      range: "Range 5E",
      cogccWellID: "CO-WELL-12345",
      coloradoStateLeaseNumber: "CO-LEASE-67890",
      legalDescription: "Section 5, Township 20N, Range 5E, Denver County, Colorado",
    },
    sampleCounty: "Denver County",
    sampleAPI: "16-026-45678",
    textDescription: "Section 5, Township 20N, Range 5E",
    formatNotes:
      "Colorado division orders use Section, Township, and Range. COGCC Well ID is required for identification.",
  },

  // Ohio
  OH: {
    fields: [
      { key: "tract", label: "Tract", required: true },
      { key: "lot", label: "Lot", required: true },
      { key: "township", label: "Township", required: true },
      { key: "quarterTownship", label: "Quarter Township", required: true },
      { key: "taxParcelID", label: "Tax Parcel ID", required: true },
      { key: "odnrWellID", label: "ODNR Well ID", required: true },
      { key: "ohioLeaseNumber", label: "Ohio Lease Number", required: true },
      { key: "ohioSeveranceTaxID", label: "Ohio Severance Tax ID", required: true },
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
    sampleCounty: "Belmont County",
    sampleAPI: "34-013-45678",
    textDescription: "Lot 12, Green Township",
    formatNotes:
      "Ohio uses a unique system based on the Original Land Survey with townships divided into quarters and lots. Tax parcel IDs are essential for property identification.",
  },

  // West Virginia
  WV: {
    fields: [
      { key: "tract", label: "Tract", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "wvdepWellAPINumber", label: "WVDEP Well API Number", required: true },
      { key: "westVirginiaLeaseNumber", label: "West Virginia Lease Number", required: true },
      { key: "westVirginiaSeveranceTaxID", label: "West Virginia Severance Tax ID", required: true },
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
    sampleCounty: "Kanawha County",
    sampleAPI: "36-018-45678",
    textDescription: "Tract 30, Township 10N, Range 2E",
    formatNotes:
      "West Virginia division orders use Tract, Township, and Range. WVDEP Well API Number is required for identification.",
  },

  // Pennsylvania
  PA: {
    fields: [
      { key: "tract", label: "Tract", required: true },
      { key: "township", label: "Township", required: true },
      { key: "warrantName", label: "Warrant Name", required: true },
      { key: "taxParcelID", label: "Tax Parcel ID", required: true },
      { key: "deedBook", label: "Deed Book", required: true },
      { key: "padepWellAPINumber", label: "PA DEP Well API Number", required: true },
      { key: "pennsylvaniaLeaseNumber", label: "Pennsylvania Lease Number", required: true },
      { key: "pennsylvaniaWellPermitNumber", label: "Pennsylvania Well Permit Number", required: true },
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
    sampleCounty: "Washington County",
    sampleAPI: "37-125-45678",
    textDescription: "Tract 45, Washington Township",
    formatNotes:
      "Pennsylvania division orders typically use tract numbers and township names rather than the Section, Township, Range system. Deed book references are important for title verification.",
  },

  // Louisiana
  LA: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "parish", label: "Parish", required: true },
      { key: "unitDesignation", label: "Unit Designation", required: true },
    ],
    sampleFields: {
      section: "Section 4",
      township: "Township 12S",
      range: "Range 4E",
      parish: "Caddo Parish",
      unitDesignation: "HA RA SU",
      legalDescription: "Section 4, Township 12S, Range 4E, Caddo Parish, Louisiana",
    },
    sampleCounty: "Caddo Parish",
    sampleAPI: "17-017-45678",
    textDescription: "Section 4, Township 12S, Range 4E",
    formatNotes:
      "Louisiana division orders use Section, Township, and Range, but refer to counties as 'parishes'. Unit designations are often included for unitized fields.",
  },

  // Wyoming
  WY: {
    fields: [
      { key: "section", label: "Section", required: true },
      { key: "township", label: "Township", required: true },
      { key: "range", label: "Range", required: true },
      { key: "quarterSection", label: "Quarter Section", required: false },
      { key: "wogccPermitNumber", label: "WOGCC Permit Number", required: true },
      { key: "wyomingLeaseNumber", label: "Wyoming Lease Number", required: false },
      { key: "federalUnitName", label: "Federal Unit Name", required: false }
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
    sampleCounty: "Campbell County",
    sampleAPI: "49-005-45678",
    textDescription: "Section 12, Township 45N, Range 72W",
    formatNotes: "Wyoming division orders use Section, Township, and Range. WOGCC Permit Numbers are required for well identification. Federal Unit Names are important for federal leases."
  }
}

export function getStateSpecificFields(stateCode: string): StateFieldDefinition {
  return stateFields[stateCode] || stateFields.TX // Default to Texas if state not found
}

export { stateFields, type StateFieldDefinition };
