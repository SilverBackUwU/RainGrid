import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  Droplets,
  Gauge,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Smart Rainwater Calculator",
    text: "Estimate rooftop yield, tank sizing, installation cost, and annual savings from city rainfall data.",
  },
  {
    icon: Store,
    title: "Community Marketplace",
    text: "List surplus harvested water and discover available supply from nearby RainGrid users.",
  },
  {
    icon: BarChart3,
    title: "Sustainability Dashboard",
    text: "Track conservation, CO2 reduction, groundwater impact, and request activity in one premium workspace.",
  },
  {
    icon: TrendingUp,
    title: "ROI & Savings Analytics",
    text: "Turn conservation decisions into financial insight with installation estimates and savings trends.",
  },
  {
    icon: Users,
    title: "Local Water Sharing Network",
    text: "Connect homeowners, schools, apartments, and communities through verified local water requests.",
  },
];

const process = [
  "Enter rooftop area and city",
  "Calculate rainwater potential",
  "Share surplus water locally",
  "Track community impact",
];

const stats = [
  { label: "Liters saved potential", value: "120K+", note: "per 100 m2 roof" },
  { label: "CO2 reduced", value: "35 kg", note: "estimated annually" },
  { label: "Groundwater preserved", value: "74K L", note: "per model cycle" },
  { label: "Cost savings", value: "₹2.1K+", note: "annual estimate" },
];

