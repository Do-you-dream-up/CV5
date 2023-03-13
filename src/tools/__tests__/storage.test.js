import { Local } from '../storage';

beforeEach(() => {
  localStorage.clear();
});

describe('Local storage by bot id', () => {
  it('Should populate if no botsById store is present', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    Local.byBotId('xxx').get(Local.names.context);
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeDefined();
    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
    expect(botsById).toBeInstanceOf(Object);
  });
  it('Given a botId, it should populate the store if no bot associated to the id is found', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    Local.byBotId('xxx').get(Local.names.context);
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeDefined();
    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
    expect(botsById).toHaveProperty('xxx');
    expect(botsById['xxx']).toHaveProperty('id', 'xxx');
    expect(botsById['xxx'][Local.names.context]).toBe('');
  });
  it('Given a botId and a key, it should retrieve associated key associated to the bot', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    localStorage.setItem(
      Local._BOTS_BY_ID_KEY,
      JSON.stringify({
        xxx: {
          id: 'xxx',
          [Local.names.context]: 'unbelievable',
          extraKey: 'extraValue',
        },
      }),
    );
    const context = Local.byBotId('xxx').get(Local.names.context);
    expect(context).toBe('unbelievable');
    const extra = Local.byBotId('xxx').get('extraKey');
    expect(extra).toBe('extraValue');
  });
  it('Given a botId, a key and a value, it should set the given key to the given value into the given bot & do not touch to others bots', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    localStorage.setItem(
      Local._BOTS_BY_ID_KEY,
      JSON.stringify({
        xxx: {
          id: 'xxx',
          [Local.names.context]: 'unbelievable',
          extraKey: 'extraValue',
        },
        yyy: {
          id: 'yyy',
        },
      }),
    );
    Local.byBotId('xxx').set(Local.names.context, 'new ctx');
    Local.byBotId('xxx').set('extraKey', 'new extra value');
    Local.byBotId('xxx').set('not initial', 'new upsert');
    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
    const currentBot = botsById['xxx'];
    expect(currentBot[Local.names.context]).toBe('new ctx');
    expect(currentBot).toHaveProperty('extraKey', 'new extra value');
    expect(currentBot).toHaveProperty('not initial', 'new upsert');

    const otherBot = botsById['yyy'];
    expect(otherBot).toHaveProperty('id', 'yyy');
  });
});
