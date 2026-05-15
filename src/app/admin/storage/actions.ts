"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-utils";

export interface BucketStats {
  id: string;
  name: string;
  created_at: string;
  public: boolean;
  fileCount: number;
  totalSize: number;
  files: StorageFile[];
}

export interface StorageFile {
  name: string;
  id: string | null;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
    cacheControl: string;
  } | null;
}

export interface StorageReport {
  buckets: BucketStats[];
  breakdown: {
    images: { count: number; size: number };
    documents: { count: number; size: number };
    others: { count: number; size: number };
  };
  database: {
    totalSize: string;
    tables: Array<{ name: string; size: string; rows: number; sizeBytes: number }>;
  };
}

export async function getStorageBuckets(): Promise<{ data: StorageReport | null; error: string | null }> {
  try {
    await requireAdmin();
    const supabase = await createAdminClient();

    // 1. Fetch Buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) return { data: null, error: bucketError.message };

    // 2. Fetch Database Usage via SQL RPC or Direct Query
    // Kita gunakan rpc jika tersedia, atau query langsung jika role mengizinkan.
    // Karena kita pakai createAdminClient (Service Role), kita bisa query tabel statistik.
    const { data: dbStats, error: dbError } = await supabase.rpc('get_database_size_stats');
    
    // Fallback jika RPC belum ada: gunakan query manual atau nilai default
    let dbReport = { 
      totalSize: "0 MB", 
      tables: [] as Array<{ name: string; size: string; rows: number; sizeBytes: number }> 
    };

    if (!dbError && dbStats) {
      dbReport = dbStats;
    } else {
      // Jika RPC belum dibuat, kita akan buatkan lewat SQL nanti.
      // Untuk sementara kita biarkan kosong atau coba query manual sederhana.
      const { data: tablesData } = await supabase.from('news').select('id', { count: 'exact', head: true });
      dbReport.tables.push({ name: 'news', size: 'Estimating...', rows: tablesData?.length || 0, sizeBytes: 0 });
    }

    const bucketStats: BucketStats[] = [];
    const breakdown = {
      images: { count: 0, size: 0 },
      documents: { count: 0, size: 0 },
      others: { count: 0, size: 0 }
    };

    for (const bucket of buckets) {
      const { data: rootFiles, error: rootError } = await supabase.storage.from(bucket.name).list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" }
      });

      if (rootError) continue;

      let allFiles: StorageFile[] = [];
      const filesAtRoot = rootFiles.filter(f => f.metadata !== null && f.name !== ".emptyFolderPlaceholder") as StorageFile[];
      const foldersAtRoot = rootFiles.filter(f => f.metadata === null && f.name !== ".emptyFolderPlaceholder");
      allFiles = [...filesAtRoot];

      for (const folder of foldersAtRoot) {
        const { data: subFiles, error: subError } = await supabase.storage.from(bucket.name).list(folder.name, { limit: 100 });
        if (!subError && subFiles) {
          allFiles = [...allFiles, ...(subFiles.filter(f => f.metadata !== null) as StorageFile[])];
        }
      }

      let bCount = 0;
      let bSize = 0;
      allFiles.forEach(file => {
        const size = file.metadata?.size || 0;
        const mime = file.metadata?.mimetype || "";
        bCount++; bSize += size;
        if (mime.startsWith("image/")) { breakdown.images.count++; breakdown.images.size += size; }
        else if (mime.includes("pdf") || mime.includes("word") || mime.includes("text") || mime.includes("zip")) { breakdown.documents.count++; breakdown.documents.size += size; }
        else { breakdown.others.count++; breakdown.others.size += size; }
      });

      allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      bucketStats.push({ id: bucket.id, name: bucket.name, created_at: bucket.created_at, public: bucket.public, fileCount: bCount, totalSize: bSize, files: allFiles.slice(0, 5) });
    }

    return { data: { buckets: bucketStats, breakdown, database: dbReport }, error: null };
  } catch (error: any) {
    console.error("Storage fetching error:", error);
    return { data: null, error: error.message || "Failed to fetch storage data" };
  }
}
