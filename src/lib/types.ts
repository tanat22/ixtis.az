

/**
 * Represents a single specialty (ixtisas).
 */
export interface Specialty {
  id: string; // A unique ID, combination of faculty code and type.
  facultyCode: number; // The official 6-digit code for the specialty
  year: number; // The year the data is relevant for
  name: string; // Name of the specialty
  note?: string; // Optional note for the specialty
  slug: string; // URL-friendly name
  universityId: number; // Foreign key to the University
  groupId: string; // Foreign key to the Group
  subgroupId?: string; // Optional foreign key to the Subgroup
  level: 'bachelor' | 'college' | 'master'; // Education level
  educationForm: 'əyani' | 'qiyabi'; // Form of education
  educationLanguage: 'az' | 'ru' | 'en' | 'tr'; // Language of instruction
  educationType: 'Dövlət sifarişli' | 'Ödənişli';
  score: number | null; // Passing score
  planCount: number | null; // Planned number of students
  cost: number | string | null; // Cost of education
}

export interface FacultyDetails {
    name: string;
    slug: string;
    description: string;
    future: string;
    job_opportunities: string;
    possible_positions: string[];
    recommendations: string;
}


/**
 * Represents a university or a college.
 */
export interface University {
  id: number; // Unique identifier
  name: string; // Name of the university or college
}

/**
 * Represents a major group for admissions (I, II, III, IV, V).
 */
export interface Group {
  id: string; // e.g., 'group-1', 'group-2'
  name: string; // e.g., 'I Qrup'
}

/**
 * Represents a sub-group within a major group.
 */
export interface Subgroup {
  id: string; // e.g., 'sub-1-ri'
  groupId: string;
  name: string; // e.g., 'Rİ'
}


/**
 * Represents a direction or field of study for specialties.
 */
export interface SpecialtyDirection {
    id: number;
    name: string;
}

export interface UniversityNote {
    note_no: string;
    ali_tehsil_muessisesi: string;
    qeyd: string;
}

export interface UniversityDetails {
    id: number;
    rector: string;
    founded: string;
    address: string;
    website?: string;
    branches?: string[];
    history: string;
}

export interface UniversityInfo extends University {
    notes?: UniversityNote[];
    details?: UniversityDetails;
}

// Navigation Types

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode; // Or a more specific icon type
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export interface NavLink extends NavItem {
  label?: string;
}
