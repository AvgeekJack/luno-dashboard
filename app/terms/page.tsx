"use client";

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-orange-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10" />
            <div className="text-left">
              <span className="block text-xl font-bold tracking-tight">LUNO</span>
              <span className="block text-sm text-slate-500">Dashboard</span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-24 mt-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: 6 January 2026</p>
        <p className="text-slate-600 mb-8">These Terms of Service are governed by the laws of England and Wales (United Kingdom).</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing or using Luno Bot ("the Bot", "we", "us", "our"), you agree to be bound by these Terms of Service and all applicable laws and regulations of the United Kingdom. If you do not agree with any part of these terms, you must not use our service.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              These terms constitute a legally binding agreement between you and Luno Bot. By using the Bot, you represent that you are at least 13 years of age (or the minimum age required by Discord's Terms of Service).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Luno Bot is a Discord bot that provides server management, moderation, and engagement tools for Discord communities. The service includes but is not limited to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Automated moderation features</li>
              <li>Server management tools</li>
              <li>Custom commands and configurations</li>
              <li>Logging and analytics</li>
              <li>Web dashboard for configuration</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Obligations</h2>
            <p className="text-slate-700 leading-relaxed mb-4">When using Luno Bot, you agree to:</p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Comply with Discord's Terms of Service and Community Guidelines</li>
              <li>Comply with all applicable laws and regulations of the United Kingdom</li>
              <li>Not use the Bot for any unlawful, harmful, or abusive purposes</li>
              <li>Not attempt to exploit, hack, or reverse engineer the Bot</li>
              <li>Not use the Bot to harass, threaten, or harm others</li>
              <li>Not attempt to circumvent any limitations or restrictions we impose</li>
              <li>Not use the Bot to distribute spam, malware, or malicious content</li>
              <li>Not impersonate others or misrepresent your affiliation with any entity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              All content, features, and functionality of Luno Bot, including but not limited to software, code, text, graphics, logos, and trademarks, are the exclusive property of Luno Bot and are protected by United Kingdom and international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              You are granted a limited, non-exclusive, non-transferable licence to use the Bot for its intended purpose. You may not copy, modify, distribute, sell, or lease any part of our service without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Collection and Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We collect and process certain data as described in our <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline">Privacy Policy</Link>. By using the Bot, you consent to such collection and processing in accordance with UK data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              We are committed to protecting your privacy and handling your data responsibly. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To the maximum extent permitted by UK law, Luno Bot is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>The Bot will be uninterrupted, timely, secure, or error-free</li>
              <li>The results obtained from using the Bot will be accurate or reliable</li>
              <li>Any errors in the Bot will be corrected</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              In no event shall Luno Bot be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use of the Bot.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nothing in these terms shall exclude or limit our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited under UK law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Indemnification</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless Luno Bot, its operators, affiliates, and service providers from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Your use or misuse of the Bot</li>
              <li>Your violation of these Terms of Service</li>
              <li>Your violation of any rights of another party</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to the Bot at any time, with or without notice, for any reason, including but not limited to violation of these Terms of Service or behaviour that we deem harmful to the Bot, its users, or third parties.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              You may stop using the Bot at any time by removing it from your Discord server. Upon termination, your right to use the Bot will immediately cease.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Sections that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, disclaimers, indemnification, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page and, where appropriate, by posting a notice on our Discord server or website.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your continued use of the Bot after any changes to these terms constitutes your acceptance of the modified terms. If you do not agree to the modified terms, you must stop using the Bot.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Luno Bot integrates with Discord and may interact with other third-party services. Your use of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible for the content, accuracy, or availability of third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Dispute Resolution and Governing Law</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Any dispute arising out of or in connection with these terms, including any question regarding their existence, validity, or termination, shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Before pursuing any legal action, we encourage you to contact us at <a href="mailto:legal@luno.bot" className="text-orange-600 hover:text-orange-700 underline">legal@luno.bot</a> to attempt to resolve the dispute informally.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Severability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If any provision of these Terms of Service is found to be invalid, illegal, or unenforceable under UK law, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Entire Agreement</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms of Service, together with our Privacy Policy, Cookie Policy, and GDPR Notice, constitute the entire agreement between you and Luno Bot regarding the use of the Bot and supersede any prior agreements or understandings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions, concerns, or complaints regarding these Terms of Service, please contact us at:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email: <a href="mailto:legal@luno.bot" className="text-orange-600 hover:text-orange-700 underline">legal@luno.bot</a><br />
              Discord: <a href="https://discord.gg/shGCTRhwez" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">discord.gg/shGCTRhwez</a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm mb-4">© 2026 Luno Bot. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="text-slate-400 hover:text-orange-400 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-slate-400 hover:text-orange-400 transition-colors">Cookie Policy</Link>
            <Link href="/gdpr" className="text-slate-400 hover:text-orange-400 transition-colors">GDPR Notice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
