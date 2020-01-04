import fetch from 'node-fetch';
import {sourceNodes} from './gatsby-node';

jest.mock('node-fetch');

const createNode = jest.fn();
const createNodeId = jest.fn();
const createContentDigest = jest.fn();
const context = { 
  actions: {
    createNode,
  },
  createNodeId,
  createContentDigest
};
const groupData = {
  id: 'group-id-test'
};
const eventDataFromGroupConfig = {
  id: 'group-event-id-test'
};
const eventDataUpcoming = {
  id: 'upcoming-event-id-test'
};
const eventDataPast = {
  id: 'past-event-id-test'
};

const groupUrlName = 'group-test';

beforeEach(()=>{
  fetch.mockClear();
  createNodeId.mockClear();
  createContentDigest.mockClear();
  createNode.mockClear();
  fetch.mockImplementation(url => {
    if(url.startsWith(`https://api.meetup.com/${groupUrlName}?`)){
      return Promise.resolve({json:()=>Promise.resolve(groupData)});
    } else if(url === `https://api.meetup.com/${groupUrlName}/events?desc=true&page=10&status=upcoming%2Cpast`){
      return Promise.resolve({json:()=>Promise.resolve([ eventDataFromGroupConfig ])});
    } else if(url === `https://api.meetup.com/${groupUrlName}/events?desc=true&page=1&status=upcoming`){
      return Promise.resolve({json:()=>Promise.resolve([ eventDataUpcoming ])});
    } else if(url === `https://api.meetup.com/${groupUrlName}/events?desc=true&page=5&status=past`){
      return Promise.resolve({json:()=>Promise.resolve([ eventDataPast ])});
    }
    return Promise.resolve({json:()=>Promise.resolve({})});
  });
  createNodeId.mockImplementation((result)=>result);
  createContentDigest.mockImplementation(()=>'contentDigest return')
});
describe('sourceNodes', ()=>{
  it('simple call', async () => {
    const groupUrlName = 'group-test';
    const configOptionsToTest = {
      groupUrlName,
      status: `upcoming,past`,
      desc: `true`,
      page: 10,
    };
    const configOptions = {
      ...configOptionsToTest,
      plugins: 'it must be removed'
    }
    await sourceNodes(context, configOptions);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(createNodeId).toHaveBeenNthCalledWith(1, `meetup-group-group-id-test`)
    expect(createNodeId).toHaveBeenNthCalledWith(2, `meetup-event-group-event-id-test`)
    expect(createContentDigest).toHaveBeenCalledTimes(2);
    expect(createContentDigest).toHaveBeenNthCalledWith(1, groupData);
    expect(createContentDigest).toHaveBeenNthCalledWith(2, eventDataFromGroupConfig);
    expect(createNode).toBeCalledTimes(2);
    expect(createNode).toHaveBeenNthCalledWith(1, {
      id: 'meetup-event-group-event-id-test',
      meetupId: 'group-event-id-test',
      parent: 'meetup-group-group-id-test',
      children: [],
      internal: {
        type: `MeetupEvent`,
        contentDigest: 'contentDigest return',
      },
    });
    expect(createNode).toHaveBeenNthCalledWith(2, {
      id: 'meetup-group-group-id-test',
      parent: null,
      children: [],
      internal: {
        type: `MeetupGroup`,
        contentDigest: 'contentDigest return',
      },
      events___NODE: [ "meetup-event-group-event-id-test"],
    });
  });
  it('eventsOptions parameter not informed', async () => {
    const configOptionsToTest = {
      groupUrlName,
      status: `upcoming,past`,
      desc: `true`,
      page: 10,
    };
    const configOptions = {
      ...configOptionsToTest,
      plugins: 'it must be removed'
    }
    await sourceNodes(context, configOptions);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(createContentDigest).toHaveBeenCalledTimes(2);
    expect(createNode).toBeCalledTimes(2);
  });

  it('eventsOptions parameter with null value', async () => {
    const configOptionsToTest = {
      groupUrlName,
      status: `upcoming,past`,
      desc: `true`,
      page: 10,
      eventsOptions: null,
    };
    const configOptions = {
      ...configOptionsToTest,
      plugins: 'it must be removed'
    }
    await sourceNodes(context, configOptions);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(createContentDigest).toHaveBeenCalledTimes(2);
    expect(createNode).toBeCalledTimes(2);
  });

  it('eventsOptions parameter with empty array', async () => {
    const configOptionsToTest = {
      groupUrlName,
      status: `upcoming,past`,
      desc: `true`,
      page: 10,
      eventsOptions: [],
    };
    const configOptions = {
      ...configOptionsToTest,
      plugins: 'it must be removed'
    }
    await sourceNodes(context, configOptions);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(createContentDigest).toHaveBeenCalledTimes(1);
    expect(createNode).toBeCalledTimes(1);
  });

  it('eventsOptions parameter with one option', async () => {
    const configOptionsToTest = {
      groupUrlName,
      status: `upcoming,past`,
      desc: `true`,
      page: 10,
      eventsOptions: [{
        status: `upcoming`,
        desc: `false`,
        page: 1,
      }],
    };
    const configOptions = {
      ...configOptionsToTest,
      plugins: 'it must be removed'
    }
    await sourceNodes(context, configOptions);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(createNodeId).toHaveBeenNthCalledWith(2, `meetup-event-upcoming-event-id-test`)
    expect(createContentDigest).toHaveBeenCalledTimes(2);
    expect(createContentDigest).toHaveBeenNthCalledWith(2, eventDataUpcoming);
    expect(createNode).toBeCalledTimes(2);
    expect(createNode).toHaveBeenNthCalledWith(1, {
      id: 'meetup-event-upcoming-event-id-test',
      meetupId: 'upcoming-event-id-test',
      parent: 'meetup-group-group-id-test',
      children: [],
      internal: {
        type: `MeetupEvent`,
        contentDigest: 'contentDigest return',
      },
    });
  });

  it('eventsOptions parameter with two options', async () => {
    const configOptionsToTest = {
      groupUrlName,
      status: `upcoming,past`,
      desc: `true`,
      page: 10,
      eventsOptions: [
        {
          status: `upcoming`,
          desc: `false`,
          page: 1,
        },
        {
          status: `past`,
          desc: `true`,
          page: 5,
        }
      ],
    };
    const configOptions = {
      ...configOptionsToTest,
      plugins: 'it must be removed'
    }
    await sourceNodes(context, configOptions);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(createNodeId).toHaveBeenNthCalledWith(2, `meetup-event-upcoming-event-id-test`)
    expect(createNodeId).toHaveBeenNthCalledWith(3, `meetup-event-past-event-id-test`)
    expect(createContentDigest).toHaveBeenCalledTimes(3);
    expect(createContentDigest).toHaveBeenNthCalledWith(2, eventDataUpcoming);
    expect(createContentDigest).toHaveBeenNthCalledWith(3, eventDataPast);
    expect(createNode).toBeCalledTimes(3);
    expect(createNode).toHaveBeenNthCalledWith(1, {
      id: 'meetup-event-upcoming-event-id-test',
      meetupId: 'upcoming-event-id-test',
      parent: 'meetup-group-group-id-test',
      children: [],
      internal: {
        type: `MeetupEvent`,
        contentDigest: 'contentDigest return',
      },
    });
    expect(createNode).toHaveBeenNthCalledWith(2, {
      id: 'meetup-event-past-event-id-test',
      meetupId: 'past-event-id-test',
      parent: 'meetup-group-group-id-test',
      children: [],
      internal: {
        type: `MeetupEvent`,
        contentDigest: 'contentDigest return',
      },
    });
  });
})
