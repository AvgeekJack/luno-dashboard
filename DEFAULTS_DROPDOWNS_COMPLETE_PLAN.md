# Complete Defaults Dropdowns Implementation Plan

## Current Status vs Required

### Configuration Pages

#### 1. Automod (INCOMPLETE - 5/29 settings)
**Currently Has:**
- ✓ filterSpam
- ✓ filterLinks
- ✓ filterMentions
- ✓ filterCaps
- ✓ maxWarnings

**MISSING (24 settings):**
- antiLinkEnabled
- antiInviteEnabled
- antiSpamEnabled (different from filterSpam)
- antiMentionEnabled (different from filterMentions)
- antiFloodEnabled
- antiZalgoEnabled
- antiSwearEnabled
- capsFilterEnabled (different from filterCaps)
- spamMessageCount
- spamTimeWindow
- mentionLimit
- capsPercentage
- floodMessageCount
- floodTimeWindow
- zalgoLimit
- warningDuration
- autoTimeoutEnabled
- autoTimeoutViolations
- autoTimeoutWindow
- autoTimeoutDuration
- deleteMessage
- sendWarning
- dmUser
- autoWhitelistModerators
- escalatingPunishments

#### 2. Logging (INCOMPLETE - 4/64 settings)
**Currently Has:**
- ✓ logModeration
- ✓ logMessages
- ✓ logJoinsLeaves
- ✓ logVoice

**MISSING (60 settings):**
AutoMod Logs:
- logAutomodViolations
- logAutomodActions
- logAutomodFilters

Anti-Raid Logs:
- logRaidDetections
- logRaidActions
- logJoinPatterns

Verification Logs:
- trackVerificationMetrics
- logFailedVerificationAttempts

Moderation Logs (12):
- warnsEnabled, kicksEnabled, bansEnabled, unbansEnabled
- timeoutsEnabled, untimeoutsEnabled, softbansEnabled
- channelLocksEnabled, lockdownsEnabled, slowmodeEnabled
- messagePurgeEnabled, automodActionsEnabled

Member Logs (5):
- memberJoinEnabled, memberLeaveEnabled
- roleUpdatesEnabled, nicknameChangesEnabled, usernameChangesEnabled

Message Logs (4):
- messageDeleteEnabled, messageEditEnabled
- bulkDeleteEnabled, messageAttachmentsEnabled

Channel Logs (3):
- channelCreateEnabled, channelDeleteEnabled, channelUpdateEnabled

Role Logs (3):
- roleCreateEnabled, roleDeleteEnabled, roleUpdateEnabled

Voice Logs (5):
- voiceJoinEnabled, voiceLeaveEnabled, voiceMoveEnabled
- voiceMuteDeafenEnabled, voiceStreamingEnabled

Server Logs (6):
- serverUpdateEnabled, emojiEnabled, stickerEnabled
- webhookEnabled, inviteEnabled, integrationEnabled

Advanced (3):
- includeBotActions
- logMessageContent
- logEmbedUrls
- retentionPeriod

#### 3. Anti-Raid (INCOMPLETE - 3/8 settings)
**Currently Has:**
- ✓ verificationLevel
- ✓ joinRateLimit
- ✓ accountAgeMinimum

**MISSING (5 settings):**
- protectionLevel (low/medium/high/extreme/custom dropdown)
- accountAge (in milliseconds, not days)
- joinRateWindow
- autoKickNewAccounts
- kickOnRateExceeded

#### 4. Reaction Roles (INCOMPLETE - 2/7 settings)
**Currently Has:**
- ✓ maxRolesPerUser
- ✓ removeOnReactionRemove

**MISSING (5 settings):**
- roleLimit
- allowRoleStacking
- autoDeleteReactions
- dmOnRoleChange
- rolePersistence
- reactionCooldown

#### 5. Verification (INCOMPLETE - 3/10 settings)
**Currently Has:**
- ✓ requireCaptcha
- ✓ requireRules
- ✓ verificationTimeout

