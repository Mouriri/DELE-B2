"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"admin" | "student">("student");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Admin Form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Student Form
    const [accessCode, setAccessCode] = useState("");

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: any) {
            console.error(err);
            setError("Credenciales incorrectas o error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleStudentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Buscar el código en la colección 'access_codes'
            const q = query(collection(db, "access_codes"), where("code", "==", accessCode.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Código válido
                // Guardamos una "sesión" simple en localStorage
                localStorage.setItem("student_access_token", accessCode);
                router.push("/dashboard");
            } else {
                setError("Código de acceso inválido.");
            }
        } catch (err) {
            console.error(err);
            setError("Error verificando el código.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.tabs}>
                    <div
                        className={`${styles.tab} ${activeTab === "student" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("student")}
                    >
                        Soy Alumno
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === "admin" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("admin")}
                    >
                        Administrador
                    </div>
                </div>

                <h1 className={styles.title}>Bienvenido</h1>
                <p className={styles.subtitle}>
                    {activeTab === "student" ? "Introduce tu código de acceso para entrar." : "Panel de gestión solo para administradores."}
                </p>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                        {error}
                    </div>
                )}

                {activeTab === "student" ? (
                    <form onSubmit={handleStudentLogin}>
                        <div className="mb-4">
                            <label className="label">Código de Acceso</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ej. ABC-123-XYZ"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? "Verificando..." : "Entrar al Curso"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAdminLogin}>
                        <div className="mb-4">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="admin@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="label">Contraseña</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? "Entrando..." : "Iniciar Sesión"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
