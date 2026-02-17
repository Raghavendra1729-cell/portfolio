import { getData } from '@/lib/data';
import { Trophy, TrendingUp, Target } from 'lucide-react';

export const revalidate = 3600;

export default async function CPPage() {
  const profiles = await getData('cpprofile');

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
       <div className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Competitive Programming</h1>
        <p className="text-gray-600">My problem-solving journey across various platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profiles.map((cp: any) => (
          <div key={cp._id} className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col">
            <div className="bg-gray-900 p-6 text-white">
              <h3 className="text-2xl font-bold">{cp.platform}</h3>
              <p className="text-gray-400 text-sm mt-1">@{cp.username}</p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Rating</p>
                  <p className="text-3xl font-bold text-blue-600">{cp.rating}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><Trophy className="w-4 h-4" /> Max Rating</span>
                  <span className="font-medium">{cp.maxRating}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-600"><Target className="w-4 h-4" /> Global Rank</span>
                  <span className="font-medium">{cp.rank}</span>
                </div>
              </div>

              <a 
                href={cp.profileUrl} 
                target="_blank"
                className="mt-auto w-full block text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}