import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function SpecsAndContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Could not send message. Please check your entries.',
        });
        return;
      }

      setStatusMessage({
        type: 'success',
        text: `${data.confirmation} (Ref: ${data.ticketId})`,
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error sending your message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="specs" className="mx-auto max-w-[1220px] px-5 pt-20 pb-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Technical Lineup Comparison */}
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500">
            Technical Specifications
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
            Cross Lineup vs. Mini Surron
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            All four models share our 3000W brushless powertrain and 200 Nm peak torque, tuned for
            immediate wheelie lift and steep off-road climbs.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151820]">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#111319] text-xs uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-3.5 font-semibold">Metric</th>
                  <th className="px-4 py-3.5 font-semibold text-white">Cross (€1,000)</th>
                  <th className="px-4 py-3.5 font-semibold text-red-400">Red Edition (€1,200)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-3.5 text-zinc-400">Motor Power</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-white">3000W</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-white">3000W</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 text-zinc-400">Battery Voltage</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-white">48V</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-white">48V</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 text-zinc-400">Max Torque</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-white">200 Nm</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-white">200 Nm</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 text-zinc-400">Top Speed</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-emerald-400">50 km/h</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-red-400">55 km/h</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 text-zinc-400">Lighting</td>
                  <td className="px-4 py-3.5 text-zinc-200">LED Headlight / Bar</td>
                  <td className="px-4 py-3.5 text-zinc-200">High-Output LED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact / Direct Inquiry Form */}
        <div id="contact" className="lg:col-span-6">
          <div className="rounded-2xl border border-white/10 bg-[#151820] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500">
              Surron4You Direct
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
              Order or Ask a Question
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              Need delivery timelines, sizing advice, or fleet pricing? Send us a message directly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="cName" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Name *
                </label>
                <input
                  id="cName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="cEmail" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Email *
                </label>
                <input
                  id="cEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="cMsg" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Message *
                </label>
                <textarea
                  id="cMsg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Which bike are you interested in?"
                  className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>

              {statusMessage && (
                <div
                  role="status"
                  className={`flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
                    statusMessage.type === 'success'
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/35 bg-red-500/10 text-red-400'
                  }`}
                >
                  {statusMessage.type === 'success' && (
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
