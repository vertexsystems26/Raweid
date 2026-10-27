import {
  ref,
  get,
  push,
  set,
  update,
  remove,
  child,
} from "firebase/database";
import { db } from "@/lib/firebase";

// ============================================================
// Types
// ============================================================

export type ServiceCategory = "Conseil" | "Formation" | "Accompagnement" | "Production";

export type ServiceRecord = {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  imageUrl: string | null;
  iconName: string;
  createdAt: string;
};

export type CourseStatus = "Ouvert" | "Bientôt disponible";

export type CourseRecord = {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  duration: string;
  targetAudience: string;
  imageUrl: string | null;
  price: string;
  status: CourseStatus;
  createdAt: string;
};

export type ProductTargetAnimal = "Bovins" | "Vaches laitières" | "Ovins" | "Caprins";

export type ProductRecord = {
  id: string;
  name: string;
  targetAnimal: ProductTargetAnimal;
  nutritionalInfo: string;
  packaging: string;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
};

export type VideoRecord = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  category: string;
  createdAt: string;
};

export type CandidateStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type CandidateNote = {
  content: string;
  author: string;
  createdAt: string;
};

export type CandidateRecord = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  governorate: string;
  selectedService: "TRAINING" | "AGRI_CONSULTING" | "INVESTOR_SUPPORT" | "FEED_MANUFACTURING";
  courseId: string | null;
  projectDetails: string | null;
  status: CandidateStatus;
  notes: Array<{ id: string } & CandidateNote>;
  createdAt: string;
};

// ============================================================
// Helpers
// ============================================================

function snapshotToArray<T>(snap: Record<string, unknown> | null): (T & { id: string })[] {
  if (!snap) return [];
  return Object.entries(snap).map(([id, value]) => ({
    ...(value as T),
    id,
  }));
}

// Uploads via our server-side /api/upload route (Cloudinary) rather than calling
// Cloudinary's SDK from the browser, since that would require exposing api_secret.
export async function uploadImage(file: File, folder: "services" | "products" | "courses"): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  try {
    const res = await fetch("/api/upload", { method: "POST", body, signal: controller.signal });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Échec du téléversement de l'image.");
    }
    return data.url as string;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Le téléversement a expiré. Vérifiez votre connexion et réessayez.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// /services
// ============================================================

