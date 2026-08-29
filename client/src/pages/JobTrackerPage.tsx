// src/pages/JobTrackerPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete } from '@/api/client';
import { PlusCircle, Trash2 } from 'lucide-react';

interface IJobApplication {
  _id: string;
  company: string;
  position: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Accepted';
  location?: string;
  salary?: string;
  notes?: string;
  appliedDate?: string;
  nextStepDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const JobTrackerPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ['jobApplications'],
    queryFn: () => apiGet<IJobApplication[]>('/job-tracker/applications'),
  });

  const createMutation = useMutation({
    mutationFn: (newApp: Omit<IJobApplication, '_id' | 'createdAt' | 'updatedAt'>) =>
      apiPost<IJobApplication>('/job-tracker/applications', newApp),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobApplications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete<{ success: true }>(`/job-tracker/applications/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobApplications'] }),
  });

  // Simple inline form state for creating a new application
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', position: '', status: 'Applied' as const });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      ...form,
    } as any);
    setForm({ company: '', position: '', status: 'Applied' });
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-ink">Job Application Tracker</h1>

      {/* New Application Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-sm transition-all"
      >
        <PlusCircle className="h-4 w-4" />
        {showForm ? 'Cancel' : 'Add New Application'}
      </button>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 rounded-2xl border border-line bg-surface p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="rounded-xl border border-line bg-canvas px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              required
              placeholder="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="rounded-xl border border-line bg-canvas px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="mt-2">
            <label className="mr-2 text-sm font-medium text-muted">Status:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              className="rounded-xl border border-line bg-canvas px-2 py-1 text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
              <option>Accepted</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'Create Application'}
          </button>
        </form>
      )}

      {/* Applications List */}
      {isLoading ? (
        <div className="text-muted">Loading applications…</div>
      ) : isError ? (
        <div className="text-red-600">Failed to load applications.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {applications?.length === 0 && (
            <div className="text-muted">No job applications yet. Add one using the button above.</div>
          )}
          {applications?.map((app) => (
            <div
              key={app._id}
              className="glass-card flex items-center justify-between rounded-2xl border border-line bg-surface p-4 shadow-sm hover:shadow-md hover:border-brand/30 hover:scale-[1.01] transition-all"
            >
              <div className="space-y-1">
                <div className="text-lg font-semibold text-ink">
                  {app.position} @ {app.company}
                </div>
                <div className="text-sm text-muted">
                  Status: {app.status}
                </div>
                {app.appliedDate && (
                  <div className="text-xs text-muted">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteMutation.mutateAsync(app._id)}
                disabled={deleteMutation.isPending}
                className="p-2 text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper for PATCH (update) – not used now but exported for future extensions
export const apiPatch = async <T,>(path: string, data?: unknown): Promise<T> => {
  const options: RequestInit = { method: 'PATCH' };
  if (data !== undefined) {
    (options as any).body = JSON.stringify(data);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await import('@/api/client')).apiPatch<T>(path, data as any);
};
