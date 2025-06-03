interface State {
  code: string;
  name: string;
  description: string;
}

export const stateData: State[] = [
  {
    code: "TX",
    name: "Texas",
    description: "Permian Basin & Eagle Ford Shale"
  },
  {
    code: "NM",
    name: "New Mexico",
    description: "Delaware Basin & San Juan Basin"
  },
  {
    code: "OK",
    name: "Oklahoma",
    description: "SCOOP/STACK & Anadarko Basin"
  },
  {
    code: "ND",
    name: "North Dakota",
    description: "Bakken Formation"
  },
  {
    code: "LA",
    name: "Louisiana",
    description: "Haynesville Shale"
  },
  {
    code: "PA",
    name: "Pennsylvania",
    description: "Marcellus Shale"
  },
  {
    code: "OH",
    name: "Ohio",
    description: "Utica Shale"
  },
  {
    code: "WV",
    name: "West Virginia",
    description: "Marcellus & Utica Shale"
  },
  {
    code: "CO",
    name: "Colorado",
    description: "Denver-Julesburg Basin"
  },
  {
    code: "WY",
    name: "Wyoming",
    description: "Powder River Basin"
  }
];

export function getStateByCode(code: string): State | undefined {
  return stateData.find(state => state.code === code);
}

export function getStateNameByCode(code: string): string {
  const state = getStateByCode(code);
  return state ? state.name : code;
}
