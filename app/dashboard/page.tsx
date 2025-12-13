"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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

    useEffect(() => {
        const token = localStorage.getItem("student_access_token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchData = async () => {
            try {
                const vids = await getDocs(collection(db, "videos"));
                setVideos(vids.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video)));

                const exs = await getDocs(collection(db, "exams"));
                setExams(exs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam)));
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span>Castellano con MH</span> <span className="text-xs bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-0.5 rounded">Alumno</span>
                    </div>
                    <nav className="flex gap-4 text-sm">
                        <Link href="/" className="hover:text-[var(--primary)]">Salir</Link>
                    </nav>
                </div>
            </header>

            <main className="container py-12">
                <h1 className="text-3xl font-bold mb-8">Mis Cursos</h1>

                {loading ? <p>Cargando contenido...</p> : (
                    <div className="grid gap-12">
                        {/* Videos Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📺 Videos de Lecciones</h2>
                            {videos.length === 0 ? <p className="text-[var(--muted)]">No hay videos disponibles por el momento.</p> : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {videos.map(video => (
                                        <div key={video.id} className="card hover:border-[var(--accent)] transition-colors">
                                            <div className="aspect-video bg-black/10 rounded mb-4 flex items-center justify-center">
                                                {/* Placeholder for video thumbnail since we only have URL */}
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
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📝 Exámenes y Prácica</h2>
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
                )}
            </main>
        </div>
    );
}
