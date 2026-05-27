import { AnalysisResults } from './types';

export const MOCK_SAMPLES: Record<string, AnalysisResults> = {
  'sample-rental': {
    document: {
      id: 'sample-rental',
      fileName: 'Residential_Lease_Agreement_Draft.pdf',
      fileSize: 421000,
      blobUrl: '',
      docType: 'rental_agreement',
      pageCount: 3,
      clauseCount: 12,
      fileHash: 'sha256-mockrental12345',
      createdAt: new Date().toISOString()
    },
    clauses: [
      {
        id: 'c1',
        documentId: 'sample-rental',
        index: 1,
        text: 'The Security Deposit of $3,500 shall be held by Landlord. Landlord shall have the right to retain the entirety of the deposit if Tenant vacates the premises prior to the expiration of the full 24-month term, regardless of whether a replacement tenant is secured, and Landlord shall not be required to provide an itemized list of damages or deductions.',
        category: 'payment terms',
        confidence: 0.92,
        riskLevel: 'critical',
        riskScore: 95,
        riskReason: 'Unilateral retention of security deposit without itemized deduction accountability.',
        explanation: 'This clause allows the landlord to forfeit your entire security deposit without explaining what damages occurred. In most jurisdictions, landlords must legally provide an itemized list of deductions within 14-30 days.',
        counterClause: 'The Security Deposit shall be returned to Tenant within 21 days of lease termination, less any documented, itemized deductions for actual damage beyond normal wear and tear. If Landlord fails to provide an itemized list of deductions within 21 days, the entire deposit shall be refunded immediately.',
        pageNumber: 1,
        startOffset: 120,
        endOffset: 340
      },
      {
        id: 'c2',
        documentId: 'sample-rental',
        index: 2,
        text: 'Tenant shall be solely responsible for all maintenance, repairs, and upkeep of the premises including structural foundations, roof leaks, plumbing backups, and electrical wiring systems, and shall execute all repairs at Tenant\'s sole expense within 5 days of occurrence.',
        category: 'maintenance',
        confidence: 0.95,
        riskLevel: 'high',
        riskScore: 82,
        riskReason: 'Forcing the tenant to cover major structural repairs at their own expense.',
        explanation: 'This shifts structural maintenance costs to you. Legally and traditionally, landlords are responsible for maintaining a habitable dwelling, which covers structural elements, roofing, and primary utility lines.',
        counterClause: 'Landlord shall maintain all structural foundations, roof structures, electrical, heating, ventilation, and plumbing systems in good, habitable working order. Tenant shall be responsible only for minor routine maintenance and cleaning under $100 per occurrence.',
        pageNumber: 1,
        startOffset: 410,
        endOffset: 650
      },
      {
        id: 'c3',
        documentId: 'sample-rental',
        index: 3,
        text: 'Landlord reserves the right to enter the premises at any time, without prior notice, for inspections, general repairs, showing the property to prospective purchasers or tenants, or for any other reason deemed fit by Landlord.',
        category: 'notice requirements',
        confidence: 0.88,
        riskLevel: 'high',
        riskScore: 78,
        riskReason: 'Unrestricted entry permissions violating covenant of quiet enjoyment.',
        explanation: 'This clause strips away your right to privacy. Landlords must traditionally give at least 24 hours written notice before entering, except in extreme emergencies (like fire or flood).',
        counterClause: 'Landlord shall provide Tenant with at least 24 hours prior written notice of intent to enter, and entry shall be limited to normal business hours (9 AM to 6 PM) for actual repairs or scheduled showings, except in the case of a bona fide emergency.',
        pageNumber: 2,
        startOffset: 700,
        endOffset: 890
      },
      {
        id: 'c4',
        documentId: 'sample-rental',
        index: 4,
        text: 'This agreement shall automatically renew for successive 1-year terms at a rent increase of 15% per annum unless either party provides written notice of non-renewal at least 90 days prior to the expiration date.',
        category: 'renewal terms',
        confidence: 0.91,
        riskLevel: 'medium',
        riskScore: 45,
        riskReason: 'Strict automatic renewal window with steep pre-committed rent escalation rate.',
        explanation: 'The automatic renewal locks you in easily with a steep 15% hike. Standard market hikes range between 3-7% depending on market indexes.',
        counterClause: 'Upon expiration of the initial term, this agreement shall continue on a month-to-month basis under the same terms. Any rent escalation for a renewed fixed term shall be negotiated in good faith and capped at a maximum of 5% over the previous rate.',
        pageNumber: 3,
        startOffset: 950,
        endOffset: 1120
      }
    ],
    analysis: {
      id: 'a-rental',
      documentId: 'sample-rental',
      status: 'completed',
      overallScore: 75,
      summary: 'This Residential Lease Agreement contains severe tenant liabilities and structural cost shifts. Critical focus is required on the security deposit forfeiture rules, the allocation of roof and structural repairs, and landlord right-of-entry notice bounds.',
      topThingsToKnow: [
        'Security deposit can be retained entirely without any itemized explanations or deductions.',
        'You are legally committed to paying for structural roof and plumbing failures yourself.',
        'The landlord can enter your home at any hour without any warning or permission.'
      ],
      missingClauses: [
        {
          id: 'm1',
          name: 'Late Rent Grace Period',
          whyMatters: 'Protects you from immediate penalty fees if a bank transfer delays rent by 1 or 2 days.',
          templateClause: 'A grace period of five (5) days is granted for rent payments. No late fees shall accrue or be charged until the sixth day following the due date.',
          status: 'missing'
        },
        {
          id: 'm2',
          name: 'Right to Sublet',
          whyMatters: 'Allows you to assign the lease if you get a job elsewhere or must move prior to lease expiration.',
          templateClause: 'Tenant shall have the right to sublease or assign the premises subject to the prior written consent of Landlord, which consent shall not be unreasonably withheld or delayed.',
          status: 'missing'
        }
      ],
      negotiationGuide: {
        pushBackClauses: [
          {
            clauseSummary: 'Demand returning the structural repair liability back to the landlord.',
            suggestedWording: 'Landlord shall keep foundations, roof, and central systems in safe working order.'
          },
          {
            clauseSummary: 'Force landlord entry to require a mandatory 24h warning notification.',
            suggestedWording: 'Except in emergency, Landlord must provide at least 24 hours prior written notice before entry.'
          }
        ],
        dos: [
          'Request an inventory check list signed by both parties before moving in.',
          'Always communicate lease terms and notices in writing rather than phone calls.'
        ],
        donts: [
          'Never agree to pay cash for rent without receiving a written signed receipt immediately.',
          'Do not sign agreements containing empty dates or unresolved blank spaces.'
        ],
        marketTerms: [
          {
            metric: 'Late payment penalty fee',
            standard: 'Typically capped at 5% of monthly rent amount.'
          },
          {
            metric: 'Rent Escalation Rate',
            standard: 'Capped at 5-8% depending on consumer price index trends.'
          }
        ]
      },
      stage: 'completed',
      error: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  },
  'sample-employment': {
    document: {
      id: 'sample-employment',
      fileName: 'Software_Engineer_Contract_Offer.pdf',
      fileSize: 512000,
      blobUrl: '',
      docType: 'employment_contract',
      pageCount: 4,
      clauseCount: 15,
      fileHash: 'sha256-mockemployment12345',
      createdAt: new Date().toISOString()
    },
    clauses: [
      {
        id: 'ec1',
        documentId: 'sample-employment',
        index: 1,
        text: 'Employee agrees that during their employment and for a period of three (3) years post-termination, Employee shall not engage directly or indirectly in any business activity that competes with Company, or perform software engineering services for any competitor anywhere in the global market.',
        category: 'non-compete',
        confidence: 0.94,
        riskLevel: 'critical',
        riskScore: 92,
        riskReason: 'Perpetual global non-compete for three full years post-employment.',
        explanation: 'A 3-year global non-compete is incredibly restrictive and practically bars you from earning a living in software development after leaving. Legally, courts often throw out non-competes longer than 6-12 months or those without narrow geographical and sector boundaries.',
        counterClause: 'During employment and for six (6) months post-termination, Employee shall not engage in software services for direct competitors in the specific metropolitan area of Company\'s headquarters.',
        pageNumber: 2,
        startOffset: 250,
        endOffset: 500
      },
      {
        id: 'ec2',
        documentId: 'sample-employment',
        index: 2,
        text: 'Company shall own all intellectual property, source code, designs, and systems conceived or created by Employee during the term of employment, including creations developed entirely on Employee\'s personal time, using personal equipment, and completely unrelated to Company\'s business scope.',
        category: 'intellectual property',
        confidence: 0.96,
        riskLevel: 'critical',
        riskScore: 98,
        riskReason: 'Overreaching IP assignment claiming personal hobbies outside work scope.',
        explanation: 'This clause strips away ownership of your side projects or personal software built outside working hours on personal devices. Legally, employers can only claim IP developed for work or using company equipment.',
        counterClause: 'Company shall own all intellectual property created by Employee (a) during standard working hours, or (b) directly related to the actual products or business operations of Company, or (c) developed using Company resources and hardware.',
        pageNumber: 2,
        startOffset: 550,
        endOffset: 820
      }
    ],
    analysis: {
      id: 'a-employment',
      documentId: 'sample-employment',
      status: 'completed',
      overallScore: 84,
      summary: 'This employment offer contains highly aggressive covenants. Focus on revising the global 3-year non-compete bounds and correcting the overreaching intellectual property clauses which claim ownership over your personal side projects.',
      topThingsToKnow: [
        'You cannot work for any software developer worldwide for 3 years after leaving.',
        'Any personal side projects built in your free time on personal computers belong to the company.',
        'Notice period is 3 months, but the company can terminate you immediately with zero severance.'
      ],
      missingClauses: [
        {
          id: 'em1',
          name: 'Severance Protection',
          whyMatters: 'Guarantees financial support if the company terminates you for convenience or budget cuts.',
          templateClause: 'In the event of termination by Company without cause, Employee shall receive severance pay equivalent to three (3) months of base salary.',
          status: 'missing'
        }
      ],
      negotiationGuide: {
        pushBackClauses: [
          {
            clauseSummary: 'Demand limiting the IP assignment to actual company related duties.',
            suggestedWording: 'Employee assigns IP developed for Company business or utilizing Company equipment.'
          },
          {
            clauseSummary: 'Reduce the non-compete duration from 3 years down to 6 months.',
            suggestedWording: 'The post-termination non-compete covenant shall be limited to six (6) months.'
          }
        ],
        dos: [
          'Verify equity vesting cliffs and parameters before signing stock grant agreements.',
          'Confirm that performance bonuses are structured on clear metrics in writing.'
        ],
        donts: [
          'Never agree to a verbal salary promise that is not explicitly mirrored inside the offer letter.',
          'Avoid starting work before both parties have signed the final contract.'
        ],
        marketTerms: [
          {
            metric: 'Post-termination Non-compete',
            standard: 'Typically capped at 6 to 12 months with localized geographic constraints.'
          },
          {
            metric: 'IP Ownership standard',
            standard: 'Limited strictly to creations built inside working hours or for direct business usage.'
          }
        ]
      },
      stage: 'completed',
      error: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  },
  'sample-nda': {
    document: {
      id: 'sample-nda',
      fileName: 'Mutual_NonDisclosure_Agreement.pdf',
      fileSize: 310000,
      blobUrl: '',
      docType: 'nda',
      pageCount: 2,
      clauseCount: 9,
      fileHash: 'sha256-mocknda12345',
      createdAt: new Date().toISOString()
    },
    clauses: [
      {
        id: 'nc1',
        documentId: 'sample-nda',
        index: 1,
        text: 'The Receiving Party\'s obligations to protect all Confidential Information shared under this agreement shall remain in effect perpetually and indefinitely, regardless of whether negotiations terminate or this agreement expires.',
        category: 'confidentiality',
        confidence: 0.95,
        riskLevel: 'high',
        riskScore: 75,
        riskReason: 'Perpetual confidentiality obligation with no termination release date.',
        explanation: 'Perpetual obligations are extremely difficult to manage practically and pose massive liability risks over time. Standard NDAs cap confidentiality at 2-5 years after which standard trade info becomes public.',
        counterClause: 'Confidentiality obligations under this Agreement shall remain in effect for a period of three (3) years following the date of initial disclosure.',
        pageNumber: 1,
        startOffset: 150,
        endOffset: 340
      }
    ],
    analysis: {
      id: 'a-nda',
      documentId: 'sample-nda',
      status: 'completed',
      overallScore: 68,
      summary: 'This Mutual Non-Disclosure Agreement carries typical but heavy corporate burdens. Focus on capping the indefinite confidentiality terms to a standard 2-3 years, and verify the exclusions rules for public information.',
      topThingsToKnow: [
        'You are legally bound to protect the confidentiality of shared records forever.',
        'Even ideas created independently can be contested under these wide definition parameters.',
        'Breaching this terms exposes you to severe immediate injunctive relief blockades.'
      ],
      missingClauses: [
        {
          id: 'nm1',
          name: 'Permitted Disclosures',
          whyMatters: 'Allows you to reveal details to accountants, lawyers, or tax regulators when legally required without breach.',
          templateClause: 'Receiving Party may disclose Confidential Information to its professional legal counsel, auditors, or when required by a court of competent jurisdiction.',
          status: 'missing'
        }
      ],
      negotiationGuide: {
        pushBackClauses: [
          {
            clauseSummary: 'Limit the duration of the confidentiality obligations.',
            suggestedWording: 'The obligations of confidentiality shall expire three years from the date of disclosure.'
          }
        ],
        dos: [
          'Mark all confidential slide decks with a clear "Confidential" header stamp.',
          'Verify if the other party is also equally bound by a mutual disclosure clause.'
        ],
        donts: [
          'Do not share trade secrets before both signatures are finalized on the agreement.',
          'Avoid NDAs that require you to return materials physically without digital email options.'
        ],
        marketTerms: [
          {
            metric: 'Confidentiality Duration',
            standard: 'Typically 2 to 5 years from disclosure date.'
          }
        ]
      },
      stage: 'completed',
      error: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  }
};
