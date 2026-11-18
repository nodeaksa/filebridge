'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface FileItem {
  name: string;
  id: string | null;
  created_at: string;
  metadata?: {
    size?: number;
  };
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      if (session) fetchFiles();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchFiles();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError('');

    const emailToUse = username.includes('@')
      ? username.trim()
      : `${username.trim()}@bridge.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }
    setLoggingIn(false);
  };

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('loker-file').list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (!error && data) {
      setFiles(data.filter((f) => f.name !== '.emptyFolderPlaceholder'));
    }
  };

  const uploadFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      setStatusMsg('Ukuran file maksimal 50 MB!');
      return;
    }

    setUploading(true);
    setStatusMsg(`Mengunggah ${file.name}...`);

    const cleanName = `${Date.now().toString().slice(-4)}_${file.name.replace(/\s+/g, '_')}`;

    const { error } = await supabase.storage
      .from('loker-file')
      .upload(cleanName, file, { upsert: true });

    if (error) {
      setStatusMsg(`Gagal upload: ${error.message}`);
    } else {
      setStatusMsg('Berhasil diunggah!');
      await fetchFiles();
    }

    setUploading(false);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleDownload = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from('loker-file')
      .createSignedUrl(fileName, 60, { download: true });

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else if (error) {
      alert('Gagal mengunduh: ' + error.message);
    }
  };

  const handleDelete = async (fileName: string) => {
    const { error } = await supabase.storage.from('loker-file').remove([fileName]);
    if (!error) {
      setFiles((prev) => prev.filter((f) => f.name !== fileName));
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loadingSession) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center">
        <p className="text-sm text-zinc-400">Memuat loker...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight">FileBridge.</h1>
            <p className="text-xs text-zinc-400 mt-1">Masuk sekali untuk membuka loker pribadimu.</p>
          </div>

          {authError && (
            <p className="text-xs text-red-400 bg-red-950/50 border border-red-900 p-2.5 rounded-lg">
              {authError}
            </p>
          )}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username atau Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-sm font-medium transition"
          >
            {loggingIn ? 'Memeriksa...' : 'Masuk ke Loker'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h1 className="text-lg font-bold tracking-tight">FileBridge.</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchFiles}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Refresh
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              Keluar
            </button>
          </div>
        </header>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.[0]) uploadFile(e.dataTransfer.files[0]);
          }}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition ${
            dragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
          }`}
        >
          <input
            type="file"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.[0]) uploadFile(e.target.files[0]);
            }}
          />
          <p className="text-sm font-medium text-zinc-200">
            {uploading ? 'Sedang mengunggah...' : 'Klik atau seret file ke sini'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Maksimal 50 MB per file</p>
          {statusMsg && <p className="text-xs text-blue-400 mt-3">{statusMsg}</p>}
        </label>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            File di Loker ({files.length})
          </h2>

          {files.length === 0 ? (
            <div className="text-center py-10 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
              <p className="text-sm text-zinc-500">Loker masih kosong.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id || file.name}
                  className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500">{formatSize(file.metadata?.size)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition"
                    >
                      Unduh
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-red-950 hover:text-red-400 rounded-lg text-xs transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
