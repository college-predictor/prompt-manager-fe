"use client";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
        await signOut(auth);
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        router.push("/login");
      }
    };
    logout();
  }, [router]);

  return <div>Logging out...</div>;
}
