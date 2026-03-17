export const necCodeDocs = [
  {
    id: 'nec-1',
    title: 'NEC Article 110 - Requirements for Electrical Installations',
    content: `Article 110 of the NEC covers general requirements for electrical installations. Key provisions include:

110.3(B) Installation and Use: Listed or labeled equipment shall be installed and used in accordance with any instructions included in the listing or labeling.

110.5 Conductors: Conductors normally used to carry current shall be of copper unless otherwise provided. Where the conductor material is not specified, the material and sizes given in the text shall apply to copper conductors.

110.7 Insulation Integrity: Completed wiring installations shall be free from short circuits and ground faults.

110.12 Mechanical Execution of Work: Electrical equipment shall be installed in a neat and workmanlike manner.

110.16 Arc-Flash Hazard Warning: Service equipment, switchboards, panelboards, and motor control centers shall be field marked with a label containing the available incident energy or required level of PPE.`,
    section: 'Article 110',
    category: 'general',
  },
  {
    id: 'nec-2',
    title: 'NEC Article 250 - Grounding and Bonding',
    content: `Article 250 provides requirements for grounding and bonding of electrical systems and equipment:

250.4 General Requirements for Grounding and Bonding:
(A) Grounded Systems: Electrical systems that are grounded shall be connected to earth in a manner that will limit the voltage imposed by lightning, line surges, or unintentional contact with higher-voltage lines.

250.24 Grounding Service-Supplied AC Systems:
(A) System Grounding Connections: A premises wiring system supplied by a grounded AC service shall have a grounding electrode conductor connected to the grounded service conductor.

250.52 Grounding Electrodes:
(A) Electrodes Permitted for Grounding: Metal underground water pipe, metal frame of building, concrete-encased electrode, ground ring, rod and pipe electrodes, and other listed electrodes.

250.94 Bonding for Communication Systems: An intersystem bonding termination for connecting intersystem bonding conductors shall be provided.

250.104 Bonding of Piping Systems and Exposed Structural Steel: Metal water piping systems, metal sprinkler piping, and exposed structural steel shall be bonded to the service equipment enclosure.`,
    section: 'Article 250',
    category: 'grounding',
  },
  {
    id: 'nec-3',
    title: 'NEC Article 310 - Conductors for General Wiring',
    content: `Article 310 covers general requirements for conductors and their type designations:

310.4 Conductors in Parallel: Aluminum, copper-clad aluminum, or copper conductors of size 1/0 AWG and larger shall be permitted to be connected in parallel.

310.15 Ampacities for Conductors Rated 0-2000 Volts:
(A) General: The ampacity of conductors shall be determined by the tables in this article or by calculation under engineering supervision.

310.16 Allowable Ampacities of Insulated Conductors: Table 310.16 provides allowable ampacities for insulated conductors rated up to 2000V.

Temperature Ratings: Conductors with 60°C, 75°C, and 90°C insulation ratings are covered. The temperature rating of the conductor must be compatible with the connected equipment.

Conductor Types: THHN, THW, THWN, XHHW, and other common insulation types are defined with their temperature and moisture ratings.`,
    section: 'Article 310',
    category: 'conductors',
  },
  {
    id: 'nec-4',
    title: 'NEC Article 408 - Switchboards, Switchgear, and Panelboards',
    content: `Article 408 covers requirements for switchboards, switchgear, and panelboards:

408.3 Support and Arrangement of Busbars and Conductors: Busbars shall be protected from physical damage and shall be firmly secured.

408.20 Overcurrent Protection: Each switchboard, switchgear, or panelboard shall be individually protected on the supply side by not more than two overcurrent devices.

408.36 Overcurrent Protection: Panelboards shall be protected by not more than two main circuit breakers or sets of fuses having a combined rating not greater than that of the panelboard.

408.38 Switchboards in Hazardous Locations: Switchboards installed in hazardous locations shall comply with the requirements of Articles 500 through 516.

408.40 Grounding of Panelboards: Panelboard cabinets and frames shall be in physical contact with each other and shall be grounded.`,
    section: 'Article 408',
    category: 'equipment',
  },
  {
    id: 'nec-5',
    title: 'NEC Article 430 - Motors, Motor Circuits, and Controllers',
    content: `Article 430 covers requirements for motors, motor circuits, and controllers:

430.6 Ampacity and Motor Rating Determination: The size of conductors for motor circuits shall be determined based on the values given in Table 430.247 through Table 430.250.

430.22 Single Motor Branch Circuit Conductors: Conductors supplying a single motor shall have an ampacity not less than 125 percent of the motor full-load current rating.

430.32 Continuous-Duty Motors: Each continuous-duty motor rated more than 1 hp shall be protected against overload by a separate overload device.

430.52 Rating or Setting for Individual Motor Circuit: The short-circuit and ground-fault protective device shall be capable of carrying the starting current of the motor.

430.109 Type: Motor controllers shall be rated in horsepower and shall be capable of interrupting the locked-rotor current of the motor.`,
    section: 'Article 430',
    category: 'motors',
  },
  {
    id: 'nec-6',
    title: 'NEC Article 210 - Branch Circuits',
    content: `Article 210 provides requirements for branch circuits supplying lighting and receptacle outlets:

210.8 Ground-Fault Circuit-Interrupter Protection for Personnel: GFCI protection shall be provided for all 125V, single-phase, 15A and 20A receptacles installed in bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens, laundry areas, and within 6 feet of sinks.

210.11 Branch Circuit Requirements:
(A) Number of Branch Circuits: The minimum number of branch circuits shall be determined by the total calculated load and the size of the circuits used.
(B) Load Evenly Proportioned: The load shall be evenly distributed among multioutlet branch circuits.

210.12 Arc-Fault Circuit-Interrupter Protection: All 120V, single-phase, 15A and 20A branch circuits supplying outlets or devices in dwelling unit bedrooms, family rooms, dining rooms, living rooms, parlors, libraries, dens, sunrooms, recreation rooms, closets, hallways, or similar rooms shall be protected by AFCI.

210.52 Dwelling Unit Receptacle Outlets: Receptacle outlets shall be installed at specific locations including walls 2 feet or more wide, bathrooms, hallways 10 feet or longer, and at least one per countertop space in kitchens.`,
    section: 'Article 210',
    category: 'branch-circuits',
  },
  {
    id: 'nec-7',
    title: 'NEC Article 300 - Wiring Methods',
    content: `Article 300 covers general requirements for wiring methods:

300.3 Conductors:
(A) Single Conductors: Single conductors shall only be used where installed as part of a recognized wiring method.
(B) Conductors of the Same Circuit: All conductors of the same circuit and all equipment grounding conductors shall be contained within the same raceway, cable, or trench.

300.4 Protection Against Physical Damage: Where subject to physical damage, conductors shall be protected by raceways, sheaths, or other means.

300.5 Underground Installations: Direct burial cable and conductors shall be installed to meet the minimum cover requirements based on the wiring method and location.

300.11 Securing and Supporting: Nonmetallic-sheathed cable shall be secured at intervals not exceeding 4.5 feet and within 12 inches of every outlet box.

300.13 Mechanical and Electrical Continuity: Conductors in raceways shall be continuous between outlets and devices.`,
    section: 'Article 300',
    category: 'wiring-methods',
  },
  {
    id: 'nec-8',
    title: 'NEC Article 500 - Hazardous Locations - Classifications',
    content: `Article 500 covers the classification of hazardous locations:

500.5 Classifications of Locations:
(A) Classes: Locations are classified as Class I (flammable gases), Class II (combustible dust), or Class III (ignitible fibers).
(B) Groups: Each class is further divided into groups based on the specific hazardous material present.

500.6 Protection Techniques: Various protection techniques include explosionproof equipment, dust-ignitionproof equipment, purging and pressurization, and intrinsic safety.

500.8 Equipment: Equipment for hazardous locations shall be marked to show the class, group, and operating temperature or temperature range.

Class I Locations: Locations in which flammable gases or vapors are or may be present in the air in quantities sufficient to produce explosive or ignitible mixtures.

Class II Locations: Locations that are hazardous because of the presence of combustible dust.

Class III Locations: Locations in which easily ignitible fibers or materials producing combustible flyings are handled, manufactured, or used.`,
    section: 'Article 500',
    category: 'hazardous-locations',
  },
];
