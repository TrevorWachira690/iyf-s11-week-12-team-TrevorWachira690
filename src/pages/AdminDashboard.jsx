// Owned by: Part 3, Person B
// See: docs/part-3-comments-and-likes/
//
// The page where a business account manages their own listings.

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // adjust if the hook name differs
import useFetch from '../hooks/useFetch';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

/*
 * NOTE ON NAMING: the project tree calls this file AdminDashboard.jsx,
 * but per PROJECT_OVERVIEW.md there is no separate "admin" role — the
 * two account types are "business" and "customer". This page is the
 * business owner's dashboard. Confirm with the group leader whether
 * to rename the file/route to something like BusinessDashboard, or
 * keep the existing filename and just treat "admin" as meaning
 * "business" in this project. The code below checks for a `business`
 * role, not an `admin` role — update the check if Part 1 defines
 * roles differently.
 *
 * You also need these two functions added to services/api.js by
 * Person A / yourself, matching whatever export/import endpoints
 * Person A actually builds in usersController.js:
 *
 *   export const exportMyData = async () => {
 *     const res = await api.get('/users/export');
 *     return res.data;
 *   };
 *
 *   export const importMyData = async (file) => {
 *     const formData = new FormData();
 *     formData.append('file', file);
 *     const res = await api.post('/users/import', formData, {
 *       headers: { 'Content-Type': 'multipart/form-data' },
 *     });
 *     return res.data;
 *   };
 *
 * Confirm the exact paths/shape with Person A before wiring this up.
 */
import { exportMyData, importMyData } from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null); // 'success' | 'error' | null
  const [importMessage, setImportMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const {
    data: listings,
    loading: listingsLoading,
    error: listingsError,
  } = useFetch(
    () => fetch(`/api/posts?business=${user?._id}`).then((r) => r.json()),
    [user?._id]
  );

  if (!user) {
    return <p className="p-6 text-sm text-gray-500">Log in to view your dashboard.</p>;
  }

  if (user.role !== 'business') {
    return (
      <p className="p-6 text-sm text-gray-500">
        This dashboard is only available to business accounts.
      </p>
    );
  }

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-data-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err.message || 'Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportStatus('error');
      setImportMessage('Choose a file first.');
      return;
    }
    setImportStatus(null);
    setImportMessage('');
    try {
      await importMyData(importFile);
      setImportStatus('success');
      setImportMessage('Import completed successfully.');
      setImportFile(null);
    } catch (err) {
      setImportStatus('error');
      setImportMessage(err.message || 'Import failed. Please check your file and try again.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Your Dashboard</h1>

      <section className="mt-6">
        <h2 className="text-base font-medium text-gray-900">Your Listings</h2>
        {listingsLoading && <p className="mt-2 text-sm text-gray-500">Loading listings...</p>}
        {listingsError && (
          <p className="mt-2 text-sm text-red-600">Unable to load your listings.</p>
        )}
        {!listingsLoading && !listingsError && (!listings || listings.length === 0) && (
          <p className="mt-2 text-sm text-gray-500">You haven't posted any listings yet.</p>
        )}
        <div className="mt-3 flex flex-col gap-2">
          {listings?.map((listing) => (
            <Card key={listing._id} className="!p-3">
              <p className="text-sm font-medium text-gray-900">{listing.title}</p>
              <p className="text-xs text-gray-500">{listing.status}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-medium text-gray-900">Export Your Data</h2>
        <p className="mt-1 text-sm text-gray-500">
          Download a copy of your listings and account data.
        </p>
        <div className="mt-3">
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
          {exportError && <p className="mt-2 text-xs text-red-600">{exportError}</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-medium text-gray-900">Import Data</h2>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="file"
            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <Button onClick={handleImport} variant="secondary">
            Import
          </Button>
        </div>
        {importStatus === 'success' && (
          <p className="mt-2 text-xs text-green-600">{importMessage}</p>
        )}
        {importStatus === 'error' && (
          <p className="mt-2 text-xs text-red-600">{importMessage}</p>
        )}
      </section>
    </div>
  );
}