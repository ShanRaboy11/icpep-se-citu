"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/create/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import RequireRole from "@/app/components/require-role";
import { Sparkles, Check, ShieldAlert, Wrench } from "lucide-react";
import siteService from "@/app/services/site";
import { LoadingIndicator } from "@/app/components/loading";

function MaintenancePageInner() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await siteService.getSettings();
        setMaintenanceMode(settings.maintenanceMode);
        setMessage(settings.maintenanceMessage);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await siteService.updateSettings({
        maintenanceMode,
        maintenanceMessage: message,
      });
      setMaintenanceMode(updated.maintenanceMode);
      setMessage(updated.maintenanceMessage);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      {saving && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <LoadingIndicator />
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                Saving Settings
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 bg-[#f8f9fc] rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            <div className="mb-10 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Maintenance Mode
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Suspend the site for everyone except admins — useful while
                you're making changes you don't want the public to see
                mid-way through.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                <div className="bg-white rounded-4xl border border-gray-200 transition-all duration-300 shadow-lg p-6 sm:p-10 hover:shadow-primary1/40 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400 text-sm font-raleway">
                      Applies sitewide, instantly
                    </p>
                    <div className="hidden sm:flex items-center gap-1.5 bg-primary1/8 rounded-full px-4 py-2">
                      <Sparkles size={12} className="text-primary1" />
                      <span className="text-xs font-bold text-primary1 font-rubik uppercase tracking-wider">
                        Settings
                      </span>
                    </div>
                  </div>

                  {loading ? (
                    <div className="py-16">
                      <LoadingIndicator label="Loading settings..." />
                    </div>
                  ) : (
                    <>
                      {maintenanceMode && (
                        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <ShieldAlert
                            size={18}
                            className="mt-0.5 shrink-0 text-amber-600"
                          />
                          <p className="font-raleway text-sm text-amber-800">
                            Maintenance mode is currently{" "}
                            <strong>on</strong>. Everyone except admins is
                            seeing the maintenance screen instead of the
                            site, and their app requests are being turned
                            away.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2 mb-8">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Site Status
                        </label>
                        <button
                          type="button"
                          onClick={() => setMaintenanceMode((v) => !v)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <span
                            className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300 ${
                              maintenanceMode ? "bg-amber-500" : "bg-primary1"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                maintenanceMode ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </span>
                          <span className="font-rubik text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            {maintenanceMode ? (
                              <>
                                <Wrench size={14} className="text-amber-600" />
                                Under maintenance
                              </>
                            ) : (
                              "Live — site is running as normal"
                            )}
                          </span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Message shown to visitors
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          placeholder="We're making some improvements. Please check back soon."
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-raleway text-sm text-gray-700 focus:border-primary1 focus:outline-none focus:ring-2 focus:ring-primary1/20"
                        />
                      </div>

                      <div className="mt-8 flex items-center justify-end gap-4">
                        {saved && (
                          <p className="text-green-600 text-xs font-bold font-raleway flex items-center gap-1.5">
                            <Check size={14} /> Saved
                          </p>
                        )}
                        <Button
                          variant="hero"
                          onClick={handleSave}
                          disabled={saving}
                          className="px-5 py-2 sm:px-8 sm:py-3"
                        >
                          Save Settings
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <RequireRole roles={["admin"]} redirectTo="/create">
      <MaintenancePageInner />
    </RequireRole>
  );
}
