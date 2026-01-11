'use client';

import { Button } from '@/components/ui/button';

interface CommandHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  commandName: string;
  description: string;
}

const COMMAND_INFO: Record<string, { usage: string; description: string; permissions: string }> = {
  '/ban': { usage: '/ban {USER} {REASON}', description: 'Permanently ban a user from the server', permissions: 'Ban Members' },
  '/softban': { usage: '/softban {USER} {REASON}', description: 'Ban and immediately unban a user to delete their messages', permissions: 'Ban Members' },
  '/unban': { usage: '/unban {USER_ID}', description: 'Remove a ban from a previously banned user', permissions: 'Ban Members' },
  '/kick': { usage: '/kick {USER} {REASON}', description: 'Remove a user from the server', permissions: 'Kick Members' },
  '/timeout': { usage: '/timeout {USER} {DURATION} {REASON}', description: 'Timeout a user for a specified duration', permissions: 'Moderate Members' },
  '/untimeout': { usage: '/untimeout {USER}', description: 'Remove timeout from a user', permissions: 'Moderate Members' },
  '/warn': { usage: '/warn {USER} {REASON}', description: 'Issue a warning to a user', permissions: 'Moderate Members' },
  '/clear': { usage: '/clear {AMOUNT}', description: 'Delete a specified number of messages from the channel', permissions: 'Manage Messages' },
  '/slowmode': { usage: '/slowmode {SECONDS}', description: 'Set a slowmode delay for the channel', permissions: 'Manage Channels' },
  '/lock': { usage: '/lock', description: 'Lock the current channel to prevent members from sending messages', permissions: 'Manage Channels' },
  '/unlock': { usage: '/unlock', description: 'Unlock a locked channel', permissions: 'Manage Channels' },
  '/meme': { usage: '/meme', description: 'Get a random meme from popular subreddits', permissions: 'None' },
  '/8ball': { usage: '/8ball {QUESTION}', description: 'Ask the magic 8ball a question', permissions: 'None' },
  '/coinflip': { usage: '/coinflip', description: 'Flip a coin and get heads or tails', permissions: 'None' },
  '/dice': { usage: '/dice', description: 'Roll a 6-sided dice', permissions: 'None' },
  '/joke': { usage: '/joke', description: 'Get a random joke', permissions: 'None' },
  '/rps': { usage: '/rps {CHOICE}', description: 'Play rock paper scissors with the bot', permissions: 'None' },
  '/rate': { usage: '/rate {THING}', description: 'Rate something on a scale of 1-10', permissions: 'None' },
  '/serverinfo': { usage: '/serverinfo', description: 'Display detailed information about the server', permissions: 'None' },
  '/channelinfo': { usage: '/channelinfo {CHANNEL}', description: 'Display information about a specific channel', permissions: 'None' },
  '/roleinfo': { usage: '/roleinfo {ROLE}', description: 'Display information about a specific role', permissions: 'None' },
  '/emoji list': { usage: '/emoji list', description: 'List all custom emojis in the server', permissions: 'None' },
  '/ping': { usage: '/ping', description: 'Check the bot\'s latency and response time', permissions: 'None' },
  '/invite': { usage: '/invite', description: 'Get the invite link to add the bot to another server', permissions: 'None' },
  '/help': { usage: '/help', description: 'Display the help menu with all available commands', permissions: 'None' },
  '/support': { usage: '/support', description: 'Get the link to the bot\'s support server', permissions: 'None' },
  '/dashboard': { usage: '/dashboard', description: 'Get the link to the bot\'s web dashboard', permissions: 'None' },
  '/ignored channels': { usage: '/ignored channels', description: 'List all channels where the bot is ignored', permissions: 'Manage Server' },
  '/ignored roles': { usage: '/ignored roles', description: 'List all roles that are ignored by the bot', permissions: 'Manage Server' },
  '/role create': { usage: '/role create {NAME} {COLOR} {HOISTED} {MENTIONABLE}', description: 'Create a new role in the server', permissions: 'Manage Roles' },
  '/role remove': { usage: '/role remove {ROLE}', description: 'Delete an existing role from the server', permissions: 'Manage Roles' },
  '/role list': { usage: '/role list', description: 'List all roles in the server', permissions: 'None' },
  '/user info': { usage: '/user info {USER}', description: 'Display detailed information about a user', permissions: 'None' },
  '/user avatar': { usage: '/user avatar {USER}', description: 'Display a user\'s avatar in full size', permissions: 'None' },
  '/user banner': { usage: '/user banner {USER}', description: 'Display a user\'s profile banner', permissions: 'None' },
  '/user roles': { usage: '/user roles {USER}', description: 'List all roles assigned to a user', permissions: 'None' },
  '/prune users': { usage: '/prune users {DAYS}', description: 'Remove inactive members who haven\'t been active for specified days', permissions: 'Kick Members' },
  '/announce': { usage: '/announce {CHANNEL} {MESSAGE}', description: 'Send an announcement to a specified channel', permissions: 'Manage Server' },
  '/giveaway create': { usage: '/giveaway create {PRIZE} {DURATION} {WINNERS}', description: 'Create a new giveaway', permissions: 'Manage Server' },
  '/giveawaydraw': { usage: '/giveawaydraw {GIVEAWAY_ID}', description: 'Manually draw winners for a giveaway', permissions: 'Manage Server' },
  '/poll': { usage: '/poll {QUESTION} {OPTIONS}', description: 'Create a poll for members to vote on', permissions: 'Manage Server' },
  '/schedule message': { usage: '/schedule message {CHANNEL} {TIME} {MESSAGE}', description: 'Schedule a message to be sent at a specific time', permissions: 'Manage Server' },
  '/analytics server': { usage: '/analytics server', description: 'View detailed analytics about your server', permissions: 'Manage Server' },
  '/analytics growth': { usage: '/analytics growth', description: 'View growth statistics for your server', permissions: 'Manage Server' },
};

export function CommandHelpModal({
  isOpen,
  onClose,
  commandName,
  description,
}: CommandHelpModalProps) {
  if (!isOpen) return null;

  const commandInfo = COMMAND_INFO[commandName] || {
    usage: commandName,
    description: description,
    permissions: 'Not specified',
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Command Help: {commandName}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-100 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Usage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage</h3>
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
                {commandInfo.usage}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700">{commandInfo.description}</p>
            </div>

            {/* Default Permissions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Default Permissions</h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 border border-orange-200">
                  {commandInfo.permissions}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Users with these permissions can use this command by default
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
            <Button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
