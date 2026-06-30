// =============================================================================
// OFAC SDN MOCK  (demoLand only)
// -----------------------------------------------------------------------------
// Shape mirrors the real OFAC SDN record (see docs/OFAC_SCREENING_DESIGN.md).
// EVERY ENTRY IS FICTIONAL. These do NOT represent real sanctioned people.
// In realDeal this is replaced by the real published OFAC SDN / Consolidated
// data, reduced to screening keys and published as a Merkle root.
// =============================================================================

export const ofacSdnMock = {
  publishInfo: {
    recordCount: 4,
    publishDate: '2026-06-20',
    source: 'MOCK — fictional, shaped to match OFAC SDN. NOT real designations.',
  },
  entries: [
    {
      uid: '90001',
      sdnType: 'Individual',
      firstName: 'Juan',
      lastName: 'Ejemplo Sancionado',
      title: '(fictional official)',
      programList: ['VENEZUELA', 'VENEZUELA-EO13850'],
      akaList: [{ type: 'aka', category: 'strong', lastName: 'El Ejemplo' }],
      idList: [{ idType: 'Passport', idNumber: 'X0000000', idCountry: 'Venezuela' }],
      nationalityList: ['Venezuela'],
      remarks: 'FICTIONAL test entry.',
      // Derived screening keys (here: demo wallet ids that hash into the denylist):
      screeningKeys: ['wallet:0xBANNED0001', 'pp:X0000000'],
    },
    {
      uid: '90002',
      sdnType: 'Entity',
      lastName: 'Empresa Ficticia Bloqueada S.A.',
      programList: ['VENEZUELA-EO13884'],
      remarks: 'FICTIONAL test entity.',
      screeningKeys: ['wallet:0xBANNED0002'],
    },
    {
      uid: '90003',
      sdnType: 'Individual',
      firstName: 'María',
      lastName: 'Persona Ejemplo',
      programList: ['SDGT'],
      remarks: 'FICTIONAL test entry.',
      screeningKeys: ['wallet:0xBANNED0003'],
    },
    {
      uid: '90004',
      sdnType: 'Vessel',
      lastName: 'M/V Barco Ficticio',
      programList: ['VENEZUELA'],
      remarks: 'FICTIONAL test vessel.',
      screeningKeys: ['wallet:0xBANNED0004'],
    },
  ],
};

// Flattened set of banned screening keys, as the donor-side would check against
// the published denylist root. (demoLand uses a plain Set; realDeal uses a
// sorted/sparse Merkle non-membership proof.)
export const bannedScreeningKeys = new Set(
  ofacSdnMock.entries.flatMap((e) => e.screeningKeys || []),
);
