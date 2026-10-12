import { adminDb } from "@/server/firebase/admin";
import { Users, Film, PlayCircle, Eye } from "lucide-react";

export default async function AdminDashboard() {
  let userCount = 0;
  let animeCount = 0;
  let episodeCount = 0;
  let viewCount = 0; 

  try {
    const [usersSnap, animeSnap, episodesSnap] = await Promise.all([
      adminDb.collection("users").count().get(),
      adminDb.collection("anime").count().get(),
      adminDb.collectionGroup("episodes").count().get()
    ]);
    
    userCount = usersSnap.data().count;
    animeCount = animeSnap.data().count;
    episodeCount = episodesSnap.data().count;
  } catch (error) {
    console.error("Failed to fetch admin stats", error);
  }

  const metrics = [
    { label: "Total Users", value: userCount.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Anime Catalog", value: animeCount.toString(), icon: Film, color: "text-crimson", bg: "bg-crimson/10" },
    { label: "Total Episodes", value: episodeCount.toString(), icon: PlayCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Platform Views", value: viewCount.toString(), icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-text-muted">Welcome to the HAKIBOX administration panel.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-surface-elevated border border-border rounded-xl p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-white">{metric.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${metric.bg}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity (Placeholder) */}
      <div className="bg-surface-elevated border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        <div className="text-text-muted text-sm py-8 text-center border border-border border-dashed rounded-lg">
          Activity logging will be implemented in a future update.
        </div>
      </div>
    </div>
  );
}
