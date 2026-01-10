"use client";

import Link from 'next/link';

export default function CookiePolicy() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: 6 January 2026</p>
        <p className="text-slate-600 mb-8">This Cookie Policy is governed by UK law, including the Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR).</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Cookies can be "persistent" (remaining on your device until they expire or you delete them) or "session" (deleted when you close your browser). They can also be "first-party" (set by the website you're visiting) or "third-party" (set by a different website).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Luno Bot's website and web dashboard use cookies to enhance your experience, provide essential functionality, and understand how you use our service. We only use cookies where necessary and in compliance with UK law.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              By using our website, you consent to our use of cookies as described in this policy. You can manage your cookie preferences as described in Section 7 below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Types of Cookies We Use</h2>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.1 Strictly Necessary Cookies</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and accessibility. The website cannot function properly without these cookies, and they can only be disabled by changing your browser preferences.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-bold">Cookie Name</th>
                    <th className="text-left py-2 pr-4 font-bold">Purpose</th>
                    <th className="text-left py-2 font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">next-auth.session-token</td>
                    <td className="py-2 pr-4">Maintains your login session</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">next-auth.csrf-token</td>
                    <td className="py-2 pr-4">Protects against cross-site request forgery attacks</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">next-auth.callback-url</td>
                    <td className="py-2 pr-4">Remembers where to redirect you after login</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>Legal Basis:</strong> These cookies are necessary for the performance of our contract with you (Article 6(1)(b) UK GDPR) and do not require consent under PECR.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.2 Functional Cookies</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              These cookies enable enhanced functionality and personalisation, such as remembering your preferences and settings. They may be set by us or third-party providers whose services we use on our pages.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-bold">Cookie Name</th>
                    <th className="text-left py-2 pr-4 font-bold">Purpose</th>
                    <th className="text-left py-2 font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-4">theme-preference</td>
                    <td className="py-2 pr-4">Stores your dark/light mode preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">dashboard-preferences</td>
                    <td className="py-2 pr-4">Remembers your dashboard layout and settings</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>Legal Basis:</strong> Your consent (Article 6(1)(a) UK GDPR). You can withdraw consent at any time by managing your cookie preferences.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3.3 Analytics Cookies</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this information to improve how our website works.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-bold">Cookie Name</th>
                    <th className="text-left py-2 pr-4 font-bold">Purpose</th>
                    <th className="text-left py-2 font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 pr-4">_analytics</td>
                    <td className="py-2 pr-4">Tracks anonymised usage statistics</td>
                    <td className="py-2">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>Legal Basis:</strong> Your consent (Article 6(1)(a) UK GDPR). These cookies are not set unless you explicitly consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may use third-party services that set cookies on our website:
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4.1 Discord OAuth</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you log in using Discord, Discord may set cookies to manage your authentication. These cookies are subject to Discord's Privacy Policy and Cookie Policy.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4.2 Cloud Hosting Providers</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our hosting providers may set cookies for security, load balancing, and performance optimisation purposes.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
              We carefully select third-party providers and ensure they comply with UK data protection laws. However, we do not control third-party cookies. Please review their respective privacy and cookie policies for more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. How Long Do Cookies Last?</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The duration of cookies varies depending on their purpose:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device until they expire or you manually delete them. Expiry periods vary from a few days to several years, depending on the cookie's purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Why Do We Use Cookies?</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><strong>Authentication:</strong> To identify you when you log in and keep you logged in as you navigate the site</li>
              <li><strong>Security:</strong> To protect your account and our service from fraudulent or malicious activity</li>
              <li><strong>Preferences:</strong> To remember your settings and choices (e.g., language, theme)</li>
              <li><strong>Performance:</strong> To monitor and analyse how our website performs and how it's used</li>
              <li><strong>Functionality:</strong> To provide enhanced features and personalised content</li>
              <li><strong>Analytics:</strong> To understand visitor behaviour and improve our service (only with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Managing Your Cookie Preferences</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in several ways:
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">7.1 Browser Settings</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can set your browser to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Block all cookies</li>
              <li>Block only third-party cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Notify you before cookies are set</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              Please note that blocking all cookies may affect your ability to use our website and access certain features.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">7.2 Cookie Consent Tool</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you first visit our website, you'll see a cookie consent banner. You can choose which categories of cookies to accept or reject. You can update your preferences at any time by clicking the "Cookie Settings" link in the footer.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">7.3 Browser-Specific Instructions</h3>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <ul className="text-slate-700 leading-relaxed space-y-2">
                <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Impact of Disabling Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you choose to disable or reject cookies, please note that:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>You may not be able to log in to your account</li>
              <li>Some features and functionality may not work properly</li>
              <li>Your preferences and settings may not be saved</li>
              <li>You may need to manually adjust settings each time you visit</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              Strictly necessary cookies cannot be disabled if you want to use our service, as they are essential for authentication and security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Updates to This Cookie Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li>Updating the "Last updated" date at the top of this page</li>
              <li>Displaying a prominent notice on our website</li>
              <li>Requesting your renewed consent where required by law</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. More Information About Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              For more information about cookies and how to manage them, you can visit:
            </p>
            <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
              <li><a href="https://www.aboutcookies.org" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">AboutCookies.org</a></li>
              <li><a href="https://www.allaboutcookies.org" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">AllAboutCookies.org</a></li>
              <li><a href="https://ico.org.uk/for-the-public/online/cookies/" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">ICO Guidance on Cookies</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions or concerns about our use of cookies, please contact us at:
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email: <a href="mailto:legal@luno.bot" className="text-orange-600 hover:text-orange-700 underline">legal@luno.bot</a><br />
              Discord: <a href="https://discord.gg/shGCTRhwez" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">discord.gg/shGCTRhwez</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Regulatory Authority</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have concerns about our use of cookies and believe we are not complying with UK law, you can contact the Information Commissioner's Office:
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
