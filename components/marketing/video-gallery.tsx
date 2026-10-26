"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Play, X, Film, Loader2 } from "lucide-react";
import { getVideos, type VideoRecord } from "@/lib/firebase-service";

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoGallery() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<VideoRecord | null>(null);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(videos.map((v) => v.category));
    return Array.from(set);
  }, [videos]);

  const filteredVideos = videos.filter((v) =>
    selectedFilter === "all" ? true : v.category === selectedFilter
  );

  const activeYoutubeId = activeVideo ? extractYoutubeId(activeVideo.videoUrl) : null;

  return (
    <section id="realisations" className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-xs font-bold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5 text-[#C49A45]" />
            Médiathèque & Réalisations Terrain
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B4D3E]">
            L&apos;Agronomie en Action et Résultats Concrets
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Explorez nos vidéos de réalisations, nos visites d&apos;exploitations agricoles et les retours d&apos;expérience d&apos;éleveurs accompagnés par RAWeiD Service.
          </p>

          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedFilter === "all"
                    ? "bg-[#1B4D3E] text-white shadow-md"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                Toutes les capsules
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    selectedFilter === cat
                      ? "bg-[#1B4D3E] text-white shadow-md"
                      : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#1B4D3E] animate-spin" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <p className="text-center text-stone-400 text-sm py-16">
            Aucune vidéo publiée pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div
                  className="relative aspect-video w-full overflow-hidden bg-stone-900 cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  {video.thumbnailUrl && (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <span className="absolute top-3 left-3 bg-[#1B4D3E]/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {video.category}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#C49A45] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#1B4D3E] transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-medium text-stone-700">RAWeiD Service SUARL</span>
                    <button
                      onClick={() => setActiveVideo(video)}
                      className="text-[#1B4D3E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Visionner la vidéo →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-stone-800">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video w-full bg-black">
              {activeYoutubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video src={activeVideo.videoUrl} controls autoPlay className="w-full h-full" />
              )}
            </div>

            <div className="p-6 bg-stone-950 text-white">
              <span className="text-xs uppercase font-bold text-[#C49A45]">
                {activeVideo.category}
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">{activeVideo.title}</h3>
              <p className="text-stone-400 text-sm mt-2">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
