import { useEffect, useRef, useState } from 'react'
import Hero3D from './Hero3D'

const CONTOUR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900' viewBox='0 0 900 900'%3E%3Cg fill='none' stroke='rgba(245,165,36,0.05)' stroke-width='1'%3E%3Ccircle cx='450' cy='450' r='80'/%3E%3Ccircle cx='450' cy='450' r='160'/%3E%3Ccircle cx='450' cy='450' r='250'/%3E%3Ccircle cx='450' cy='450' r='350'/%3E%3Ccircle cx='450' cy='450' r='440'/%3E%3C/g%3E%3C/svg%3E")`

function Radar() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
      <circle cx="110" cy="110" r="104" stroke="rgba(245,165,36,0.18)" />
      <circle cx="110" cy="110" r="72" stroke="rgba(245,165,36,0.14)" />
      <circle cx="110" cy="110" r="40" stroke="rgba(245,165,36,0.12)" />
      <line x1="110" y1="6" x2="110" y2="214" stroke="rgba(232,230,224,0.06)" />
      <line x1="6" y1="110" x2="214" y2="110" stroke="rgba(232,230,224,0.06)" />
      <g className="radar-sweep">
        <line x1="110" y1="110" x2="110" y2="10" stroke="rgba(245,165,36,0.7)" strokeWidth="1.5" />
      </g>
      <circle cx="142" cy="70" r="3" fill="#f5a524" />
      <circle cx="78" cy="140" r="2.4" fill="rgba(245,165,36,0.6)" />
    </svg>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.66rem] tracking-[0.35em] text-[#f5a524] font-medium mb-8" style={{ fontFamily: 'ui-monospace, monospace' }}>
      {children}
    </p>
  )
}


function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let start = 0
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect()
        start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const e = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(target * e))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, duration])
  return { ref, val }
}

function StatNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const { ref, val } = useCountUp(value)
  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

