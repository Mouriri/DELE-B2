"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if admin (hardcoded for now, ideally check database)
            if (user.email === "mouriri@gmail.com") { // Replace with actual admin email if known, or let logic handle it
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error(err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Iniciar Sesión</h1>
                <p className={styles.subtitle}>
                    Accede con tu cuenta de Google para continuar.
                </p>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="btn w-full flex items-center justify-center gap-2"
                    style={{ background: 'white', color: '#444', border: '1px solid #ccc' }}
                    disabled={loading}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    {loading ? "Entrando..." : "Entrar con Google"}
                </button>
            </div>
        </div>
    );
}
