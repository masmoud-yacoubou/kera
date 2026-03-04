/**
 * TYPES & INTERFACES
 */

export type TransactionType = "income" | "expense";

export type Category =
  | "Loisirs"
  | "Alimentation"
  | "Logement"
  | "Santé"
  | "Transport"
  | "Revenus";

export type Currency =
  | "€" | "$" | "£" | "CHF" | "CAD" | "JPY"
  | "MAD" | "XOF" | "XAF" | "DZD" | "TND"
  | "GHS" | "NGN" | "ZAR" | "AED";

export type Theme = "light" | "dark";
export type Lang = "fr" | "en";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  label: string;
  category: Category;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  currency: Currency;
  month_start_day: number;
  theme: Theme;
  created_at: string;
  updated_at: string;
}

export type TransactionInsert = Omit<
  Transaction,
  "id" | "user_id" | "created_at" | "updated_at"
>;

/**
 * CONSTANTES & CONFIGURATION
 */

// Couleurs distinctes optimisées pour le mode sombre (Thème Sahara/Fintech)
export const CATEGORY_COLORS: Record<Category, string> = {
  // On utilise un rouge plus "alerte" et moins "branding" pour la santé
  Santé:        "#FF4D4D", 
  Alimentation: "#D4522A", // Ton rouge branding reste ici
  Logement:     "#2D7D5F", 
  Revenus:      "#F5B841", 
  Loisirs:      "#8B5CF6", 
  Transport:    "#3B82F6", 
};

export const CATEGORIES: Category[] = [
  "Loisirs",
  "Alimentation",
  "Logement",
  "Santé",
  "Transport",
  "Revenus",
];

export const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: "€",   label: "Euro",           symbol: "€"   },
  { code: "$",   label: "Dollar US",      symbol: "$"   },
  { code: "£",   label: "Livre Sterling", symbol: "£"   },
  { code: "CHF", label: "Franc Suisse",   symbol: "CHF" },
  { code: "CAD", label: "Dollar CA",      symbol: "CA$" },
  { code: "JPY", label: "Yen",            symbol: "¥"   },
  { code: "MAD", label: "Dirham",         symbol: "MAD" },
  { code: "XOF", label: "FCFA (UEMOA)",   symbol: "XOF" },
  { code: "XAF", label: "FCFA (CEMAC)",   symbol: "XAF" },
  { code: "DZD", label: "Dinar Algérien", symbol: "DZD" },
  { code: "TND", label: "Dinar Tunisien", symbol: "TND" },
  { code: "GHS", label: "Cedi Ghanéen",   symbol: "GH₵" },
  { code: "NGN", label: "Naira",          symbol: "₦"   },
  { code: "ZAR", label: "Rand",           symbol: "R"   },
  { code: "AED", label: "Dirham UAE",     symbol: "AED" },
];

/**
 * HELPERS
 */

// Récupérer facilement le symbole pour l'affichage
export const getCurrencySymbol = (code: Currency): string => {
  return CURRENCIES.find(c => c.code === code)?.symbol || code;
};