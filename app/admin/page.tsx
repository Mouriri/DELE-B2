"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";

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

interface AccessCode {
    id: string;
    code: string;
    email?: string;
    status: 'active' | 'used';
    createdAt?: string;
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"videos" | "exams" | "codes">("videos");

    const [videos, setVideos] = useState<Video[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [codes, setCodes] = useState<AccessCode[]>([]);

    // Form States
    const [videoForm, setVideoForm] = useState({ title: "", url: "" });
    const [examForm, setExamForm] = useState({ title: "", link: "" });
    const [loading, setLoading] = useState(true);

    // Cargar datos en tiempo real
    useEffect(() => {
        const unsubVideos = onSnapshot(collection(db, "videos"), (snapshot) => {
            const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
            setVideos(vids);
        });

        const unsubExams = onSnapshot(collection(db, "exams"), (snapshot) => {
            const exs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
            setExams(exs);
        });

        const unsubCodes = onSnapshot(collection(db, "access_codes"), (snapshot) => {
            const cds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AccessCode));
            setCodes(cds);
            setLoading(false);
        });

        return () => {
            unsubVideos();
            unsubExams();
            unsubCodes();
        };
    }, []);

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoForm.title || !videoForm.url) return;
        try {
            await addDoc(collection(db, "videos"), videoForm);
            setVideoForm({ title: "", url: "" });
            alert("Video añadido correctamente a Firebase");
        } catch (error) {
            console.error("Error añadiendo video: ", error);
            alert("Error al añadir video");
        }
    };

    const handleAddExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!examForm.title || !examForm.link) return;
        try {
            await addDoc(collection(db, "exams"), examForm);
            setExamForm({ title: "", link: "" });
            alert("Examen añadido correctamente a Firebase");
        } catch (error) {
            console.error("Error añadiendo examen: ", error);
            alert("Error al añadir examen");
        }
    };

    const handleGenerateCode = async () => {
        // Generar código aleatorio simple
        const code = Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        try {
            await addDoc(collection(db, "access_codes"), {
                code,
                status: 'active',
                createdAt: new Date().toISOString()
            });
            alert(`Código generado: ${code}`);
        } catch (e) {
            console.error(e);
            alert("Error generando código");
        }
    };

    const handleDeleteCode = async (id: string) => {
        if (confirm('¿Borrar este código?')) {
            await deleteDoc(doc(db, "access_codes", id));
        }
    };

    const handleDeleteVideo = async (id: string) => {
        if (confirm('¿Seguro que quieres borrar este video?')) {
            await deleteDoc(doc(db, "videos", id));
        }
    }

    const handleDeleteExam = async (id: string) => {
        if (confirm('¿Seguro que quieres borrar este examen?')) {
            await deleteDoc(doc(db, "exams", id));
        }
    }

    if (loading) return <div className="p-10">Cargando datos...</div>;

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>Admin Panel</div>
                <nav>
                    <div
                        className={`${styles.navItem} ${activeTab === "videos" ? styles.activeNavItem : ""}`}
                        onClick={() => setActiveTab("videos")}
                    >
                        Videos
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === "exams" ? styles.activeNavItem : ""}`}
                        onClick={() => setActiveTab("exams")}
                    >
                        Exámenes
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === "codes" ? styles.activeNavItem : ""}`}
                        onClick={() => setActiveTab("codes")}
                    >
                        Códigos Acceso
                    </div>
                    <Link href="/" className={styles.navItem} style={{ marginTop: '2rem' }}>
                        ← Volver al Sitio
                    </Link>
                    <Link href="/dashboard" className={styles.navItem}>
                        Ver Dashboard Usuario
                    </Link>
                </nav>
            </aside>

            <main className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        Gestión de {activeTab === "videos" ? "Videos" : activeTab === "exams" ? "Exámenes" : "Códigos"}
                    </h1>
                </header>

                {activeTab === "videos" && (
                    <div>
                        <div className={styles.card}>
                            <h2 className="label" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Añadir Nuevo Video</h2>
                            <form onSubmit={handleAddVideo}>
                                <div className={styles.formGroup}>
                                    <label className="label">Título del Video</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ej. Lección 2: Verbos"
                                        value={videoForm.title}
                                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">URL del Video (YouTube/Vimeo)</label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://..."
                                        value={videoForm.url}
                                        onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Subir Video</button>
                            </form>
                        </div>

                        <div className={styles.list}>
                            <h3 className="label" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Videos en Base de Datos</h3>
                            {videos.length === 0 && <p style={{ color: 'var(--muted)' }}>No hay videos aún.</p>}
                            {videos.map(v => (
                                <div key={v.id} className={styles.listItem}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{v.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{v.url}</div>
                                    </div>
                                    <button onClick={() => handleDeleteVideo(v.id)} className="btn btn-accent" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: 'red', color: 'white' }}>Borrar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "exams" && (
                    <div>
                        <div className={styles.card}>
                            <h2 className="label" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Añadir Nuevo Examen</h2>
                            <form onSubmit={handleAddExam}>
                                <div className={styles.formGroup}>
                                    <label className="label">Título del Examen</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ej. Examen Final A1"
                                        value={examForm.title}
                                        onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">Enlace al Examen</label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://..."
                                        value={examForm.link}
                                        onChange={(e) => setExamForm({ ...examForm, link: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Crear Examen</button>
                            </form>
                        </div>

                        <div className={styles.list}>
                            <h3 className="label" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Exámenes en Base de Datos</h3>
                            {exams.length === 0 && <p style={{ color: 'var(--muted)' }}>No hay exámenes aún.</p>}
                            {exams.map(e => (
                                <div key={e.id} className={styles.listItem}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{e.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{e.link}</div>
                                    </div>
                                    <button onClick={() => handleDeleteExam(e.id)} className="btn btn-accent" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: 'red', color: 'white' }}>Borrar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "codes" && (
                    <div>
                        <div className={styles.card}>
                            <h2 className="label" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Generar Código de Acceso</h2>
                            <p className="text-sm text-[var(--muted)] mb-4">Genera un código para enviar al alumno tras el pago.</p>
                            <button onClick={handleGenerateCode} className="btn btn-accent w-full">Generar Nuevo Código</button>
                        </div>

                        <div className={styles.list}>
                            <h3 className="label" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Códigos Activos</h3>
                            {codes.length === 0 && <p style={{ color: 'var(--muted)' }}>No hay códigos generados.</p>}
                            {codes.map(c => (
                                <div key={c.id} className={styles.listItem}>
                                    <div className="font-mono font-bold text-lg">{c.code}</div>
                                    <div className="flex gap-2 align-center">
                                        <span className={`text-xs px-2 py-1 rounded ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`} style={{ display: 'flex', alignItems: 'center' }}>
                                            {c.status}
                                        </span>
                                        <button onClick={() => handleDeleteCode(c.id)} className="btn bg-red-500 text-white text-xs px-2 py-1">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