const testimonials = [
  {
    quote:
      "RainGrid made rooftop harvesting feel measurable. Our apartment committee finally had numbers, tank sizing, and a way to share excess supply.",
    name: "Aparna Rao",
    role: "Apartment society treasurer",
  },
  {
    quote:
      "The marketplace flow is what clicked for us. Schools with stored rainwater can coordinate with nearby community needs without messy spreadsheets.",
    name: "Daniel Mathew",
    role: "School operations lead",
  },
  {
    quote:
      "It turns sustainability into an operating dashboard. Water saved, requests, listings, and ROI are visible enough for real decisions.",
    name: "Meera Iyer",
    role: "Homeowner, Bengaluru",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-zinc-950">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=2200&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.96)_0%,rgba(9,9,11,0.78)_44%,rgba(9,9,11,0.18)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,#f7f8f6_0%,rgba(247,248,246,0)_100%)]" />
      <div className="absolute right-8 top-28 hidden h-[520px] w-[520px] rounded-full border border-white/10 lg:block" />
      <div className="absolute right-28 top-48 hidden h-[340px] w-[340px] rounded-full border border-emerald-300/20 lg:block" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-950/30">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-wide">RainGrid</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-zinc-300 md:flex">
            <a href="#problem" className="transition hover:text-white">
              Problem
            </a>
            <a href="#solution" className="transition hover:text-white">
              Solution
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#impact" className="transition hover:text-white">
              Impact
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-md px-3 text-sm font-medium text-zinc-300 transition hover:text-white sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-100"
            >
              Get started
            </Link>
          </div>
        </nav>

        <div className="flex flex-1 items-center py-16">
          <div className="max-w-4xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-emerald-100 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Climate-tech infrastructure for local water resilience
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-7xl">
              Turn every rooftop into a connected water network.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              RainGrid helps homes and communities calculate rainwater
              potential, size systems, track sustainability, and share surplus
              water through a local marketplace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculator"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-semibold text-zinc-950 shadow-xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                Calculate Water Savings
                <Calculator className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Explore Water Marketplace
                <Store className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["RWH planning", "Calculator + tank sizing"],
                ["Water exchange", "Listings + requests"],
                ["Impact OS", "Dashboard + sustainability"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.12]"
                >
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase text-emerald-700">
            The problem
          </p>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            Cities lose rainwater while neighborhoods run short.
          </h2>
        </div>
        <p className="text-lg leading-8 text-zinc-600">
          Water scarcity is not only a supply issue. Rainfall is wasted,
          rooftop systems are hard to plan, and communities lack a trusted way
          to share surplus harvested water when nearby demand appears.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Waves,
            title: "Rainfall slips away",
            text: "Urban runoff turns valuable rain into drainage load instead of stored household resilience.",
          },
          {
            icon: Gauge,
            title: "Planning is fragmented",
            text: "People need rainfall data, roof math, tank sizing, and cost estimates before they can act.",
          },
          {
            icon: Users,
            title: "Sharing is inefficient",
            text: "Surplus water has no simple local exchange layer for requests, listings, and follow-through.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/70"
          >
            <item.icon className="h-6 w-6 text-sky-700" aria-hidden="true" />
            <h3 className="mt-6 text-xl font-semibold text-zinc-950">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solution" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase text-sky-700">
            The solution
          </p>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            One platform for planning, saving, sharing, and proving impact.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            RainGrid brings RWH planning, smart tank recommendations,
            installation estimates, community water exchange, and
            sustainability tracking into a single SaaS workflow.
          </p>
        </div>
        <div className="rounded-lg bg-zinc-950 p-5 text-white shadow-2xl shadow-zinc-300">
          <div className="grid gap-3">
            {[
              ["Calculator", "Roof area + rainfall -> harvest potential"],
              ["Tank sizing", "Smart 5,000L / 10,000L / 15,000L+ guidance"],
              ["Marketplace", "Available liters, pincode search, requests"],
              ["Dashboard", "Savings, CO2, groundwater, ROI, activity"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-md border border-white/10 bg-white/[0.06] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{text}</p>
                  </div>
                  <CheckCircle2
                    className="h-5 w-5 text-emerald-300"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase text-emerald-700">
          How it works
        </p>
        <h2 className="text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
          From rainfall data to community resilience in four steps.
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {process.map((step, index) => (
          <article
            key={step}
            className="relative rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-sm font-semibold text-emerald-300">
              {index + 1}
            </span>
            <h3 className="mt-8 text-lg font-semibold text-zinc-950">{step}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {index === 0
                ? "Choose your city and rooftop area."
                : index === 1
                  ? "See yield, tank size, cost, ROI, and savings."
                  : index === 2
                    ? "Publish available liters for nearby users."
                    : "Measure saved water and local impact."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-emerald-300">
              Key features
            </p>
            <h2 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              The MVP already behaves like a real water-tech product.
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-300">
            RainGrid connects the complete business loop: calculate potential,
            save results, manage listings, request water, and track impact.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09]"
            >
              <feature.icon
                className="h-6 w-6 text-emerald-300"
                aria-hidden="true"
              />
              <h3 className="mt-6 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="impact" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase text-sky-700">
            Sustainability stats
          </p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            Make conservation measurable enough to scale.
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-zinc-600">
          The platform frames every rooftop model as water saved, money saved,
          carbon reduced, and groundwater pressure avoided.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/70"
          >
            <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-zinc-500">{stat.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase text-emerald-700">
            Community proof
          </p>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            Built for the people who actually manage local water.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-lg border border-zinc-200 bg-[#f7f8f6] p-6 shadow-sm"
            >
              <p className="text-base leading-7 text-zinc-700">“{item.quote}”</p>
              <div className="mt-6 border-t border-zinc-200 pt-5">
                <p className="font-semibold text-zinc-950">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="overflow-hidden rounded-lg bg-zinc-950 p-8 text-white shadow-2xl shadow-zinc-300 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Start Saving Water Today
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Build a measurable water-saving habit for your home or community.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-emerald-300">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold text-zinc-950">
              RainGrid
            </span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Rainwater planning, local water sharing, and sustainability
            analytics for communities that want measurable resilience.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-zinc-600">
          <Link href="/calculator" className="hover:text-zinc-950">
            Calculator
          </Link>
          <Link href="/marketplace" className="hover:text-zinc-950">
            Marketplace
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-950">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-zinc-950">
            Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
