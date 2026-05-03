"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BadgeIndianRupee,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Droplets,
  Leaf,
  MapPin,
  Phone,
  Pin,
  Recycle,
  Send,
  Sprout,
  Store,
  TrendingUp,
  UserRound,
  Waves,
} from "lucide-react";
import type {
  DashboardCalculation,
  DashboardData,
  DashboardRequest,
} from "@/lib/dashboard/data";
import { formatCurrency, formatLiters } from "@/lib/calculator/rwh";

type AnalyticsDashboardProps = {
  data: DashboardData;
};

const chartColors = ["#10b981", "#0284c7", "#6366f1", "#f59e0b", "#14b8a6"];

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const displayName =
    data.profile.fullName ?? data.profile.email?.split("@")[0] ?? "RainGrid user";
  const location = [data.profile.city, data.profile.pincode]
    .filter(Boolean)
    .join(" - ");
  const recentCalculations = data.calculations.slice(0, 6);
  const recentRequests = [...data.requestsReceived, ...data.requestsMade]
    .sort((a, b) => dateSortValue(b.createdAt) - dateSortValue(a.createdAt))
    .slice(0, 5);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8">
      <HeroPanel
        displayName={displayName}
        city={data.profile.city}
        totalWaterSaved={data.kpis.totalWaterSaved}
        sustainabilityScore={data.kpis.sustainabilityScore}
        dataErrors={data.dataErrors}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard
          className="xl:col-span-2"
          icon={Droplets}
          label="Total Water Saved"
          value={`${formatLiters(data.kpis.totalWaterSaved)} L`}
          detail="From saved RWH calculations"
        />
        <KpiCard
          icon={ClipboardList}
          label="Calculations Run"
          value={String(data.kpis.totalCalculations)}
          detail="Models stored"
        />
        <KpiCard
          icon={Store}
          label="Active Listings"
          value={String(data.kpis.activeListings)}
          detail="Marketplace supply"
        />
        <KpiCard
          icon={Send}
          label="Requests Received"
          value={String(data.kpis.requestsReceived)}
          detail="Inbound demand"
        />
        <KpiCard
          icon={BadgeIndianRupee}
          label="Money Saved"
          value={formatCurrency(data.kpis.estimatedMoneySaved)}
          detail="Estimated yearly value"
        />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartPanel
          title="Monthly Savings Trend"
          description="Water and estimated rupee savings from stored calculations."
        >
          {hasTrendData(data.monthlySavingsTrend) ? (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.monthlySavingsTrend}>
                <defs>
                  <linearGradient id="waterSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<PremiumTooltip />} />
                <Area
                  type="monotone"
                  dataKey="waterSaved"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#waterSaved)"
                  name="Water saved"
                />
                <Line
                  type="monotone"
                  dataKey="moneySaved"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                  name="Money saved"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="Run calculations to unlock monthly trend analytics." />
          )}
        </ChartPanel>

        <section className="rounded-lg border border-zinc-200 bg-zinc-950 p-5 text-white shadow-xl shadow-zinc-300/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Sustainability Score</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Conservation, marketplace activity, and request outcomes.
              </p>
            </div>
            <Leaf className="h-5 w-5 text-emerald-300" aria-hidden="true" />
          </div>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="95%"
                data={[{ name: "Score", value: data.kpis.sustainabilityScore }]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "#27272a" }}
                  dataKey="value"
                  cornerRadius={14}
                  fill="#34d399"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-36 flex h-36 items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-semibold">
                {data.kpis.sustainabilityScore}
              </p>
              <p className="mt-1 text-sm text-zinc-400">Green score</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <DarkMetric
              label="CO2 reduction"
              value={`${formatLiters(data.kpis.co2ReductionKg)} kg`}
            />
            <DarkMetric
              label="Groundwater preserved"
              value={`${formatLiters(data.kpis.groundwaterPreservedLiters)} L`}
            />
          </div>
        </section>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <ChartPanel
          title="Water Conservation Progress"
          description="Top city contribution from saved calculations."
        >
          {data.cityConservation.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.cityConservation} layout="vertical">
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 6" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="city"
                  axisLine={false}
                  tickLine={false}
                  width={92}
                />
                <Tooltip content={<PremiumTooltip />} />
                <Bar dataKey="waterSaved" radius={[0, 8, 8, 0]} name="Water saved">
                  {data.cityConservation.map((entry, index) => (
                    <Cell
                      key={entry.city}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="City conservation appears after your first saved calculation." />
          )}
        </ChartPanel>

        <ChartPanel
          title="Usage Insights"
          description="Calculation volume and savings value over the last six months."
        >
          {hasTrendData(data.monthlySavingsTrend) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlySavingsTrend}>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<PremiumTooltip />} />
                <Line
                  type="monotone"
                  dataKey="calculations"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                  name="Calculations"
                />
                <Line
                  type="monotone"
                  dataKey="moneySaved"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                  name="Money saved"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState label="Usage insights need saved calculation history." />
          )}
        </ChartPanel>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SavedCalculations calculations={recentCalculations} />
        <div className="space-y-5">
          <ListingsSummary data={data} />
          <RequestActivity
            requests={recentRequests}
            pending={data.kpis.pendingRequests}
            accepted={data.kpis.acceptedRequests}
            made={data.requestsMade.length}
          />
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <SustainabilityImpact data={data} />
        <ProfileSnapshot profile={data.profile} location={location} />
      </section>
    </main>
  );
}

