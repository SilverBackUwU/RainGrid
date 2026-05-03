"use client";

import { useActionState, useEffect, useMemo } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Droplets,
  IndianRupee,
  Loader2,
  MapPin,
  PiggyBank,
  RefreshCw,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import {
  saveRwhCalculation,
  type CalculatorFormState,
} from "@/lib/calculator/actions";
import {
  formatCurrency,
  formatLiters,
  type RainfallCity,
  type RwhCalculationResult,
} from "@/lib/calculator/rwh";

type RwhCalculatorProps = {
  cities: RainfallCity[];
  error?: string | null;
};

const initialState: CalculatorFormState = {
  status: "idle",
  message: "",
  result: null,
};

export function RwhCalculator({ cities, error }: RwhCalculatorProps) {
  const [state, formAction, isPending] = useActionState(
    saveRwhCalculation,
    initialState,
  );
  const selectedCity = useMemo(() => {
    const cityName = state.fields?.city || cities[0]?.city;
    return cities.find((city) => city.city === cityName) ?? cities[0] ?? null;
  }, [cities, state.fields?.city]);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state.message, state.status]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 text-white shadow-xl shadow-zinc-300/40">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Supabase-backed calculator
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Rainwater Harvesting Calculator
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                Model annual capture, tank sizing, installation cost, savings,
                ROI, and environmental impact using live rainfall records.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  Rainfall source
                </span>
                <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-200">
                  Live DB
                </span>
              </div>
              <p className="text-3xl font-semibold">
                {selectedCity
                  ? `${formatLiters(selectedCity.annual_rainfall_mm)} mm`
                  : "--"}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {selectedCity?.city ?? "No city selected"}
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      ((selectedCity?.annual_rainfall_mm ?? 0) / 2600) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Available cities</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {cities.length ? (
              cities.map((city) => (
                <div
                  key={city.city}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
                >
                  <p className="text-sm font-semibold text-zinc-950">
                    {city.city}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatLiters(city.annual_rainfall_mm)} mm/year
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {error ?? "No rainfall cities are available yet."}
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <CalculatorForm
          cities={cities}
          state={state}
          isPending={isPending}
          disabled={Boolean(error) || cities.length === 0}
        />
        <ResultsWorkspace result={state.result} isPending={isPending} />
      </div>
    </div>
  );

  function CalculatorForm({
    cities,
    state,
    isPending,
    disabled,
  }: {
    cities: RainfallCity[];
    state: CalculatorFormState;
    isPending: boolean;
    disabled: boolean;
  }) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Project inputs
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Select rainfall data and household demand.
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
            <Waves className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              City
            </span>
            <select
              name="city"
              required
              disabled={disabled || isPending}
              defaultValue={state.fields?.city ?? cities[0]?.city ?? ""}
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
            >
              {cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Roof area
            </span>
            <div className="flex h-11 items-center rounded-md border border-zinc-300 bg-white px-3 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
              <input
                name="roofArea"
                type="number"
                min="1"
                step="0.1"
                required
                disabled={disabled || isPending}
                defaultValue={state.fields?.roofArea ?? ""}
                placeholder="120"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-zinc-500">m2</span>
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Family size
              </span>
              <input
                name="familySize"
                type="number"
                min="1"
                step="1"
                disabled={disabled || isPending}
                defaultValue={state.fields?.familySize ?? ""}
                placeholder="Optional"
                className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Monthly water usage
              </span>
              <div className="flex h-11 items-center rounded-md border border-zinc-300 bg-white px-3 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                <input
                  name="monthlyWaterUsage"
                  type="number"
                  min="1"
                  step="1"
                  disabled={disabled || isPending}
                  defaultValue={state.fields?.monthlyWaterUsage ?? ""}
                  placeholder="Optional"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-zinc-500">L/mo</span>
              </div>
            </label>
          </div>

          {state.status === "error" && state.message ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={disabled || isPending}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            {isPending ? "Calculating..." : "Calculate and save"}
          </button>
        </form>
      </section>
    );
  }
}

function ResultsWorkspace({
  result,
  isPending,
}: {
  result: RwhCalculationResult | null;
  isPending: boolean;
}) {
  if (isPending) {
    return <LoadingResults />;
  }

  if (!result) {
    return <EmptyResults />;
  }

  const kpis = [
    {
      label: "Harvested water",
      value: `${formatLiters(result.harvestedWaterLiters)} L`,
      note: "Annual roof capture",
      icon: Droplets,
    },
    {
      label: "Tank size",
      value: `${formatLiters(result.tankSizeLiters)} L`,
      note: `${result.tankTier} system`,
      icon: Activity,
    },
    {
      label: "Installation cost",
      value: formatCurrency(result.estimatedCost),
      note: "Smart estimate",
      icon: IndianRupee,
    },
    {
      label: "Water saved",
      value: `${formatLiters(result.waterSavedLiters)} L`,
      note: "Yearly savings potential",
      icon: PiggyBank,
    },
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <kpi.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-zinc-500">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950">
              {kpi.value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{kpi.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Sustainability score
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Coverage, roof capture, and demand fit.
              </p>
            </div>
            <Sprout className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div
              className="grid h-32 w-32 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#10b981 ${result.sustainabilityScore * 3.6}deg, #e4e4e7 0deg)`,
              }}
            >
              <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
                <span className="text-3xl font-semibold text-zinc-950">
                  {result.sustainabilityScore}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <ProgressLine
                label="Demand coverage"
                value={result.coveragePercent}
              />
              <ProgressLine
                label="Storage readiness"
                value={Math.min(
                  100,
                  Math.round((result.tankSizeLiters / 15000) * 100),
                )}
              />
              <ProgressLine
                label="Rainfall utilization"
                value={Math.min(
                  100,
                  Math.round((result.harvestedWaterLiters / 180000) * 100),
                )}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Savings insights
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Yearly operating value from harvested water.
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-sky-600" aria-hidden="true" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Insight label="ROI estimate" value={`${result.roiYears} yrs`} />
            <Insight
              label="Annual offset"
              value={`${formatLiters(result.co2OffsetKg)} kg CO2`}
            />
            <Insight
              label="Demand"
              value={
                result.yearlyDemandLiters
                  ? `${formatLiters(result.yearlyDemandLiters)} L`
                  : "Not provided"
              }
            />
          </div>

          <div className="mt-6 rounded-lg bg-zinc-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <p className="text-sm font-semibold">Eco impact summary</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              A {formatLiters(result.tankSizeLiters)}L system in {result.city}{" "}
              can conserve about {formatLiters(result.waterSavedLiters)}L of
              water per year and reduce municipal water dependency by{" "}
              {result.coveragePercent}% based on the supplied demand profile.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

function ProgressLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-600">{label}</span>
        <span className="text-zinc-500">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-medium uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function EmptyResults() {
  return (
    <section className="grid min-h-[520px] place-items-center rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-sky-50 text-sky-700">
          <Droplets className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold text-zinc-950">
          Run a harvesting model
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Select a city, enter roof area, and optionally add household demand.
          Your result will be saved to Supabase after calculation.
        </p>
      </div>
    </section>
  );
}

function LoadingResults() {
  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-lg border border-zinc-200 bg-white" />
        <div className="h-80 animate-pulse rounded-lg border border-zinc-200 bg-white" />
      </div>
    </section>
  );
}
