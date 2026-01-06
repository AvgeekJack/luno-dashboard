"use client";

import Link from 'next/link';

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: 6 January 2026</p>
        <p className="text-slate-600 mb-8">This Privacy Policy is governed by the laws of the United Kingdom, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Luno Bot ("we", "us", "our") is committed to protecting your privacy and handling your personal data in accordance with UK data protection laws. This Privacy Policy explains how we collect, use, store, and protect your information when you use our Discord bot and web dashboard.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              By using Luno Bot, you consent to the collection and use of information as described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data Controller</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              For the purposes of UK data protection legislation, the data controller is Luno Bot. You can contact us at:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email: <a href="mailto:support@luno.bot" className="text-orange-600 hover:text-orange-700 underline">support@luno.bot</a><br />
              Discord: <a href="https://discord.gg/shGCTRhwez" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">discord.gg/shGCTRhwez</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information We Collect</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.1 Information from Discord</h3>
            <p className="text-slate-700 leading-relaxed mb-4">When you add Luno Bot to your Discord server or use our web dashboard, we collect:</p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>User Information:</strong> Discord user ID, username, discriminator, avatar, email address (when you log in to the dashboard)</li>
              <li><strong>Server Information:</strong> Server ID, server name, server icon, channel IDs, channel names, role IDs, role names</li>
              <li><strong>Message Data:</strong> Message IDs, message content (only when necessary for moderation features), message timestamps, author IDs</li>
              <li><strong>Member Data:</strong> Member IDs, join dates, role assignments, nickname changes</li>
              <li><strong>Moderation Actions:</strong> Warnings, bans, kicks, mutes, and other moderation actions performed through the bot</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.2 Information You Provide</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Configuration settings and preferences for your server</li>
              <li>Custom commands and automated responses you create</li>
              <li>Welcome messages, farewell messages, and other custom content</li>
              <li>Support requests and communications with us</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Usage Data:</strong> Commands executed, features used, interaction timestamps</li>
              <li><strong>Technical Data:</strong> IP addresses, browser type, device information (when accessing the web dashboard)</li>
              <li><strong>Cookies:</strong> As described in our <Link href="/cookies" className="text-orange-600 hover:text-orange-700 underline">Cookie Policy</Link></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Legal Basis for Processing</h2>
            <p className="text-slate-700 leading-relaxed mb-4">Under UK GDPR, we process your personal data on the following legal bases:</p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for specific purposes (Article 6(1)(a))</li>
              <li><strong>Contract Performance:</strong> Processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract (Article 6(1)(b))</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests or those of a third party, provided your interests and fundamental rights do not override those interests (Article 6(1)(f))</li>
              <li><strong>Legal Obligation:</strong> Processing is necessary to comply with a legal obligation (Article 6(1)(c))</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Service Provision:</strong> To operate, maintain, and provide the features and functionality of Luno Bot</li>
              <li><strong>Moderation:</strong> To enable automated moderation, logging, and server management features</li>
              <li><strong>Customisation:</strong> To personalise your experience and maintain your server-specific configurations</li>
              <li><strong>Communication:</strong> To respond to your enquiries, provide support, and send service-related announcements</li>
              <li><strong>Improvement:</strong> To analyse usage patterns, diagnose technical issues, and improve our service</li>
              <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Server Configuration Data:</strong> Retained whilst the bot is in your server and for 30 days after removal</li>
              <li><strong>Moderation Logs:</strong> Retained for up to 12 months unless deleted by a server administrator</li>
              <li><strong>Message Logs:</strong> Retained for up to 90 days for moderation purposes</li>
              <li><strong>User Account Data:</strong> Retained whilst you have an active account and for 30 days after deletion</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymised data may be retained indefinitely</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              You can request deletion of your data at any time by contacting us or removing the bot from your server. We will comply with deletion requests within 30 days unless we are required to retain certain data for legal or legitimate business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not sell, rent, or trade your personal data to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Discord:</strong> We operate on Discord's platform and are subject to Discord's Terms of Service and Privacy Policy</li>
              <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our service (e.g., hosting providers, database services). These providers are contractually obligated to protect your data</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or governmental authority</li>
              <li><strong>Protection of Rights:</strong> We may disclose information to enforce our Terms of Service, protect our rights and property, or ensure user safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. International Data Transfers</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your data may be transferred to and processed in countries outside the United Kingdom. When we transfer data internationally, we ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Adequacy decisions by the UK Government</li>
              <li>Standard contractual clauses approved by the UK authorities</li>
              <li>Binding corporate rules</li>
              <li>Other lawful transfer mechanisms under UK GDPR</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Your Rights Under UK GDPR</h2>
            <p className="text-slate-700 leading-relaxed mb-4">Under UK data protection law, you have the following rights:</p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Right of Access:</strong> You can request a copy of the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> You can request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Restriction:</strong> You can request that we limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> You can request your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> You can object to our processing of your data in certain circumstances</li>
              <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time</li>
              <li><strong>Right to Lodge a Complaint:</strong> You can complain to the Information Commissioner's Office (ICO) if you believe we have violated your rights</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              To exercise any of these rights, please contact us at <a href="mailto:support@luno.bot" className="text-orange-600 hover:text-orange-700 underline">support@luno.bot</a>. We will respond to your request within one month.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular backups and disaster recovery procedures</li>
              <li>Staff training on data protection and security</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. Whilst we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Luno Bot complies with Discord's minimum age requirement of 13 years (or higher in certain jurisdictions). We do not knowingly collect personal data from children under the age of 13. If you are under 13, please do not use our service.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information as soon as possible. If you believe we have collected data from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Updating the "Last updated" date at the top of this page</li>
              <li>Posting a notice on our website or Discord server</li>
              <li>Sending you a direct notification (where appropriate)</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your continued use of the service after any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email: <a href="mailto:support@luno.bot" className="text-orange-600 hover:text-orange-700 underline">support@luno.bot</a><br />
              Discord: <a href="https://discord.gg/shGCTRhwez" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">discord.gg/shGCTRhwez</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Information Commissioner's Office (ICO)</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have concerns about how we handle your personal data, you have the right to lodge a complaint with the UK Information Commissioner's Office:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Information Commissioner's Office<br />
              Wycliffe House<br />
              Water Lane<br />
              Wilmslow<br />
              Cheshire<br />
              SK9 5AF<br />
              <br />
              Telephone: 0303 123 1113<br />
              Website: <a href="https://ico.org.uk" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a>
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
