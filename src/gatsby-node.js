const fetch = require("node-fetch")
const queryString = require("query-string")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    scalar Long
    type MeetupPhoto {
      base_url: String
      highres_link: String
      id: Int
      photo_link: String
      thumb_link: String
      type: String
    }


    type MeetupEventHost {
      host_count: Int
      id: ID!
      intro: String
      join_date: Long
      name: String
      photo: MeetupPhoto
    }
    type MeetupEventFee {
      accepts: String
      amount: Float
      currency: String
      description: String
      label: String
      required: Boolean
    }
    type MeetupEventFeeOptionCurrency {
      code: String
      default: Boolean!
    }
    type MeetupEventFeeOption {
      currencies: [MeetupEventFeeOptionCurrency]
      is_setup: Boolean
      setup_link: String
      type: String
    }
    type MeetupEventGroupCategory {
      id: Int
      name: String
      shortname: String
      sort_name: String
    }
    type MeetupEventGroupJoinInfo {
      photo_req: Boolean
      questions: [String]
      questions_req: Boolean
    }
    type MeetupEventGroupMembershipDues {
      currency: String
      fee: Float
      fee_desc: String
      methods: String
      reasons: [String]
      reasons_other: String
      refund_policy: String
      required: Boolean
      required_to: String
      self_payment_required: Boolean
      trial_days: Int
    }
    type MeetupEventGroupMetaCategory {
      best_topics: String
      category_ids: [Int]
      id: Int
      name: String
      photo: String
      shortname: String
      sort_name: String
    }
    type MeetupEventGroupPhotoGradient {
      composite_color: String
      dark_color: String
      id: ID!
      light_color: String
    }
    type MeetupEventGroupSelf {
      actions: [String]
      membership_dues: String
      profile: String
      status: String
    }
    type MeetupEventGroupTopic {
      id: Int
      lang: String
      name: String
      urlkey: String
    }
    type MeetupEventGroup {
      category: MeetupEventGroupCategory
      country: String
      id: Int
      join_info: MeetupEventGroupJoinInfo
      join_mode: String
      key_photo: MeetupPhoto
      lat: Float
      localized_country_name: String
      lon: Float
      membership_dues: MeetupEventGroupMembershipDues
      meta_category: MeetupEventGroupMetaCategory
      name: String
      past_event_count: Int
      photo: MeetupPhoto
      photo_gradient: MeetupEventGroupPhotoGradient
      pro_network: String
      region: String
      self: MeetupEventGroupSelf
      state: String
      timezone: String
      topics: [MeetupEventGroupTopic]
      urlname: String
      visibility: String
      who: String
    }
    type MeetupEventPhotoAlbumEvent {
      id: String
      name: String
      no_rsvp_count: Int
      time: Long
      utc_offset: Long
      waitlist_count: Int
      yes_rsvp_count: Int
    }
    type MeetupEventPhotoAlbum {
      event: MeetupEventPhotoAlbumEvent
      id: ID!
      photo_count: Int
      photo_sample: MeetupPhoto
      title: String
    }
    type MeetupEventRsvpRulesRefundPolicy {
      days: Int
      notes: String
      policies: [String]
    }
    type MeetupEventRsvpRules {
      close_time: Long
      closed: Boolean
      guest_limit: Int
      open_time: Long
      refund_policy: MeetupEventRsvpRulesRefundPolicy
      waitlisting: String
    }
    type MeetupEventRsvpSampleMember {
      bio: String
      event_context: String
      id: ID!
      name: String
      photo: String
      role: String
      self: String
      title: String
    }
    type MeetupEventRsvpSample {
      created: Long
      id: ID!
      member: MeetupEventRsvpSampleMember
      updated: Long
    }
    type MeetupEventSelfRsvp {
      answers: [String]
      guests: Int
      response: String
    }
    type MeetupEventSelf {
      actions: [String]
      pay_status: String
      role: String
      rsvp: MeetupEventSelfRsvp
    }
    type MeetupEventMonthly {
      day_of_week: Int
      interval: Int
      week_of_month: Int
    }
    type MeetupEventWeekly {
      day_of_week: Int
      interval: Int
    }
    type MeetupEventSeries {
      description: String
      end_date: Long
      id: ID!
      monthly: MeetupEventMonthly
      start_date: Long
      template_event_id: ID
      weekly: MeetupEventWeekly
    }
    type MeetupEventSurveyQuestion {
      id: Int
      question: String
    }
    type MeetupEventVenue {
      address_1: String
      address_2: String
      address_3: String
      city: String!
      country: String!
      id: ID!
      lat: Float!
      localized_country_name: String!
      lon: Float!
      name: String!
      phone: String
      repinned: Boolean!
      state: String
      zip: String
    }
    type MeetupEvent implements Node {
      member_pay_fee: Boolean!
      
      attendance_count: Int
      attendance_sample: MeetupEventRsvpSampleMember
      attendee_sample: MeetupEventRsvpSample
      comment_count: Int
      created: Long
      date_in_series_pattern: Boolean!
      description: String!
      description_images: [String]
      duration: Int!
      event_hosts: [MeetupEventHost]
      featured: Boolean
      featured_photo: MeetupPhoto
      fee: MeetupEventFee
      fee_options: [MeetupEventFeeOption]
      group: MeetupEventGroupCategory
      how_to_find_us: String
      id: ID!
      link: String!
      local_date: String
      local_time: String!
      manual_attendance_count: Int
      name: String!
      past_event_count_inclusive: Int
      photo_album: MeetupEventPhotoAlbum
      plain_text_description: String
      plain_text_no_images_description: String
      rsvp_close_offset: String
      rsvp_limit: Int
      rsvp_open_offset: String
      rsvp_rules: MeetupEventRsvpRules
      rsvp_sample: MeetupEventRsvpSample
      rsvpable: Boolean
      rsvpable_after_join: Boolean
      saved: Boolean
      self: MeetupEventSelf
      series: MeetupEventSeries
      short_link: String
      simple_html_description: String
      status: String!
      survey_questions: [MeetupEventSurveyQuestion]
      time: Long!
      updated: Long
      utc_offset: Int!
      venue: MeetupEventVenue
      venue_visibility: String
      visibility: String
      waitlist_count: Int
      web_actions: String
      why: String
      yes_rsvp_count: Int
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
    Promise.all(allApiUrls.map(url => fetch(url)))
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