function HeroPanel({
  displayName,
  city,
  totalWaterSaved,
  sustainabilityScore,
  dataErrors,
}: {
  displayName: string;
  city: string | null;
  totalWaterSaved: number;
  sustainabilityScore: number;
  dataErrors: string[];
}) {
  const summary =
    totalWaterSaved > 0
      ? `Your saved models have conserved ${formatLiters(totalWaterSaved)}L so far. Keep compounding the impact with listings and fulfilled requests.`
      : "Start with one calculator run to turn your RainGrid workspace into a measurable conservation profile.";

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1fr_360px]">
        <div className="p-6 sm:p-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <Sprout className="h-4 w-4" aria-hidden="true" />
            {city ? `${city} sustainability workspace` : "Sustainability workspace"}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
            {summary}
          </p>
          {dataErrors.length ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Some optional dashboard sections could not find matching owner
              columns. Visible metrics only use rows scoped to your account.
            </p>
          ) : null}
        </div>
        <div className="bg-zinc-950 p-6 text-white sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Mission summary</p>
            <TrendingUp className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-8 text-5xl font-semibold">{sustainabilityScore}</p>
          <p className="mt-2 text-sm text-zinc-400">Sustainability score</p>
          <div className="mt-7 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-300 transition-all duration-700"
              style={{ width: `${sustainabilityScore}%` }}
            />
          </div>
          <p className="mt-6 text-sm leading-6 text-zinc-300">
            Score improves with saved water, active listings, and accepted
            marketplace requests.
          </p>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  detail,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  detail: string;
  className?: string;
}) {
  return (
    <article
      className={`group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-200/70 ${className}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700 transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
          <Icon className="h-5 w-5" aria-hidden={true} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </article>
  );
}

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
        <Waves className="h-5 w-5 text-sky-600" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function SavedCalculations({
  calculations,
}: {
  calculations: DashboardCalculation[];
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-5">
        <h2 className="text-lg font-semibold text-zinc-950">
          Recent Calculations
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Latest saved RWH models from Supabase.
        </p>
      </div>
      {calculations.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Roof area</th>
                <th className="px-5 py-3 font-medium">Tank</th>
                <th className="px-5 py-3 font-medium">Cost</th>
                <th className="px-5 py-3 font-medium">Water saved</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {calculations.map((calculation) => (
                <tr key={calculation.id} className="hover:bg-zinc-50/80">
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {calculation.city}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatLiters(calculation.roofArea)} m2
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatLiters(calculation.tankSizeLiters)} L
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatCurrency(calculation.estimatedCost)}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatLiters(calculation.waterSavedLiters)} L
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    {formatDate(calculation.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyBlock
          icon={ClipboardList}
          title="No saved calculations yet"
          text="Run the calculator to create dashboard history."
        />
      )}
    </section>
  );
}

function ListingsSummary({ data }: { data: DashboardData }) {
  const activeShare =
    data.listings.length > 0
      ? Math.round((data.kpis.activeListings / data.listings.length) * 100)
      : 0;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Listings Management
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Supply and marketplace performance.
          </p>
        </div>
        <Store className="h-5 w-5 text-sky-600" aria-hidden="true" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniMetric label="Active" value={String(data.kpis.activeListings)} />
        <MiniMetric
          label="Liters"
          value={formatLiters(data.kpis.litersAvailable)}
        />
        <MiniMetric label="Performance" value={`${activeShare}%`} />
      </div>
      <ProgressBar value={activeShare} label="Active listing ratio" />
    </section>
  );
}

function RequestActivity({
  requests,
  pending,
  accepted,
  made,
}: {
  requests: DashboardRequest[];
  pending: number;
  accepted: number;
  made: number;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Request Activity
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Made, pending, accepted, and recent history.
          </p>
        </div>
        <Send className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniMetric label="Made" value={String(made)} />
        <MiniMetric label="Pending" value={String(pending)} />
        <MiniMetric label="Accepted" value={String(accepted)} />
      </div>
      <div className="mt-5 space-y-3">
        {requests.length ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-950">
                  {request.city ?? "Water request"}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatLiters(request.litersRequested)} L ·{" "}
                  {formatDate(request.createdAt)}
                </p>
              </div>
              <StatusPill status={request.status} />
            </div>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-zinc-300 px-3 py-4 text-center text-sm text-zinc-500">
            No request history yet.
          </p>
        )}
      </div>
    </section>
  );
}

function SustainabilityImpact({ data }: { data: DashboardData }) {
  const impacts = [
    {
      label: "Environmental impact",
      value: `${formatLiters(data.kpis.totalWaterSaved)} L`,
      detail: "Total water conserved",
      icon: Recycle,
    },
    {
      label: "CO2 reduction estimate",
      value: `${formatLiters(data.kpis.co2ReductionKg)} kg`,
      detail: "From reduced water movement and treatment load",
      icon: Leaf,
    },
    {
      label: "Groundwater preservation",
      value: `${formatLiters(data.kpis.groundwaterPreservedLiters)} L`,
      detail: "Estimated aquifer pressure avoided",
      icon: Droplets,
    },
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Sustainability Performance
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Environmental outcomes calculated from your saved records.
          </p>
        </div>
        <Sprout className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {impacts.map((impact) => (
          <div
            key={impact.label}
            className="rounded-md border border-zinc-200 bg-zinc-50 p-4"
          >
            <impact.icon className="h-5 w-5 text-emerald-600" />
            <p className="mt-4 text-sm font-medium text-zinc-500">
              {impact.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950">
              {impact.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {impact.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileSnapshot({
  profile,
  location,
}: {
  profile: DashboardData["profile"];
  location: string;
}) {
  const rows = [
    { icon: UserRound, label: "Full name", value: profile.fullName },
    { icon: MapPin, label: "City", value: profile.city },
    { icon: Pin, label: "Pincode", value: profile.pincode },
    { icon: Phone, label: "Phone", value: profile.phone },
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Profile Snapshot</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Connected to your Supabase profile row.
      </p>
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <row.icon className="h-4 w-4" aria-hidden={true} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">
                {row.label}
              </p>
              <p className="text-sm font-semibold text-zinc-950">
                {row.value ?? "Not set"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md bg-zinc-950 p-4 text-white">
        <p className="text-sm font-medium">Operating region</p>
        <p className="mt-2 text-2xl font-semibold">
          {location || "Not configured"}
        </p>
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-medium uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.06] p-3">
      <p className="text-xs font-medium uppercase text-zinc-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="mt-5">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-zinc-600">{label}</span>
        <span className="text-zinc-500">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string | null }) {
  const value = status ?? "unknown";
  const accepted = ["accepted", "approved", "fulfilled"].includes(
    value.toLowerCase(),
  );
  const pending = ["pending", "open", "requested"].includes(value.toLowerCase());

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        accepted
          ? "bg-emerald-50 text-emerald-700"
          : pending
            ? "bg-amber-50 text-amber-700"
            : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {accepted ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <CircleDashed className="h-3 w-3" />
      )}
      {value}
    </span>
  );
}

function EmptyBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  text: string;
}) {
  return (
    <div className="grid min-h-64 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-sky-50 text-sky-700">
          <Icon className="h-6 w-6" aria-hidden={true} />
        </span>
        <p className="mt-4 font-semibold text-zinc-950">{title}</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">{text}</p>
      </div>
    </div>
  );
}

function ChartEmptyState({ label }: { label: string }) {
  return (
    <div className="grid h-[300px] place-items-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-center">
      <div>
        <CalendarClock className="mx-auto h-8 w-8 text-zinc-400" />
        <p className="mt-3 max-w-xs text-sm text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

function PremiumTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-zinc-950">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <p key={item.name} className="flex items-center gap-2 text-zinc-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: {formatTooltipValue(item.value)}
          </p>
        ))}
      </div>
    </div>
  );
}

function hasTrendData(points: DashboardData["monthlySavingsTrend"]) {
  return points.some(
    (point) =>
      point.waterSaved > 0 || point.moneySaved > 0 || point.calculations > 0,
  );
}

function formatTooltipValue(value: number | string | undefined) {
  if (typeof value === "number") {
    return formatLiters(value);
  }

  return value ?? "-";
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function dateSortValue(value: string | null) {
  return value ? new Date(value).getTime() : 0;
}
