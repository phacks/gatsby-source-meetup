const fetch = require("node-fetch")
const queryString = require("query-string")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    scalar Long
    type MeetupEventVenue {
      address_1: String
      address_2: String
      city: String!
      country: String!
      lat: Float!
      localized_country_name: String!
      lon: Float!
      name: String!
      repinned: Boolean!
      state: String
      zip: String
    }
    type MeetupEvent implements Node {
      id: ID!
      status: String!
      visibility: String
      created: Long
      description: String!
      name: String!
      venue: MeetupEventVenue
      time: Long!
      utc_offset: Int!
      updated: Long!
      rsvp_limit: Int
      member_pay_fee: Boolean!
      local_time: String!
      link: String!
      how_to_find_us: String
      duration: Int!
      date_in_series_pattern: Boolean!
    }
  `;
  createTypes(typeDefs);
};

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  // Processes a Meetup Group
  const processGroup = group => {
    const nodeId = createNodeId(`meetup-group-${group.id}`)

    const nodeData = Object.assign({}, group, {
      ...group,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `MeetupGroup`,
        contentDigest: createContentDigest(group),
      },
    })

    return nodeData
  }

  // Processes a Meetup Event as a child of a Meetup Group
  const processEvent = (event, parent) => {
    const nodeId = createNodeId(`meetup-event-${event.id}`)

    const nodeData = Object.assign({}, event, {
      ...event,
      id: nodeId,
      meetupId: event.id,
      parent,
      children: [],
      internal: {
        type: `MeetupEvent`,
        contentDigest: createContentDigest(event),
      },
    })

    return nodeData
  }

  const { groupUrlName, eventsOptions: paramEventsOptions, ...apiOptions } = configOptions
  const eventsOptions = paramEventsOptions?paramEventsOptions:[apiOptions];

  // Convert the options object into a query string
  const queryStringOptions = queryString.stringify(apiOptions)

  const apiGroupUrl = `https://api.meetup.com/${groupUrlName}?${queryStringOptions}`;

  const allApiEventsUrl = eventsOptions.map(eventApiOptions => {
    // Convert the options object into a query string
    const queryStringEventOptions = queryString.stringify(eventApiOptions)
    return `https://api.meetup.com/${groupUrlName}/events?${queryStringEventOptions}`;
  });

  const allApiUrls = [
    apiGroupUrl,
    ...allApiEventsUrl
  ];

  // Gatsby expects sourceNodes to return a promise
  return (
    // Fetch a response from the apiUrl
    Promise.all(allApiUrls.map(url => fetch(url))
      // Parse the response as JSON
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      // Process the JSON data into a node
      .then(dataArray => {
        const [groupData, ...eventsDataSeparated] = dataArray;
        const eventData = eventsDataSeparated.reduce((acc, events) => ([...acc, ...events]), []);
        // For each query result (or 'hit')
        let groupNode = processGroup(groupData)
        groupNode.events___NODE = Object.values(eventData).map(event => {
          const nodeData = processEvent(event, groupNode.id)
          createNode(nodeData)
          return nodeData.id
        })
        createNode(groupNode)
      })
  )
}

