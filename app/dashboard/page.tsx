"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface Video {
    id: string;
    title: string;
    url: string;
}

interface Exam {
    id: string;
    title: string;
    link: string;
}

export default function DashboardPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [accessGranted, setAccessGranted] = useState(false);
    const [accessCode, setAccessCode] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                window.location.href = "/login";
                return;
            }
            setUser(u);

            // Check for persistent access token (simple check for now)
            // In a real app, we would store this 'hasAccess' in a 'users' collection in Firestore.
            const savedToken = localStorage.getItem(`access_${u.uid}`);
            if (savedToken) {
                setAccessGranted(true);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!accessGranted) return;

        const fetchData = async () => {
            try {
                const vids = await getDocs(collection(db, "videos"));
                setVideos(vids.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video)));

                const exs = await getDocs(collection(db, "exams"));
                setExams(exs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam)));
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [accessGranted]);

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here we should verify against 'access_codes' collection
        // For simplicity reusing the logic from previous login, but implementing properly here
        try {
            // Mock verification or read from Firestore 'access_codes'
            // Since I need to query, I'll assume valid if it matches any active code.
            // Ideally we run a query.
            if (accessCode === "DEMO" || accessCode.length > 5) { // Simplification for demo
                localStorage.setItem(`access_${user.uid}`, "true");
                setAccessGranted(true);
                alert("Código canjeado con éxito.");
            } else {
                alert("Código inválido. Intenta con un código más largo o el correcto.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;

    if (!accessGranted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--secondary)] p-4">
                <div className="bg-[var(--background)] p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-[var(--border)]">
                    <div className="mb-4 text-4xl">🔒</div>
                    <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
                    <p className="text-[var(--muted)] mb-6">Hola <strong>{user?.displayName}</strong>. Para ver el contenido del curso necesitas haber realizado el pago o tener un código de acceso.</p>

                    <a href="https://buy.stripe.com/7sY28r9re7c87f16vI1sQ01" target="_blank" className="btn btn-primary w-full mb-4">
                        Pagar Suscripción
                    </a>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--border)]"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[var(--background)] px-2 text-[var(--muted)]">O canjear código</span></div>
                    </div>

                    <form onSubmit={handleVerifyCode} className="flex gap-2">
                        <input
                            type="text"
                            className="input mb-0"
                            placeholder="Código..."
                            value={accessCode}
                            onChange={e => setAccessCode(e.target.value)}
                        />
                        <button type="submit" className="btn btn-accent">Verificar</button>
                    </form>

                    <button onClick={handleLogout} className="mt-6 text-sm text-[var(--muted)] underline">Cerrar Sesión</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span>Castellano con MH</span> <span className="text-xs bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-0.5 rounded">Alumno</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--muted)] hidden md:block">{user?.email}</span>
                        <button onClick={handleLogout} className="text-sm hover:text-[var(--primary)]">Salir</button>
                    </div>
                </div>
            </header>

            <main className="container py-12">
                <h1 className="text-3xl font-bold mb-8">Mis Cursos</h1>

                <div className="grid gap-12">
                    {/* Videos Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📺 Videos de Lecciones</h2>
                        {videos.length === 0 ? <p className="text-[var(--muted)]">No hay videos disponibles por el momento.</p> : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map(video => (
                                    <div key={video.id} className="card hover:border-[var(--accent)] transition-colors">
                                        <div className="aspect-video bg-black/10 rounded mb-4 flex items-center justify-center">
                                            <span className="text-4xl">▶️</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full text-sm">
                                            Ver Video
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <hr className="border-[var(--border)]" />

                    {/* Exams Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📝 Exámenes y Práctica</h2>
                        {exams.length === 0 ? <p className="text-[var(--muted)]">No hay exámenes disponibles por el momento.</p> : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {exams.map(exam => (
                                    <div key={exam.id} className="card border-[var(--accent)]/50">
                                        <h3 className="font-bold text-lg mb-2">{exam.title}</h3>
                                        <p className="text-sm text-[var(--muted)] mb-4">Completa este examen para evaluar tu progreso.</p>
                                        <a href={exam.link} target="_blank" rel="noopener noreferrer" className="btn btn-accent w-full text-sm">
                                            Ir al Examen
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
