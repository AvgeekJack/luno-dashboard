"use client";

import Link from 'next/link';

export default function GDPRNotice() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">GDPR Notice</h1>
        <p className="text-slate-600 mb-8">Last updated: 6 January 2026</p>
        <p className="text-slate-600 mb-8">This notice is provided in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Purpose of This Notice</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              This GDPR Notice provides you with comprehensive information about how Luno Bot processes your personal data in compliance with UK data protection law. It supplements our <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline">Privacy Policy</Link> and provides specific details about your rights under the UK GDPR.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data Controller Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>Data Controller:</strong> Luno Bot<br />
              <strong>Contact Email:</strong> <a href="mailto:support@luno.bot" className="text-orange-600 hover:text-orange-700 underline">support@luno.bot</a><br />
              <strong>Discord Server:</strong> <a href="https://discord.gg/shGCTRhwez" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">discord.gg/shGCTRhwez</a>
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              As the data controller, we determine the purposes and means of processing your personal data and are responsible for ensuring compliance with UK GDPR.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Personal Data We Process</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We process the following categories of personal data:
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.1 Identity Data</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Discord user ID (unique identifier)</li>
              <li>Discord username and discriminator</li>
              <li>Display name and nicknames</li>
              <li>Avatar image URL</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.2 Contact Data</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Email address (when provided via Discord OAuth)</li>
              <li>Discord communication channels</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.3 Server and Usage Data</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Discord server IDs and names</li>
              <li>Channel IDs and names</li>
              <li>Role IDs, names, and assignments</li>
              <li>Commands executed and features used</li>
              <li>Configuration settings and preferences</li>
              <li>Timestamps of actions and events</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.4 Message Data</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Message IDs</li>
              <li>Message content (only when necessary for moderation features)</li>
              <li>Message timestamps</li>
              <li>Author information</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.5 Moderation Data</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Warnings, bans, kicks, and mutes</li>
              <li>Moderation reasons and notes</li>
              <li>Moderator responsible for actions</li>
              <li>Timestamps of moderation actions</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.6 Technical Data</h3>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>IP addresses (when accessing the web dashboard)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Cookie identifiers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Legal Bases for Processing</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Under Article 6 of the UK GDPR, we process your personal data based on the following lawful bases:
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Consent (Article 6(1)(a))</h3>
              <p className="text-slate-700 leading-relaxed mb-2">
                You have given clear consent for us to process your personal data for specific purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 leading-relaxed space-y-1">
                <li>Adding the bot to your Discord server</li>
                <li>Logging in to the web dashboard</li>
                <li>Using analytics and non-essential cookies</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Contract Performance (Article 6(1)(b))</h3>
              <p className="text-slate-700 leading-relaxed mb-2">
                Processing is necessary to provide the service you requested:
              </p>
              <ul className="list-disc pl-6 text-slate-700 leading-relaxed space-y-1">
                <li>Operating core bot functionality</li>
                <li>Maintaining your configuration settings</li>
                <li>Executing commands and features</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Legal Obligation (Article 6(1)(c))</h3>
              <p className="text-slate-700 leading-relaxed mb-2">
                Processing is necessary to comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 text-slate-700 leading-relaxed space-y-1">
                <li>Responding to lawful requests from authorities</li>
                <li>Complying with court orders</li>
                <li>Meeting regulatory requirements</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Legitimate Interests (Article 6(1)(f))</h3>
              <p className="text-slate-700 leading-relaxed mb-2">
                Processing is necessary for our legitimate interests or those of third parties:
              </p>
              <ul className="list-disc pl-6 text-slate-700 leading-relaxed space-y-1">
                <li>Improving service quality and performance</li>
                <li>Detecting and preventing fraud and abuse</li>
                <li>Ensuring network and information security</li>
                <li>Analysing usage to develop new features</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-2">
                We have carefully balanced these interests against your rights and freedoms.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights Under UK GDPR</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>

            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right of Access (Article 15)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You have the right to request a copy of the personal data we hold about you. We will provide this information free of charge within one month of your request.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right to Rectification (Article 16)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You have the right to request correction of inaccurate or incomplete personal data. We will update the information within one month.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right to Erasure / "Right to be Forgotten" (Article 17)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You have the right to request deletion of your personal data when:
                </p>
                <ul className="list-disc pl-6 text-slate-700 leading-relaxed mt-2 space-y-1">
                  <li>The data is no longer necessary for its original purpose</li>
                  <li>You withdraw consent and there's no other legal basis</li>
                  <li>You object to processing and there are no overriding legitimate grounds</li>
                  <li>The data has been unlawfully processed</li>
                  <li>Deletion is required to comply with a legal obligation</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right to Restriction of Processing (Article 18)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You can request that we restrict processing of your data when accuracy is contested, processing is unlawful, or you need the data for legal claims.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right to Data Portability (Article 20)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit it to another data controller.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right to Object (Article 21)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You have the right to object to processing based on legitimate interests or for direct marketing purposes. We will cease processing unless we have compelling legitimate grounds.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right Not to be Subject to Automated Decision-Making (Article 22)</h3>
                <p className="text-slate-700 leading-relaxed">
                  You have the right not to be subject to decisions based solely on automated processing that produce legal or similarly significant effects. We do not make such decisions without human involvement.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Right to Withdraw Consent</h3>
                <p className="text-slate-700 leading-relaxed">
                  Where processing is based on consent, you have the right to withdraw that consent at any time. This will not affect the lawfulness of processing before the withdrawal.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. How to Exercise Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To exercise any of your rights, please contact us at:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email: <a href="mailto:support@luno.bot" className="text-orange-600 hover:text-orange-700 underline">support@luno.bot</a><br />
              Discord: <a href="https://discord.gg/shGCTRhwez" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">discord.gg/shGCTRhwez</a>
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              When making a request, please provide:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Your Discord user ID</li>
              <li>Sufficient information to identify you and verify your identity</li>
              <li>A clear description of the right you wish to exercise</li>
              <li>Any relevant details about the specific data or processing you're concerned about</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              We will respond to your request within <strong>one month</strong> of receiving it. In complex cases, we may extend this by up to two additional months, and we will inform you of any such extension.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not charge a fee for exercising your rights unless your request is manifestly unfounded or excessive, in which case we may charge a reasonable fee or refuse to act on the request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We retain personal data only for as long as necessary to fulfil the purposes for which it was collected:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-bold">Data Type</th>
                    <th className="text-left py-2 pr-4 font-bold">Retention Period</th>
                    <th className="text-left py-2 font-bold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">Server Configuration</td>
                    <td className="py-2 pr-4">Active + 30 days</td>
                    <td className="py-2">Service provision</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">Moderation Logs</td>
                    <td className="py-2 pr-4">Up to 12 months</td>
                    <td className="py-2">Accountability & appeals</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">Message Logs</td>
                    <td className="py-2 pr-4">Up to 90 days</td>
                    <td className="py-2">Moderation purposes</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">User Account Data</td>
                    <td className="py-2 pr-4">Active + 30 days</td>
                    <td className="py-2">Dashboard access</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Analytics Data</td>
                    <td className="py-2 pr-4">Indefinite (anonymised)</td>
                    <td className="py-2">Service improvement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. International Data Transfers</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your personal data may be transferred to and processed in countries outside the United Kingdom. When this occurs, we ensure appropriate safeguards are in place in accordance with Chapter V of the UK GDPR, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Transfers to countries with an adequacy decision from the UK Government</li>
              <li>Use of Standard Contractual Clauses (SCCs) approved by the UK authorities</li>
              <li>Binding Corporate Rules (where applicable)</li>
              <li>Other appropriate safeguards recognised under UK GDPR</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Data Security Measures</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              In accordance with Article 32 UK GDPR, we implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Pseudonymisation and encryption of personal data</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular backups and disaster recovery procedures</li>
              <li>Staff training on data protection and security</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Data Breach Notification</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              In accordance with Article 33 and 34 UK GDPR, in the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Notify the Information Commissioner's Office within 72 hours of becoming aware of the breach</li>
              <li>Notify affected individuals without undue delay if the breach is likely to result in a high risk to their rights and freedoms</li>
              <li>Provide clear information about the nature of the breach, likely consequences, and measures taken to address it</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Children's Data</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              In accordance with Article 8 UK GDPR and Discord's Terms of Service, we do not knowingly collect or process personal data from children under the age of 13. If we become aware that we have collected data from a child under 13, we will take immediate steps to delete that information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Supervisory Authority</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's supervisory authority for data protection:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-slate-700 leading-relaxed">
                <strong>Information Commissioner's Office</strong><br />
                Wycliffe House<br />
                Water Lane<br />
                Wilmslow<br />
                Cheshire<br />
                SK9 5AF<br />
                <br />
                Telephone: 0303 123 1113<br />
                Website: <a href="https://ico.org.uk" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a><br />
                Report a concern: <a href="https://ico.org.uk/make-a-complaint/" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint/</a>
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              We encourage you to contact us first so we can address your concerns directly, but you have the right to contact the ICO at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Updates to This Notice</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this GDPR Notice from time to time. Material changes will be communicated through our website, Discord server, or by direct notification. The "Last updated" date at the top of this page indicates when the notice was last revised.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              For any questions, concerns, or to exercise your rights under UK GDPR, please contact us at:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email: <a href="mailto:support@luno.bot" className="text-orange-600 hover:text-orange-700 underline">support@luno.bot</a><br />
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