**MISSING (7 settings):**
- verificationMethod (reaction/button/captcha/manual dropdown)
- accountAgeRequirement (in days)
- requireServerAgreement
- multipleSteps
- welcomeDM
- removeVerificationMessages
- antiAltProtection
- kickUnverifiedAfter
- verificationCooldown

### Module Pages

#### 6. Moderation (INCOMPLETE - 5/13 settings)
**Currently Has:**
- ✓ allowBan
- ✓ allowKick
- ✓ allowWarn
- ✓ allowMute
- ✓ allowTimeout

**MISSING (8 command toggles):**
- banEnabled (should be this not allowBan)
- softbanEnabled
- unbanEnabled
- timeoutEnabled (duplicate name)
- untimeoutEnabled
- clearEnabled
- slowmodeEnabled
- lockEnabled
- unlockEnabled
- lockdownEnabled
- unlockdownEnabled

#### 7. Role Management (COMPLETE ✓)
Has all 3 settings

#### 8. Member Management (INCOMPLETE - 3/5 settings)
**Currently Has:**
- ✓ showAvatars
- ✓ showNicknames
- ✓ showJoinDate

**MISSING (2 command toggles):**
- userinfoEnabled
- useravatarEnabled
- userbannerEnabled
- rolemembersEnabled
- pruneusersEnabled

#### 9. Announcements (INCOMPLETE - 2/4 settings)
**Currently Has:**
- ✓ allowPings
- ✓ allowEmbeds

**MISSING (2 command toggles):**
- announceEnabled
- giveawayCreateEnabled
- giveawayDrawEnabled
- pollEnabled

#### 10. Welcome Messages (INCOMPLETE - 3/10 settings)
**Currently Has:**
- ✓ sendDM
- ✓ sendInChannel
- ✓ includeRules

**MISSING (7 settings):**
- welcomeEnabled
- welcomeMessage
- welcomeTitle
- welcomeDescription
- welcomeColor
- leaveEnabled
- leaveMessage
- leaveTitle
- leaveDescription
- leaveColor

#### 11. Fun (INCOMPLETE - 3/7 settings)
**Currently Has:**
- ✓ allowGames
- ✓ allowMemes
- ✓ allowGifs

**MISSING (4 command toggles):**
- memeEnabled
- eightballEnabled
- coinflipEnabled
- diceEnabled
- jokeEnabled
- rpsEnabled
- rateEnabled

#### 12. Utilities (INCOMPLETE - 3/9 settings)
**Currently Has:**
- ✓ allowReminders
- ✓ allowPolls
- ✓ allowCalculator

**MISSING (6 command toggles):**
- serverinfoEnabled
- channelinfoEnabled
- roleinfoEnabled
- emojiinfoEnabled
- pingEnabled
- inviteEnabled
- helpEnabled
- supportEnabled
- dashboardEnabled

## Implementation Priority

### HIGH PRIORITY (Most Complex):
1. **Automod** - 29 settings with mix of toggles and numbers
2. **Logging** - 64 settings, mostly toggles organized in categories
3. **Welcome Messages** - 10 settings with text inputs and colors

### MEDIUM PRIORITY:
4. **Verification** - 10 settings with dropdown selector
5. **Moderation** - 13 command toggles
6. **Anti-Raid** - 8 settings with protection level preset

### LOW PRIORITY (Simpler):
7-12. Other modules with <10 settings each

## UI Organization Strategy

For pages with many settings (like Logging with 64), organize into collapsible subsections:
- **Logging** → "AutoMod Logs", "Moderation Logs", "Member Logs", etc.
- **Automod** → "Filters", "Thresholds", "Actions", "Timeouts"

## Next Steps

1. Update state structure ✓ (DONE)
2. Rebuild automod dropdown with all 29 settings
3. Rebuild logging dropdown with all 64 settings in organized sections
4. Update remaining 10 dropdowns
5. Test all functionality
6. Ensure save/load handles all new fields
