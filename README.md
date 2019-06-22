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
        key: process.env.MEETUP_API_KEY,
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
        key: process.env.MEETUP_API_KEY,
        groupUrlName: "jamstack-paris",
        status: "past",
        desc: "true",
        page: 10
      },
    },
    {
      resolve: `gatsby-source-meetup`,
      options: {
        key: process.env.MEETUP_API_KEY,
        groupUrlName: "paris-js",
        status: "upcoming,past",
        desc: "true",
        page: 10
      },
    },
  ],
}
```

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
      }
      link
      description
      visibility
      description
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
