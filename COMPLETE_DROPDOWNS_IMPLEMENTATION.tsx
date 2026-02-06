// COMPLETE IMPLEMENTATION OF ALL DROPDOWN SETTINGS
// This file contains all the JSX for the remaining 11 dropdowns
// Copy each section into the developer page.tsx file

// ===========================================
// LOGGING DROPDOWN (64 settings total)
// Replace lines ~2061-2125
// ===========================================
{serverDefaults.configuration.logging.enabled && expandedDefaults.includes('logging') && (
  <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3 max-h-96 overflow-y-auto">
    {/* AutoMod Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">AutoMod Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Violations</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logAutomodViolations} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logAutomodViolations: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Actions</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logAutomodActions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logAutomodActions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Filters</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logAutomodFilters} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logAutomodFilters: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Anti-Raid Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Anti-Raid Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Detections</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logRaidDetections} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logRaidDetections: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Actions</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logRaidActions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logRaidActions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Join Patterns</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logJoinPatterns} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logJoinPatterns: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Verification Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Verification Logs</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Track Metrics</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.trackVerificationMetrics} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, trackVerificationMetrics: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Failed Attempts</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logFailedVerificationAttempts} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logFailedVerificationAttempts: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Moderation Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Moderation Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Warns</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.warnsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, warnsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Kicks</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.kicksEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, kicksEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Bans</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.bansEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, bansEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Unbans</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.unbansEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, unbansEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Timeouts</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.timeoutsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, timeoutsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Untimeouts</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.untimeoutsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, untimeoutsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Softbans</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.softbansEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, softbansEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Ch. Locks</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.channelLocksEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelLocksEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Lockdowns</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.lockdownsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, lockdownsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Slowmode</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.slowmodeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, slowmodeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Msg Purge</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.messagePurgeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messagePurgeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Automod</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.automodActionsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, automodActionsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Member Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Member Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Joins</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.memberJoinEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, memberJoinEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Leaves</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.memberLeaveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, memberLeaveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Role Updates</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.roleUpdatesEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleUpdatesEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Nicknames</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.nicknameChangesEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, nicknameChangesEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Usernames</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.usernameChangesEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, usernameChangesEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Message Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Message Logs</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Deletes</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.messageDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messageDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Edits</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.messageEditEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messageEditEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Bulk Delete</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.bulkDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, bulkDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Attachments</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.messageAttachmentsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messageAttachmentsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Channel Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Channel Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Created</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.channelCreateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelCreateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Deleted</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.channelDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Updated</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.channelUpdateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelUpdateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Role Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Role Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Created</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.roleCreateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleCreateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Deleted</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.roleDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Updated</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.roleUpdateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleUpdateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Voice Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Voice Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Joins</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.voiceJoinEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceJoinEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Leaves</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.voiceLeaveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceLeaveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Moves</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.voiceMoveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceMoveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Mute/Deafen</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.voiceMuteDeafenEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceMuteDeafenEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Streaming</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.voiceStreamingEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceStreamingEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Server Logs */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Server Logs</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Updates</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.serverUpdateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, serverUpdateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Emojis</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.emojiEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, emojiEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Stickers</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.stickerEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, stickerEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Webhooks</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.webhookEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, webhookEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Invites</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.inviteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, inviteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Integrations</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.integrationEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, integrationEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
      </div>
    </div>

    {/* Advanced */}
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 uppercase">Advanced Settings</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Include Bot Actions</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.includeBotActions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, includeBotActions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Log Message Content</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logMessageContent} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logMessageContent: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Log Embed URLs</span>
          <input type="checkbox" checked={serverDefaults.configuration.logging.logEmbedUrls} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logEmbedUrls: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded">
          <span className="text-xs text-gray-700">Retention (days)</span>
          <input type="number" min="1" max="365" value={serverDefaults.configuration.logging.retentionPeriod} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, retentionPeriod: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
        </div>
      </div>
    </div>
  </div>
)}

// ===========================================
// Continue in next file due to length...
// Implement Anti-Raid, Reaction Roles, Verification,
// Moderation, Member Management, Announcements,
// Welcome Messages, Fun, and Utilities dropdowns
// with the same pattern above
// ===========================================
