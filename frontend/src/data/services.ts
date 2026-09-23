// ==============================================================================
// Genesis Power Equipments Pvt. Ltd. — Master Services Data
// ==============================================================================

import { Service } from "../types";

export interface DetailedService extends Service {
  short_description: string;
  tagline: string;
  icon: string;
  scope_points: string[];
  deliverables: string[];
  ideal_for: string;
}

export const SERVICES: DetailedService[] = [
  {
    id: 1,
    title: "Annual Maintenance Contracts (AMC)",
    slug: "annual-maintenance-contracts",
    tagline: "Proactive, multi-tier maintenance agreements to guarantee maximum power system uptime",
    short_description: "Structured preventive and comprehensive maintenance agreements covering UPS systems, static voltage stabilizers, and industrial power conditioning equipment.",
    description: "Unplanned power equipment downtime can halt operations and cause catastrophic data or production losses. Genesis Annual Maintenance Contracts (AMC) offer planned preventive service schedules, fluid and capacitor diagnostics, thermal imaging of critical power connections, and dedicated emergency breakdown response to ensure continuous reliability.",
    icon: "ShieldCheck",
    scope_points: [
      "Scheduled quarterly / bi-monthly preventive maintenance site inspections",
      "Thermal infrared scanning of electrical busbars, breakers, and power terminals",
      "Comprehensive battery conductance, internal resistance, and voltage cell testing",
      "Dust decontamination, cooling fan inspection, and mechanical connection tightening",
      "Control firmware diagnostic verification and operational parameter calibration"
    ],
    deliverables: [
      "Detailed preventive maintenance health inspection audit report",
      "Priority response SLA for unscheduled breakdown service calls",
      "Battery degradation tracking and replacement lifecycle recommendations",
      "Genuine OEM replacement parts guarantee under comprehensive contracts"
    ],
    ideal_for: "Hospitals, manufacturing facilities, continuous process plants, and data centers requiring guaranteed uptime.",
    image_url: "/images/services/amc-service.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Preventive & Corrective Maintenance",
    slug: "preventive-corrective-maintenance",
    tagline: "Rapid response field engineering and precision component-level diagnostics",
    short_description: "On-demand troubleshooting, sub-assembly overhauls, PCB repair, and emergency restorative engineering for power electronics and stabilizers.",
    description: "When power equipment malfunctions, time is of the essence. Genesis maintains a dedicated team of certified field service engineers equipped with advanced diagnostic instruments, calibrated load banks, and genuine spare parts to rapidly isolate faults, restore operations, and execute preventive corrective measures.",
    icon: "Wrench",
    scope_points: [
      "On-site fault isolation and component-level diagnostic evaluation",
      "Inverter bridge, rectifier sub-assembly, and static switch troubleshooting",
      "Servo motor, carbon brush, and buck-boost transformer refurbishment",
      "Emergency restorative power restoration and temporary bypass coordination",
      "Root cause analysis (RCA) reporting to prevent recurring failure modes"
    ],
    deliverables: [
      "Immediate on-site technical triage and emergency repair execution",
      "Comprehensive Root Cause Failure Analysis (RCFA) documentation",
      "Re-commissioning functional load test confirmation certificate"
    ],
    ideal_for: "Commercial facilities, printing presses, and manufacturing units experiencing unexpected power equipment faults.",
    image_url: "/images/services/corrective-maintenance.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3,
    title: "Power Quality Audit & Harmonic Analysis",
    slug: "power-quality-audit",
    tagline: "In-depth electrical profiling to identify harmonics, voltage sags, and ground loops",
    short_description: "Comprehensive site power profiling utilizing calibrated power quality analyzers to diagnose harmonics, transients, power factor, and unbalance.",
    description: "Modern non-linear electrical loads — such as variable frequency drives (VFDs), server switch-mode supplies, and LED ballasts — inject severe harmonic distortions into distribution networks. Genesis power quality engineers deploy Class-A power quality analyzers to record, diagnose, and prescribe targeted mitigation strategies for harmonic heating, nuisance tripping, and neutral overcurrents.",
    scope_points: [
      "Continuous logging of voltage, current, active/reactive power, and power factor",
      "Detailed Total Harmonic Distortion (THD-V & THD-I) harmonic spectrum measurement up to the 50th order",
      "Measurement of phase voltage unbalance, neutral-to-ground voltage, and transient surges",
      "Evaluation of transformer K-factor and thermal loading under harmonic stress",
      "Mitigation recommendations covering active harmonic filters (AHF) and detuned capacitor banks"
    ],
    deliverables: [
      "Class-A certified electrical power quality comprehensive audit dossier",
      "Harmonic compliance evaluation against IEEE 519 standards",
      "Cost-benefit analysis of suggested corrective conditioning equipment"
    ],
    ideal_for: "Facilities experiencing inexplicable breaker trips, motor overheating, or sensitive medical equipment interference.",
    icon: "Activity",
    image_url: "/images/services/power-quality-audit.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 4,
    title: "Load Bank Testing & Commissioning",
    slug: "load-bank-testing-commissioning",
    tagline: "Rigorous full-load verification before putting critical power assets into service",
    short_description: "Controlled resistive and reactive load bank testing to validate UPS autonomy, battery discharge capacity, and thermal stability under 100% full rated load.",
    description: "Testing power equipment under actual building load carries significant operational risks. Genesis provides mobile, calibrated resistive load bank testing services to stress-test UPS systems, stabilizers, and standby generators across 25%, 50%, 75%, and 100% load steps. This validates battery runtime, cooling efficacy, and transfer switch performance without endangering live facility operations.",
    scope_points: [
      "Step-by-step stepped loading: 25%, 50%, 75%, 100%, and overload withstand verification",
      "Real-time continuous measurement of voltage regulation, frequency stability, and thermal gradients",
      "Battery discharge capacity test to ascertain true ampere-hour reserve and cell degradation",
      "Mains failure simulation to verify seamless static bypass and battery inverter transfer times",
      "Comprehensive pre-commissioning safety interlock and protection relay verification"
    ],
    deliverables: [
      "Certified full-load acceptance test report with step-load curve graphs",
      "Battery individual cell discharge voltage and discharge rate validation sheet",
      "Formal engineering site commissioning handover certificate"
    ],
    ideal_for: "Newly installed power equipment acceptance, annual data center audits, and hospital accreditation compliance.",
    icon: "Gauge",
    image_url: "/images/services/load-testing.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 5,
    title: "Turnkey Power System Integration",
    slug: "turnkey-power-system-integration",
    tagline: "End-to-end engineering from requirement sizing to electrical switchgear commissioning",
    short_description: "Full-lifecycle turnkey engineering: site sizing, electrical single line diagram design, distribution switchgear, bypass panels, and installation.",
    description: "Beyond standalone equipment supply, Genesis Power Equipments Pvt. Ltd. executes turnkey power engineering projects. From calculating starting inrush currents and diversity factors to installing synchronized distribution panels, manual maintenance bypass cubicles, and battery room racking, we provide complete, engineered power resilience.",
    scope_points: [
      "Site survey, electrical load profile sizing, and single-line diagram (SLD) engineering",
      "Custom fabrication of external maintenance bypass panels and distribution switchboards",
      "Seismic battery racking, DC disconnect switchgear, and safety ventilation planning",
      "Cable tray routing, power cabling termination, and system earthing grid verification",
      "System integration testing with standby diesel generators and facility management systems"
    ],
    deliverables: [
      "Complete electrical schematic drawings and as-built engineering documentation",
      "Fully integrated, tested, and commissioned power protection plant",
      "Operator on-site training and maintenance procedure manuals"
    ],
    ideal_for: "New facility construction, factory expansions, healthcare diagnostic wing upgrades, and infrastructure modernizations.",
    icon: "Layers",
    image_url: "/images/services/turnkey-integration.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  }
];

export const getAllServices = (): DetailedService[] => {
  return SERVICES.filter((s) => s.is_active);
};

export const getServiceBySlug = (slug?: string): DetailedService | undefined => {
  if (!slug) return undefined;
  return SERVICES.find((s) => s.slug.toLowerCase() === slug.toLowerCase() && s.is_active);
};
