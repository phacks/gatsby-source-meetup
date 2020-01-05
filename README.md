# gatsby-source-meetup

Source plugin for pulling [Meetup.com](https://www.meetup.com/) data about a specific Group and the events associated to it.

## Install

`npm install --save gatsby-source-meetup`

## How to use

First, you need a way to pass environment variables to the build process, so secrets and other secured data aren't committed to source control. We recommend using [`dotenv`](https://github.com/motdotla/dotenv) which will then expose environment variables. [Read more about dotenv and using environment variables here](envvars). Then we can _use_ these environment variables and configure our plugin.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-meetup`,
      options: {
        // Learn about environment variables: https://gatsby.app/env-vars
        // Your Meetup.com API key can be retrieved here: https://secure.meetup.com/fr-FR/meetup_api/key/
        apiKey: process.env.MEETUP_API_KEY,
        // Mandatory: the URL name of a Meetup Group.
        // See the URL of the group page, e.g. https://www.meetup.com/fr-FR/jamstack-paris
        groupUrlName: "jamstack-paris",
        // Optional parameters for retrieving Events, see full documentation at
        // https://www.meetup.com/meetup_api/docs/:urlname/events/?uri=%2Fmeetup_api%2Fdocs%2F%3Aurlname%2Fevents%2F#list
        status: "upcoming,past",
        desc: "true",
        page: 10
      },
    },
  ],
}
```

### Querying multiple groups

To get data from multiple Groups, you can define the plugin multiple times:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-meetup`,
      options: {
        apiKey: process.env.MEETUP_API_KEY,
        groupUrlName: "jamstack-paris",
        status: "past",
        desc: "true",
        page: 10
      },
    },
    {
      resolve: `gatsby-source-meetup`,
      options: {
        apiKey: process.env.MEETUP_API_KEY,
        groupUrlName: "paris-js",
        status: "upcoming,past",
        desc: "true",
        page: 10
      },
    },
  ],
}
```

### Querying events with multiple options

To get data from the same Group with multiple options (sorting, number of events…) depending on their status, you can use the optional parameter `eventsOptions`:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-meetup`,
      options: {
        apiKey: process.env.MEETUP_API_KEY,
        groupUrlName: "jamstack-paris",
        status: "past",
        desc: "true",
        page: 10,
        eventsOptions: [
          {
            status: `upcoming`,
            desc: `true`,
            page: 1,
          },
          {
            status: `past`,
            desc: `true`,
            page: 5,
          }
        ],
      },
    },
  ],
}
```

With eventsOptions used above, you get the first next event from today and the last 5 events.

## How to query

You can query the Group node and associated Event nodes created from Meetup like the following:

```graphql
{
  meetupGroup {
    events {
      name
      created
      duration
      rsvp_limit
      status
      time
      local_date
      local_time
      rsvp_open_offset
      rsvp_close_offset
      updated
      utc_offset
      waitlist_count
      yes_rsvp_count
      venue {
        name
        lat
        lon
        repinned
        address_1
        city
        country
        localized_country_name
        zip
        state
        phone
        id
        address_2
        address_3
      }
      link
      description
      visibility
      manual_attendance_count
      meetupId
      member_pay_fee
      past_event_count_inclusive
      plain_text_description
      plain_text_no_images_description
      rsvpable
      rsvpable_after_join
      saved
      short_link
      simple_html_description
      venue_visibility
      web_actions
      why
      id
      how_to_find_us
      featured
      description_images
      date_in_series_pattern
      comment_count
      attendance_count
      attendance_sample {
        bio
        event_context
        id
        name
        photo
        role
        self
        title
      }
      attendee_sample {
        created
        id
        member {
          bio
          event_context
          title
          self
          role
          photo
          name
          id
        }
        updated
      }
      event_hosts {
        host_count
        id
        intro
        join_date
        name
        photo {
          base_url
          highres_link
          type
          thumb_link
          photo_link
          id
        }
      }
      featured_photo {
        base_url
        id
        highres_link
        photo_link
        thumb_link
        type
      }
      fee {
        accepts
        amount
        currency
        description
        label
        required
      }
      fee_options {
        currencies {
          default
          code
        }
        is_setup
        setup_link
        type
      }
      group {
        country
        created
        id
        join_mode
        lat
        localized_location
        lon
        name
        region
        shortname
        sort_name
        state
        timezone
        urlname
        who
      }
      internal {
        content
        contentDigest
        description
        fieldOwners
        ignoreType
        mediaType
        owner
        type
      }
      photo_album {
        id
        photo_count
        title
        photo_sample {
          base_url
          highres_link
          id
          photo_link
          thumb_link
          type
        }
        event {
          id
          name
          no_rsvp_count
          time
          utc_offset
          waitlist_count
          yes_rsvp_count
        }
      }
      rsvp_rules {
        close_time
        closed
        guest_limit
        open_time
        refund_policy {
          days
          notes
          policies
        }
        waitlisting
      }
      rsvp_sample {
        created
        id
        member {
          bio
          event_context
          id
          title
          role
          self
          photo
          name
        }
        updated
      }
      self {
        actions
        role
        rsvp {
          answers
          guests
          response
        }
        pay_status
      }
      series {
        weekly {
          interval
          day_of_week
        }
        template_event_id
        start_date
        monthly {
          week_of_month
          interval
          day_of_week
        }
        id
        end_date
        description
      }
      survey_questions {
        question
        id
      }
    }
    name
    status
    link
    urlname
    description
    created
    city
    untranslated_city
    country
    localized_country_name
    localized_location
    state
    join_mode
    visibility
    lat
    lon
    members
    organizer {
      name
      bio
      photo {
        highres_link
        photo_link
        thumb_link
      }
    }
    who
    group_photo {
      highres_link
      photo_link
      thumb_link
    }
    key_photo {
      highres_link
      photo_link
      thumb_link
    }
    timezone
    next_event {
      name
      yes_rsvp_count
      time
      utc_offset
    }
    category {
      name
      shortname
    }
    meta_category {
      name
      shortname
    }
  }
}
```

Full API documentation can be found [here](https://www.meetup.com/fr-FR/meetup_api/docs/:urlname/?uri=%2Fmeetup_api%2Fdocs%2F%3Aurlname%2F#get) for Groups, and [here](https://www.meetup.com/fr-FR/meetup_api/docs/:urlname/events/?uri=%2Fmeetup_api%2Fdocs%2F%3Aurlname%2Fevents%2F#list) for Events.
