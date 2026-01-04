"use client";

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col items-center">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-orange-100 z-50 flex justify-center">
        <div className="w-full max-w-7xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center">
          <div className="flex items-center justify-center md:justify-start gap-3 w-full md:w-auto">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10" />
            <div className="text-left">
              <span className="block text-xl font-bold tracking-tight">LUNO</span>
              <span className="block text-sm text-slate-500">Dashboard</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 w-full md:w-auto">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Features</Link>
            <Link href="#commands" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Commands</Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">About</Link>
            <a href="https://discord.gg/luno" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Support</a>
            {session ? (
              <>
                <Link href="/servers" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-orange-600 transition-colors">
                  Dashboard
                </Link>
                {session.user && (
                  <div className="flex items-center gap-3 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
                    {session.user.image && (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-semibold text-[#0f172a]">
                      {session.user.name || 'User'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => signIn('discord')}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors"
              >
                Login with Discord
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center flex-1">
        {/* Hero Section */}
        <section className="w-full min-h-[90vh] pt-32 pb-24 px-6 bg-gradient-to-b from-orange-50 via-white to-white flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-[#0f172a] leading-tight">
                The Discord Bot that does it all. <span className="text-orange-500">Automatically</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed">
                A fully customizable server moderation Discord bot for your Discord server that features a simple and intuitive web dashboard. Server management just got a whole lot easier.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                {session ? (
                  <Link href="/servers" className="bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all inline-block text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button className="bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all">
                      Add To Server
                    </button>
                    <button
                      onClick={() => signIn('discord')}
                      className="bg-white text-slate-900 px-10 py-4 rounded-full text-lg font-semibold border-2 border-slate-200 shadow-md hover:border-orange-500 hover:shadow-lg transition-all"
                    >
                      Login with Discord
                    </button>
                  </>
                )}
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
                  <div className="text-4xl font-bold text-orange-500 mb-2">11.0M+</div>
                  <div className="text-slate-600 font-medium">Servers</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
                  <div className="text-4xl font-bold text-orange-500 mb-2">500M+</div>
                  <div className="text-slate-600 font-medium">Members Served</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
                  <div className="text-4xl font-bold text-orange-500 mb-2">150+</div>
                  <div className="text-slate-600 font-medium">Commands</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 px-6 bg-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-[#0f172a]">Why Luno?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need to manage, moderate, and engage your Discord community in one powerful bot.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">Powerful Moderation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Keep your server safe with comprehensive moderation tools including warns, kicks, bans, mutes, and automated modlogs. Track all mod actions with detailed logs showing who did what and when.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">Advanced AutoMod</h3>
                <p className="text-slate-600 leading-relaxed">
                  Automatically filter spam, bad links, attachments, mentions, and inappropriate content. Set custom rules with configurable punishments, rate limits, and whitelisted roles or channels.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">Custom Commands</h3>
                <p className="text-slate-600 leading-relaxed">
                  Create powerful custom commands with variables, embeds, random lists, and advanced logic. Share your creations with the community and execute other commands from within your tags.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">Reaction Roles</h3>
                <p className="text-slate-600 leading-relaxed">
                  Let members self-assign roles by reacting to messages. Support for unique mode, verify mode, reversed roles, temporary roles, and multiple roles per reaction. High limits and fast performance.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">Comprehensive Logging</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track deleted messages, edited messages, member updates, role changes, joins, leaves, bans, channel updates, and more. Split logging into separate channels to stay organized.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">Welcome Messages</h3>
                <p className="text-slate-600 leading-relaxed">
                  Greet new members with customizable welcome messages, farewell messages, and ban announcements. Send DMs upon joining and use embeds with variables for a personal touch.
                </p>
              </div>
            </div>

            {/* Detailed Feature Showcases */}
            <div className="space-y-24 mt-24">
              {/* AutoMod Showcase */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold mb-6 text-[#0f172a]">AutoMod</h3>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Punish bad links, spam, attachment spam, and mention spam automatically</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Select custom punishments per-rule being broken</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Delete dangerous file formats and filter inappropriate content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Mark channels as media-only to require links or attachments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Whitelist roles and channels to bypass rules</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Custom rate limits for fine-tuned control</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="text-green-400">✓ Spam filter active</div>
                    <div className="text-green-400">✓ Link filter enabled</div>
                    <div className="text-green-400">✓ Mention spam protection on</div>
                    <div className="text-orange-400 mt-6">⚠ User @Spammer violated spam rule</div>
                    <div className="text-slate-400 pl-4">→ Action: 10 minute timeout</div>
                    <div className="text-slate-400 pl-4">→ Deleted 5 messages</div>
                    <div className="text-slate-400 pl-4">→ Logged to #mod-logs</div>
                  </div>
                </div>
              </div>

              {/* Moderation Showcase */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="text-orange-400">/warn @User Rule Violation</div>
                    <div className="text-slate-400 pl-4">→ Warning issued to @User</div>
                    <div className="text-slate-400 pl-4">→ Total warnings: 2/3</div>
                    <div className="text-orange-400 mt-4">/ban @BadActor Raiding</div>
                    <div className="text-slate-400 pl-4">→ User banned permanently</div>
                    <div className="text-slate-400 pl-4">→ Reason: Raiding</div>
                    <div className="text-slate-400 pl-4">→ Moderator: @Admin</div>
                    <div className="text-green-400 mt-4">✓ All actions logged to modlog</div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-4xl font-bold mb-6 text-[#0f172a]">Powerful Moderation</h3>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Modlogs let your mods take responsibility for their actions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">All mod commands: warns, kicks, bans, mutes, timeouts (timed or permanent)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Drama channel for easy overview of rules being broken</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Sticky roles prevent users from leaving to remove their mute</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">View past infractions with reasons and responsible moderators</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Bulk role management and member highlighting</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Granular Permissions Showcase */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold mb-6 text-[#0f172a]">Granular Permission System</h3>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Give each command its own set of permission rules</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Manage commands in bulk directly from the web dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Add global rules that apply across all commands</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Redirect output or mute spammy commands</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Keep bot commands in designated channels without annoying anyone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Allow/ignore specific channels and roles per command</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="text-blue-400">Command: /meme</div>
                    <div className="text-slate-400 pl-4">→ Allowed: #bot-commands, #general</div>
                    <div className="text-slate-400 pl-4">→ Ignored: #serious-chat</div>
                    <div className="text-blue-400 mt-4">Command: /ban</div>
                    <div className="text-slate-400 pl-4">→ Allowed roles: @Moderator, @Admin</div>
                    <div className="text-slate-400 pl-4">→ All channels enabled</div>
                    <div className="text-green-400 mt-4">✓ Global rules applied</div>
                    <div className="text-slate-400 pl-4">→ Output in #bot-spam only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="w-full py-24 px-6 bg-gradient-to-b from-orange-50 to-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">Logging Everything</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Message events: deleted, edited, and purged messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Member updates: roles, names, avatars, bans, unbans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Server updates: channels, roles, and emojis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Track Discord invite links and member joins/leaves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Ignore specific channels, members, or bots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Split logging across multiple channels</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">Reaction Roles</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>High limits: up to 250 roles per message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Multiple modes: unique, verify, reversed, binding, temporary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Multiple roles with a single reaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Fast rate limiting to prevent spam abuse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Use any emoji, even from other servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Blacklist and whitelist roles for control</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">Welcome & Farewell</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Send welcome messages when members join</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Farewell messages when members leave</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Ban announcement messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Send DMs to new members upon joining</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Full embed support with custom colors and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Variables: member name, count, server name, and more</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">User Engagement</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Starboard for highlighting great messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Scheduled announcements with role pings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Fast Twitch/YouTube stream notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Role feeds for mentioning roles safely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Post count tracking and leaderboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Fun commands: cats, dogs, memes, and more</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Commands Section */}
        <section id="commands" className="w-full py-24 px-6 bg-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-[#0f172a]">Powerful Commands</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Over 150 commands across multiple modules to manage every aspect of your Discord server.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Moderation</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>/ban • /kick • /warn</p>
                  <p>/mute • /timeout • /unmute</p>
                  <p>/clear • /slowmode • /lock</p>
                </div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Utility Commands</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>/userinfo • /serverinfo</p>
                  <p>/avatar • /roleinfo</p>
                  <p>/poll • /remind • /stats</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Security</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>/antiraid • /antispam</p>
                  <p>/antilink • /verification</p>
                  <p>/captcha • /lockdown</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Fun Commands</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>/meme • /joke • /8ball</p>
                  <p>/cat • /dog • /gif</p>
                  <p>/roll • /flip • /choose</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Role Management</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>/role • /autorole • /massrole</p>
                  <p>/reactionrole • /selfrole</p>
                  <p>/roleall • /removerole</p>
                </div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Announcements</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>/announce • /embed</p>
                  <p>/schedule • /edit</p>
                  <p>/ping • /say</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/servers" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all">
                View All Commands
              </Link>
            </div>
          </div>
        </section>

        {/* About/Trust Section */}
        <section id="about" className="w-full py-24 px-6 bg-gradient-to-b from-orange-50 to-white flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-[#0f172a]">Trusted by Millions</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Luno is trusted by Discord communities worldwide to keep their servers safe, organized, and engaging.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">Lightning Fast</h3>
                <p className="text-slate-600">Optimized for speed with minimal latency and instant responses.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">99.9% Uptime</h3>
                <p className="text-slate-600">Reliable infrastructure ensures Luno is always available when you need it.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">24/7 Support</h3>
                <p className="text-slate-600">Our dedicated support team is always ready to help you.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h3 className="text-4xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-xl mb-8 opacity-90">
                Join millions of Discord users and start managing your server like a pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {session ? (
                  <Link href="/servers" className="bg-white text-orange-500 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all inline-block">
                    Open Dashboard
                  </Link>
                ) : (
                  <>
                    <button className="bg-white text-orange-500 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all">
                      Add to Discord
                    </button>
                    <button
                      onClick={() => signIn('discord')}
                      className="bg-slate-900 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all"
                    >
                      Login with Discord
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-6 bg-slate-900 text-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/luno-logo.png" alt="Luno Bot" className="w-12 h-12" />
                  <span className="text-2xl font-bold">LUNO</span>
                </div>
                <p className="text-slate-400 mb-6 max-w-sm">
                  The most powerful and customizable Discord bot for server management, moderation, and engagement.
                </p>
                <div className="flex gap-3">
                  <a href="https://discord.gg/luno" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00-.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/lunobot" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/lunobot" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">LUNO</h4>
                <ul className="space-y-3 text-slate-400">
                  <li><Link href="#features" className="hover:text-orange-400 transition-colors">Features</Link></li>
                  <li><Link href="#commands" className="hover:text-orange-400 transition-colors">Commands</Link></li>
                  <li><Link href="/servers" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
                  <li><a href="https://docs.luno.bot" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">SUPPORT</h4>
                <ul className="space-y-3 text-slate-400">
                  <li><a href="https://discord.gg/luno" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Discord Server</a></li>
                  <li><a href="https://docs.luno.bot/faq" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">FAQ</a></li>
                  <li><a href="https://docs.luno.bot/guides" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Guides</a></li>
                  <li><a href="mailto:support@luno.bot" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">LEGAL</h4>
                <ul className="space-y-3 text-slate-400">
                  <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/cookies" className="hover:text-orange-400 transition-colors">Cookie Policy</Link></li>
                  <li><Link href="/gdpr" className="hover:text-orange-400 transition-colors">GDPR Notice</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-400 text-sm">
                  © 2026 Luno Bot. All rights reserved.
                </p>
                <p className="text-slate-400 text-sm">
                  Made with <span className="text-orange-500">❤</span> for the Discord community
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