export async function getServices(): Promise<ServiceRecord[]> {
  const snap = await get(ref(db, "services"));
  const list = snapshotToArray<Omit<ServiceRecord, "id">>(snap.val());
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addService(data: Omit<ServiceRecord, "id" | "createdAt">): Promise<string> {
  const newRef = push(ref(db, "services"));
  await set(newRef, { ...data, createdAt: new Date().toISOString() });
  return newRef.key as string;
}

export async function updateService(id: string, data: Partial<Omit<ServiceRecord, "id">>): Promise<void> {
  await update(ref(db, `services/${id}`), data);
}

export async function deleteService(id: string): Promise<void> {
  await remove(ref(db, `services/${id}`));
}

// ============================================================
// /courses (sous-catégories de formations, rattachées à un service)
// ============================================================

export async function getCourses(): Promise<CourseRecord[]> {
  const snap = await get(ref(db, "courses"));
  const list = snapshotToArray<Omit<CourseRecord, "id">>(snap.val());
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCoursesByServiceId(serviceId: string): Promise<CourseRecord[]> {
  const all = await getCourses();
  return all.filter((course) => course.serviceId === serviceId);
}

export async function addCourse(data: Omit<CourseRecord, "id" | "createdAt">): Promise<string> {
  const newRef = push(ref(db, "courses"));
  await set(newRef, { ...data, createdAt: new Date().toISOString() });
  return newRef.key as string;
}

export async function updateCourse(id: string, data: Partial<Omit<CourseRecord, "id">>): Promise<void> {
  await update(ref(db, `courses/${id}`), data);
}

export async function deleteCourse(id: string): Promise<void> {
  await remove(ref(db, `courses/${id}`));
}

// ============================================================
// /products
// ============================================================

export async function getProducts(): Promise<ProductRecord[]> {
  const snap = await get(ref(db, "products"));
  const list = snapshotToArray<Omit<ProductRecord, "id">>(snap.val());
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addProduct(data: Omit<ProductRecord, "id" | "createdAt">): Promise<string> {
  const newRef = push(ref(db, "products"));
  await set(newRef, { ...data, createdAt: new Date().toISOString() });
  return newRef.key as string;
}

export async function updateProduct(id: string, data: Partial<Omit<ProductRecord, "id">>): Promise<void> {
  await update(ref(db, `products/${id}`), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await remove(ref(db, `products/${id}`));
}

// ============================================================
// /videos
// ============================================================

export async function getVideos(): Promise<VideoRecord[]> {
  const snap = await get(ref(db, "videos"));
  const list = snapshotToArray<Omit<VideoRecord, "id">>(snap.val());
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addVideo(data: Omit<VideoRecord, "id" | "createdAt">): Promise<string> {
  const newRef = push(ref(db, "videos"));
  await set(newRef, { ...data, createdAt: new Date().toISOString() });
  return newRef.key as string;
}

export async function updateVideo(id: string, data: Partial<Omit<VideoRecord, "id">>): Promise<void> {
  await update(ref(db, `videos/${id}`), data);
}

export async function deleteVideo(id: string): Promise<void> {
  await remove(ref(db, `videos/${id}`));
}

// ============================================================
// /candidates
// ============================================================

function candidateFromSnapshotValue(id: string, value: any): CandidateRecord {
  const notesObj = value.notes || {};
  return {
    id,
    fullName: value.fullName,
    phone: value.phone,
    email: value.email ?? null,
    governorate: value.governorate,
    selectedService: value.selectedService,
    courseId: value.courseId ?? null,
    projectDetails: value.projectDetails ?? null,
    status: value.status,
    createdAt: value.createdAt,
    notes: Object.entries(notesObj)
      .map(([noteId, note]) => ({ id: noteId, ...(note as CandidateNote) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export async function getCandidates(): Promise<CandidateRecord[]> {
  const snap = await get(ref(db, "candidates"));
  const val = snap.val() as Record<string, any> | null;
  if (!val) return [];
  return Object.entries(val)
    .map(([id, value]) => candidateFromSnapshotValue(id, value))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type NewCandidateInput = {
  fullName: string;
  phone: string;
  email?: string | null;
  governorate: string;
  selectedService: CandidateRecord["selectedService"];
  courseId?: string | null;
  projectDetails?: string | null;
};

// Public submission (no auth required) - used by the front-end registration form.
export async function addCandidate(data: NewCandidateInput): Promise<string> {
  const newRef = push(ref(db, "candidates"));
  await set(newRef, {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    governorate: data.governorate,
    selectedService: data.selectedService,
    courseId: data.courseId || null,
    projectDetails: data.projectDetails || null,
    status: "NEW" as CandidateStatus,
    createdAt: new Date().toISOString(),
  });
  return newRef.key as string;
}

export async function updateCandidateStatus(id: string, status: CandidateStatus): Promise<void> {
  await update(ref(db, `candidates/${id}`), { status });
}

export async function addCandidateNote(
  candidateId: string,
  content: string,
  author: string = "Mme Lamia Ben Ammar"
): Promise<{ id: string } & CandidateNote> {
  const note: CandidateNote = {
    content: content.trim(),
    author,
    createdAt: new Date().toISOString(),
  };
  const newNoteRef = push(child(ref(db, "candidates"), `${candidateId}/notes`));
  await set(newNoteRef, note);
  return { id: newNoteRef.key as string, ...note };
}

export type CreateCandidateAdminInput = NewCandidateInput & {
  status?: CandidateStatus;
  initialNote?: string;
  noteAuthor?: string;
};

// Admin-side creation, mirrors addCandidate but allows an initial status + note.
export async function createCandidateAdmin(data: CreateCandidateAdminInput): Promise<CandidateRecord> {
  const newRef = push(ref(db, "candidates"));
  const createdAt = new Date().toISOString();
  const notes: Record<string, CandidateNote> = {};

  if (data.initialNote?.trim()) {
    const noteRef = push(child(ref(db, "candidates"), `${newRef.key}/notes`));
    notes[noteRef.key as string] = {
      content: data.initialNote.trim(),
      author: data.noteAuthor || "Administration RAWeiD",
      createdAt,
    };
  }

  const record = {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || null,
    governorate: data.governorate,
    selectedService: data.selectedService,
    courseId: data.courseId || null,
    projectDetails: data.projectDetails || null,
    status: data.status || "NEW",
    createdAt,
    notes,
  };

  await set(newRef, record);
  return candidateFromSnapshotValue(newRef.key as string, record);
}
