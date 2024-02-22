import { Local } from './storage';
import { getResourceWithoutCache } from './resources';
import { isDefined } from './helpers';

/**
 * - Wait for the bot ID and the API server then create default API based on the server ;
 * - Use BOT from local storage for the chatbox preview in Channels ;
 * - Protocol http is used when bliss is used in local with Channels.
 */

interface BotConfig {
  id: string;
  servers: string[];
  configId: string;
  getServer: (index: number) => string | null;
  getNextServer: (index: number, previousIndexUsed?: number) => string | null;
}

const isChannels = Local.isChannels.load();

export let BOT: BotConfig = {
  id: '',
  servers: [],
  configId: '',
  getServer: () => {
    return null;
  },
  getNextServer: () => {
    return null;
  },
};

export const getNextServerFromList = (servers: string[] | undefined, index: number, previousIndexUsed?: number) => {
  if (servers) {
    if (servers.length === 1) {
      return null;
    } else {
      let currentIndex: number = index;
      if (previousIndexUsed != undefined && previousIndexUsed !== index) {
        currentIndex = previousIndexUsed;
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= servers.length) {
        return servers[0];
      }

      return servers[nextIndex];
    }
  }

  return null;
};

export const initBotInfoFromJsonOrChannels = async () => {
  const { data } = await getResourceWithoutCache('override/bot.json');

  let botData = {
    ...data,
    ...(isChannels && {
      id: Local.botId.load(),
      servers: Local.servers.load(),
    }),
  };

  const getServer = (index: number): string | null => {
    const servers: string[] = botData?.servers;
    return servers?.length > index && index >= 0 ? servers[index] : null;
  };

  const getNextServer = (index: number, previousIndexUsed?: number): string | null => {
    return getNextServerFromList(botData?.servers, index, previousIndexUsed);
  };

  botData = {
    ...botData,
    getServer: getServer,
    getNextServer: getNextServer,
  };

  BOT = Object.assign({}, botData);
  Local.botId.save(botData.id);
};
