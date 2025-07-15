import { useEffect, useState } from "react";
import { fetchUser } from "@/lib/supabase/fetch-auth";
import { User } from "@supabase/supabase-js";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await fetchUser();
      if (error) {
        console.error("Error fetching user:", error);
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  return { user, loading };
};

export default useUser;
