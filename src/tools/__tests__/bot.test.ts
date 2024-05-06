import { getNextServerFromList } from '../bot';

const servers = ['server1', 'server2', 'server3'];

describe('getNextServerFromList', () => {
  test('getNextServerFromList from index 0', () => {
    const server = getNextServerFromList(servers, 0);
    expect(server).toBe('server2');
  });

  test('getNextServerFromList from index 1', () => {
    const server = getNextServerFromList(servers, 1);
    expect(server).toBe('server3');
  });

  test('getNextServerFromList from index 2', () => {
    const server = getNextServerFromList(servers, 2);
    expect(server).toBe('server1');
  });

  test('getNextServerFromList from index out of bounds', () => {
    const server = getNextServerFromList(servers, 3);
    expect(server).toBe('server1');
  });

  test('getNextServerFromList from same index and previousIndexUsed', () => {
    const server = getNextServerFromList(servers, 0, 0);
    expect(server).toBe('server2');
  });

  test('getNextServerFromList from index 1 and previousIndexUsed 0', () => {
    const server = getNextServerFromList(servers, 1, 0);
    expect(server).toBe('server2');
  });

  test('getNextServerFromList from useless index and previousIndexUsed 0', () => {
    const server = getNextServerFromList(servers, 2, 0);
    expect(server).toBe('server2');
  });

  test('getNextServerFromList from useless index and previousIndexUsed 1', () => {
    const server = getNextServerFromList(servers, 2, 1);
    expect(server).toBe('server3');
  });

  test('getNextServerFromList from useless index and previousIndexUsed 2', () => {
    const server = getNextServerFromList(servers, 2, 2);
    expect(server).toBe('server1');
  });

  test('getNextServerFromList from useless index and previousIndexUsed out of bound', () => {
    const server = getNextServerFromList(servers, 2, 3);
    expect(server).toBe('server1');
  });
});
