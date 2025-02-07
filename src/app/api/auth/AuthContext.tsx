import { createContext, useContext, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth"; // Import Session type

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (session) {
      const sessionTyped = session as Session & { accessToken: string }; // ✅ Explicitly type session
      if (sessionTyped.accessToken) {
        queryClient.invalidateQueries({ queryKey: ["pricingPackages"] }); // ✅ Correctly invalidate query
      }
    }
  }, [session, queryClient]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!session, login: () => signIn("keycloak"), logout: () => signOut() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
