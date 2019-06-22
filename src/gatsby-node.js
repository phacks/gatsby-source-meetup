const fetch = require("node-fetch")
const queryString = require("query-string")

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  // Processes a Meetup Group
  const processGroup = (group) => {
    const nodeId = createNodeId(`meetup-group-${group.id}`);
    const nodeContent = JSON.stringify(group)

    const nodeData = Object.assign({}, group, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `MeetupGroup`,
        content: nodeContent,
        contentDigest: createContentDigest(group),
      },
    })

    return nodeData
  }

  // Processes a Meetup Event as a child of a Meetup Group
  const processEvent = (event, parent) => {
    const nodeId = createNodeId(`meetup-event-${event.id}`);
    const nodeContent = JSON.stringify(event)

    const nodeData = Object.assign({}, event, {
      id: nodeId,
      parent,
      children: [],
      internal: {
        type: `MeetupEvent`,
        content: nodeContent,
        contentDigest: createContentDigest(event),
      },
    })

    return nodeData
  }

  const { groupUrlName, ...apiOptions } = configOptions
  // Convert the options object into a query string
  const queryStringOptions = queryString.stringify(apiOptions)

  const apiGroupUrl = `https://api.meetup.com/${groupUrlName}?${queryStringOptions}`
  const apiEventsUrl = `https://api.meetup.com/${groupUrlName}/events?${queryStringOptions}`

  // Gatsby expects sourceNodes to return a promise
  return (
    // Fetch a response from the apiUrl
    Promise.all([fetch(apiGroupUrl), fetch(apiEventsUrl)])
      // Parse the response as JSON
      .then(responses => Promise.all(responses.map((response) => response.json())))
      // Process the JSON data into a node
      .then(dataArray => {
        const groupData = dataArray[0]
        const eventData = dataArray[1]
        // For each query result (or 'hit')
        let groupNode = processGroup(groupData)
        Object.values(eventData).forEach(event => {
          const nodeData = processEvent(event, groupNode.id)
          groupNode.children.push(nodeData.id)
          createNode(nodeData)
        })
        createNode(groupNode)
      })
  )
}