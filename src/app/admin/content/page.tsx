import { adminDb } from "@/server/firebase/admin";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminContentPage() {
  let contentList: any[] = [];
  
  try {
    const snapshot = await adminDb.collection("content").orderBy("createdAt", "desc").get();
    
    // We fetch episodes concurrently for each content to get the episode count
    const list = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const epsSnap = await doc.ref.collection("episodes").count().get();
      return {
        id: doc.id,
        ...data,
        episodes: { length: epsSnap.data().count }
      };
    }));
    contentList = list;
  } catch (error) {
    console.error("DB error in admin content list", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Content Catalog</h1>
          <p className="text-text-muted mt-1">Manage all movies, series, and anime on the platform.</p>
        </div>
        <Link 
          href="/admin/content/create" 
          className="flex items-center gap-2 bg-crimson hover:bg-crimson-hover text-white px-4 py-2 rounded font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </Link>
      </div>

      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-strong/50">
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Title</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Type</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Episodes</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Visibility</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    No content found. Add your first title to get started.
                  </td>
                </tr>
              ) : (
                contentList.map((content) => (
                  <tr key={content.id} className="hover:bg-surface-strong/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-surface-strong rounded object-cover overflow-hidden">
                          {content.posterUrl ? (
                            <img src={content.posterUrl} alt={content.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white line-clamp-1" title={content.title}>
                            {content.title}
                          </div>
                          {content.alternativeTitles && content.alternativeTitles.length > 0 && (
                            <div className="text-xs text-text-muted line-clamp-1">{content.alternativeTitles.join(", ")}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-platinum capitalize">{content.type?.toLowerCase() || 'TV'}</td>
                    <td className="px-6 py-4 text-sm text-platinum capitalize">{content.status?.toLowerCase() || 'Ongoing'}</td>
                    <td className="px-6 py-4 text-sm text-platinum">{content.episodes?.length || 0}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${content.publishState === 'PUBLISHED' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                        {content.publishState === 'PUBLISHED' ? 'Public' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/content/${content.id}/edit`} className="p-2 text-text-secondary hover:text-white hover:bg-surface-strong rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