export default function App() {
  const heroBg = useRef<HTMLDivElement>(null)
  const spot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (heroBg.current) heroBg.current.style.transform = `translateY(${window.scrollY * 0.25}px)`
      })
    }
    const onMove = (e: MouseEvent) => {
      if (spot.current) spot.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove)
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div id="top" className="min-h-screen bg-[#060605] text-[#e8e6e0] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div ref={spot} className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-30 opacity-70 hidden md:block" style={{ background: 'radial-gradient(closest-side, rgba(245,165,36,0.10), transparent)', mixBlendMode: 'screen' }} />

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#060605]/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.25em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="w-2.5 h-2.5 bg-[#f5a524]" />
            SUNNY AIR SYSTEMS
          </a>
          <nav className="hidden md:flex items-center gap-8 text-[0.8rem] text-[#8a877e]">
            <a href="#mission" className="hover:text-[#e8e6e0] transition-colors">Mission</a>
            <a href="#gap" className="hover:text-[#e8e6e0] transition-colors">The Gap</a>
            <a href="#wildfire" className="hover:text-[#e8e6e0] transition-colors">Wildfire R&amp;D</a>
            <a href="#energy" className="hover:text-[#e8e6e0] transition-colors">Energy R&amp;D</a>
            <a href="#capability" className="hover:text-[#e8e6e0] transition-colors">Capability</a>
            <a href="#contact" className="px-4 py-2 border border-white/25 text-[#e8e6e0] tracking-[0.2em] text-[0.7rem] hover:border-[#f5a524] hover:text-[#f5a524] transition-colors">CONTACT</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div ref={heroBg} className="absolute inset-0" style={{ backgroundImage: CONTOUR, backgroundSize: '900px', backgroundPosition: '70% 30%', backgroundRepeat: 'no-repeat' }} />
        <Hero3D />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(6,6,5,0.55), rgba(6,6,5,0.15) 40%, rgba(6,6,5,0.92))' }} />
        <div className="ember w-[34rem] h-[34rem] bg-[#f5a524]/[0.07] -top-40 right-[-8rem]" />
        <div className="ember w-[26rem] h-[26rem] bg-[#c2410c]/[0.06] bottom-[-10rem] left-[-8rem]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
          <Eyebrow>SUNNY AIR SYSTEMS - SACRAMENTO, CA</Eyebrow>
          <h1 className="text-[clamp(2.8rem,7.5vw,6.2rem)] leading-[0.98] font-bold max-w-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Command the sky<br />with your <span className="text-[#f5a524]">voice.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-[#8a877e] leading-relaxed">
            Sunny Air Systems is building voice-commanded drone operations for wildfire readiness, search and rescue, and the missions that keep people out of harm's way.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#wildfire" className="px-7 py-3.5 bg-[#f5a524] text-[#060605] text-[0.72rem] font-semibold tracking-[0.2em] hover:bg-[#ffb93e] transition-colors">EXPLORE THE R&amp;D</a>
            <a href="#contact" className="px-7 py-3.5 border border-white/25 text-[0.72rem] font-semibold tracking-[0.2em] hover:border-[#f5a524] hover:text-[#f5a524] transition-colors">GET IN TOUCH</a>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="py-12 md:pr-10 reveal">
            <p className="text-4xl md:text-5xl font-bold text-[#f5a524]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}><StatNumber value={900} suffix="+" /></p>
            <p className="mt-3 text-sm text-[#8a877e] leading-relaxed">California fires flagged by AI camera networks before the first 911 call. The alarm now comes first. What happens next is still too slow.</p>
          </div>
          <div className="py-12 md:px-10 reveal">
            <p className="text-4xl md:text-5xl font-bold text-[#f5a524]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}><StatNumber value={45} prefix="~" suffix=" min" /></p>
            <p className="mt-3 text-sm text-[#8a877e] leading-relaxed">average lead time AI camera alerts hold over 911 calls. Lead time only matters if someone converts it into confirmation and response.</p>
          </div>
          <div className="py-12 md:pl-10 reveal">
            <p className="text-4xl md:text-5xl font-bold text-[#f5a524]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>$394-893B</p>
            <p className="mt-3 text-sm text-[#8a877e] leading-relaxed">estimated total annual cost of wildfire in the US. Federal suppression alone averages $2.5B a year - and the curve keeps climbing.</p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="relative overflow-hidden">
        <span className="ghost text-[clamp(5rem,14vw,13rem)] top-10 left-[-1rem]">WILDFIRE</span>
        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-44">
          <Eyebrow>THE MISSION</Eyebrow>
          <p className="text-[clamp(1.7rem,4vw,3.2rem)] leading-[1.15] font-semibold max-w-4xl reveal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Wildfires in the American West are getting faster. Response has to get faster too. We're building the drone layer that listens, launches, and looks - <span className="text-[#f5a524]">before the smoke column does.</span>
          </p>
        </div>
      </section>

      {/* THE GAP */}
      <section id="gap" className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <Eyebrow>THE GAP WE'RE BUILDING AGAINST</Eyebrow>
          <p className="text-[clamp(1.3rem,2.6vw,2rem)] leading-snug font-semibold max-w-3xl mb-14 reveal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Detection alone doesn't cut costs. <span className="text-[#f5a524]">Detection linked to immediate verification and response does.</span>
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <div className="bg-[#060605] p-8 reveal">
              <p className="text-[#f5a524] text-sm mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>01</p>
              <h3 className="text-xl font-bold tracking-wide mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>THE CONFIRMATION LAYER</h3>
              <p className="text-sm text-[#8a877e] leading-relaxed">Cameras and satellites raise the alarm, but a person still has to decide what is real before crews roll. A fast, cheap aerial verification layer between the AI alert and the dispatch decision is the missing middle - and nobody owns it yet.</p>
            </div>
            <div className="bg-[#060605] p-8 reveal">
              <p className="text-[#f5a524] text-sm mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>02</p>
              <h3 className="text-xl font-bold tracking-wide mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NIGHT AND SMOKE</h3>
              <p className="text-sm text-[#8a877e] leading-relaxed">Crewed firefighting aircraft are largely grounded by darkness and heavy smoke - exactly when young fires grow into big ones. Uncrewed aircraft don't tire and don't need daylight - operating within waivers and incident command, they can cover the hours crewed aviation can't. Agencies keep naming this gap themselves.</p>
            </div>
            <div className="bg-[#060605] p-8 reveal">
              <p className="text-[#f5a524] text-sm mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>03</p>
              <h3 className="text-xl font-bold tracking-wide mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>THE AIRSPACE</h3>
              <p className="text-sm text-[#8a877e] leading-relaxed">218 unauthorized drone incursions over US wildfires in 2025 - the most ever recorded. Every incursion can ground the tankers. Fire airspace needs disciplined, authorized operators who understand incident coordination, not hobbyists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WILDFIRE R&D LANES */}
      <section id="wildfire" className="relative border-t border-white/10 overflow-hidden">
        <span className="ghost text-[clamp(4rem,12vw,11rem)] top-8 right-[-2rem]">RESPONSE</span>
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
            <div>
              <Eyebrow>WILDFIRE R&amp;D - THREE LANES</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Find it early. Stage the fight. <span className="text-[#f5a524]">Keep it small.</span>
              </h2>
            </div>
            <div className="hidden lg:block opacity-80"><Radar /></div>
          </div>
          <div className="space-y-5">
            <div className="lane p-8 md:p-10 reveal">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-baseline gap-5">
                  <span className="text-[#f5a524] text-sm" style={{ fontFamily: 'ui-monospace, monospace' }}>01</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SEE IT FIRST</h3>
                </div>
                <span className="pill">RESEARCH DIRECTION</span>
              </div>
              <p className="text-[#8a877e] leading-relaxed max-w-3xl">
                AI camera networks now catch fires before 911 - then a person still has to confirm what is real. Our first lane is that missing middle: voice-dispatched drones that verify the alert, map the perimeter, and find the people in the path. Search-and-rescue and fire detection are the same problem from the air - the spot fire and the stranded hiker, found in the same pass, at night and in smoke, when crewed aircraft are grounded. Built on our voice-first command layer, so one operator directs the search instead of flying it.
              </p>
            </div>
            <div className="lane p-8 md:p-10 reveal">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-baseline gap-5">
                  <span className="text-[#f5a524] text-sm" style={{ fontFamily: 'ui-monospace, monospace' }}>02</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>STAGE THE SUPPRESSANT</h3>
                </div>
                <span className="pill">CONCEPT STUDY</span>
              </div>
              <p className="text-[#8a877e] leading-relaxed max-w-3xl">
                Pre-positioned suppressant staged in strategic terrain before the season peaks - moved and delivered by autonomous heavy-lift aircraft in the Elroy Air Chaparral class: 500+ lb of payload, 450 miles of range, hybrid-electric, no runway required. That is the middle mile between a pickup truck and a helicopter, and CAL FIRE is publicly researching drone supply delivery for exactly this. Our play is to operate and maintain, not manufacture - the load is already there when the window is still open.
              </p>
            </div>
            <div className="lane p-8 md:p-10 reveal">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-baseline gap-5">
                  <span className="text-[#f5a524] text-sm" style={{ fontFamily: 'ui-monospace, monospace' }}>03</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>KEEP IT SMALL</h3>
                </div>
                <span className="pill">IN ACTIVE DEVELOPMENT</span>
              </div>
              <p className="text-[#8a877e] leading-relaxed max-w-3xl">
                The cheapest fire is the one that never spreads. Prevention is year-round, contract-shaped work: prescribed-burn support with IGNIS-class aerial ignition, fuels and vegetation mapping, utility line inspection, and pre-fire readiness baselines - access routes, defensible space, water sources - re-flown so land stewards act before the season, not during the incident. Our first mission, <span className="text-[#e8e6e0]">Baseline-40</span>, proves this workflow end to end on a 40-acre private test site in Los Angeles County.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT LAYER */}
      <section id="building" className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <Eyebrow>WHAT WE'RE BUILDING</Eyebrow>
          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <div className="bg-[#060605] p-8 reveal">
              <p className="text-[#f5a524] text-sm mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>01</p>
              <h3 className="text-xl font-bold tracking-[0.15em] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VOICE OPS</h3>
              <p className="text-[#e8e6e0] italic mb-4">"Say it. It flies."</p>
              <p className="text-sm text-[#8a877e] leading-relaxed">Voice-commanded drone operations: natural-language tasking for launch, routing, and return, so an operator manages the mission instead of the sticks.</p>
            </div>
            <div className="bg-[#060605] p-8 reveal">
              <p className="text-[#f5a524] text-sm mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>02</p>
              <h3 className="text-xl font-bold tracking-[0.15em] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WILDFIRE READINESS</h3>
              <p className="text-[#e8e6e0] italic mb-4">"Baseline before the burn."</p>
              <p className="text-sm text-[#8a877e] leading-relaxed">Repeatable aerial readiness surveys of land and infrastructure - our first mission, Baseline-40, maps a 40-acre private test site to prove the workflow end to end.</p>
            </div>
            <div className="bg-[#060605] p-8 reveal">
              <p className="text-[#f5a524] text-sm mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>03</p>
              <h3 className="text-xl font-bold tracking-[0.15em] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SWARM VISION</h3>
              <p className="text-[#e8e6e0] italic mb-4">"One operator. Many aircraft."</p>
              <p className="text-sm text-[#8a877e] leading-relaxed">On the roadmap: coordinated multi-drone operations for wide-area awareness, built on the same voice-first command layer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ENERGY R&D + SUPPLY CHAIN */}
      <section id="energy" className="relative border-t border-white/10 overflow-hidden">
        <span className="ghost text-[clamp(4rem,12vw,10rem)] bottom-6 left-[-1rem]">ENDURANCE</span>
        <div className="relative max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16">
          <div className="reveal">
            <Eyebrow>R&amp;D - BATTERY &amp; ENERGY</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Endurance is the binding constraint.</h2>
            <p className="text-[#8a877e] leading-relaxed">
              Endurance is the named constraint across the industry: the standard ignition aircraft flies 22-30 minutes fully loaded, and federal reviewers cite flight range as the barrier to wider drone detection. Our energy R&amp;D lane studies endurance-focused system design, battery-health awareness, charging logistics and field readiness, and lifecycle cost - so future aircraft fly longer and turn around faster. This is research-stage work: we make no performance, safety, or certification claims before validation.
            </p>
          </div>
          <div className="reveal">
            <Eyebrow>R&amp;D - TRUSTED SUPPLY CHAIN</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Built for the American drone decade.</h2>
            <p className="text-[#8a877e] leading-relaxed">
              In December 2025, the FCC moved covered foreign-produced drones onto its Covered List, blocking new equipment authorizations. Models already authorized can still be imported, sold, and flown - but whatever comes next has to be authorized here, which favors American airframes, power systems, and batteries. A structural opening, not a trend. We study where practical innovation in serviceability, sourcing, and mission readiness can serve commercial operators, agencies, and public-safety organizations - and we claim nothing we cannot show.
            </p>
          </div>
        </div>
      </section>

      {/* CAPABILITY */}
      <section id="capability" className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <Eyebrow>CAPABILITY - AT A GLANCE</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-bold mb-14 max-w-3xl leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Small company. <span className="text-[#f5a524]">Real credentials.</span>
          </h2>
          <div className="reveal">
            <div className="spec-row"><span className="spec-label">COMPANY</span><span>Sunny Air Systems - the aerial-systems arm of Sunny Visuals LLC - Sacramento, California</span></div>
            <div className="spec-row"><span className="spec-label">LEGAL</span><span>Sunny Visuals LLC, California entity 202358011524 - in business since June 2023</span></div>
            <div className="spec-row"><span className="spec-label">FLIGHT OPERATIONS</span><span>FAA Part 107 certification in progress</span></div>
            <div className="spec-row"><span className="spec-label">R&amp;D SITE</span><span>40-acre private test site, Los Angeles County, California</span></div>
            <div className="spec-row"><span className="spec-label">DEMONSTRATION</span><span>Baseline-40 wildfire-readiness mission - in active development</span></div>
            <div className="spec-row"><span className="spec-label">PAST PERFORMANCE</span><span>Aerial media and documentation projects since 2023 through Sunny Visuals LLC: GIS mapping, construction progress documentation, real estate media, and public-sector project documentation</span></div>
            <div className="spec-row"><span className="spec-label">CONTACT</span><span>cd@sunnyvisualsllc.com - (279) 766-0746</span></div>
          </div>
          <p className="mt-12 max-w-2xl text-[#8a877e] leading-relaxed reveal">
            We are a pre-launch company. Everything above is real, current, and verifiable - and we'd rather show you than tell you.
          </p>
        </div>
      </section>

      {/* WHY NOW */}
      <section id="why" className="relative border-t border-white/10 overflow-hidden">
        <div className="ember w-[30rem] h-[30rem] bg-[#c2410c]/[0.05] top-[-8rem] right-[-6rem]" />
        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <Eyebrow>THE OPENING</Eyebrow>
          <p className="text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.2] font-semibold max-w-4xl reveal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The American drone industry is being rebuilt - new supply chains, new autonomy, new missions. Wildfire seasons keep setting records. The operators who combine both will define the next decade of aerial work. <span className="text-[#f5a524]">Sunny Air Systems is building for that decade.</span>
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative border-t border-white/10 overflow-hidden">
        <div className="ember w-[28rem] h-[28rem] bg-[#f5a524]/[0.06] top-[-6rem] left-1/3" />
        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <Eyebrow>GET IN TOUCH</Eyebrow>
          <h2 className="text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[1.02]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Flying soon.<br />Talking now.
          </h2>
          <p className="mt-6 max-w-lg text-[#8a877e] leading-relaxed">
            Partnering, investing, or building in drones and wildfire tech? We want to hear from you.
          </p>
          <a href="mailto:cd@sunnyvisualsllc.com" className="inline-block mt-10 px-8 py-4 bg-[#f5a524] text-[#060605] text-[0.75rem] font-semibold tracking-[0.2em] hover:bg-[#ffb93e] transition-colors">CD@SUNNYVISUALSLLC.COM</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[0.72rem] tracking-[0.18em] text-[#8a877e]">
          <span className="flex items-center gap-2.5 font-semibold text-[#e8e6e0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="w-2 h-2 bg-[#f5a524]" />SUNNY AIR SYSTEMS
          </span>
          <div className="flex gap-8">
            <a href="#mission" className="hover:text-[#e8e6e0] transition-colors">Mission</a>
            <a href="#wildfire" className="hover:text-[#e8e6e0] transition-colors">Wildfire R&amp;D</a>
            <a href="#capability" className="hover:text-[#e8e6e0] transition-colors">Capability</a>
            <a href="mailto:cd@sunnyvisualsllc.com" className="hover:text-[#e8e6e0] transition-colors">cd@sunnyvisualsllc.com</a>
          </div>
          <span>A DBA OF SUNNY VISUALS LLC - SACRAMENTO, CALIFORNIA</span>
        </div>
      </footer>
    </div>
  )
}
