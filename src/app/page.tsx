import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingSlider from "@/components/auth/OnboardingSlider";

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Connecté → dashboard directement
  if (user) {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();
  const hasSeenOnboarding = cookieStore.get("kera_onboarding_seen");

  // A déjà vu l'onboarding → login
  if (hasSeenOnboarding) {
    redirect("/login");
  }

  // Première visite → onboarding
  return <OnboardingSlider />;
}
/* ```

---

### Résumé du flux complet
```
/ → connecté ?
    ✅ oui  → /dashboard
    ❌ non  → onboarding vu ?
              ✅ oui → /login
              ❌ non → OnboardingSlider

/dashboard (ou /historique etc.) → connecté ?
    ❌ non → /login

/login → connecté ?
    ✅ oui → /dashboard */