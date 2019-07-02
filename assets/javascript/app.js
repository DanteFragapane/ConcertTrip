const spotify = 'https://api.spotify.com/v1/search?'
const ticketMaster = 'https://app.ticketmaster.com/discovery/v2/'

const clientId = '4fd7a3464d9a42b3b839a4db644067c4'
const clientSecret = 'de44091eeac14f2290afee5f5156b863'
const apiTicketMaster = 'bSk42f1PrtXtUVQRKN5XSkQSwh8FtCTu'
let accessToken = ''

const returnBasic = function (id, secret) {
  return 'Basic ' + window.btoa(id + ':' + secret)
}

// Initiate the searches for the artist and venues
const searchArtist = function searchArtist(artistName) {
  const spotifyFull = spotify + $.param({
    q: artistName,
    type: 'artist'
  })
  const ticketMasterSearch = ticketMaster + '/events.json?' + $.param({
    apikey: apiTicketMaster,
    keyword: artistName
  })

  // Do the client authentication process
  $.ajax({
    'async': true,
    'crossDomain': true,
    'url': 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token?grant_type=client_credentials',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': returnBasic(clientId, clientSecret)
    }
  }).then(function (response) {
    accessToken = response.access_token

    // Do the search for artist info
    $.ajax({
      url: spotifyFull,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {
      if (response.artists.items.length === 0) {
        $('#results').html('')
        $('#results').append($('<h1>', {
          text: `No results found for the artist '${artistName}'`
        }))
        return false
      }
      const artist = response.artists.items[0]

      // Do the search for venues on SongKick
      $.ajax({
        url: ticketMasterSearch,
        method: 'GET'
      }).then((response) => {
        createResults(response, artist)
      }).catch((err) => {
        console.error(err)
      })
    }).catch((err) => {
      console.error(err)
    })
  }).catch((err) => {
    console.error(err)
  })
}

// Create and show the results of ``events`` and ``artists``
const createResults = function createResults(events, artist) {
  $('#results').html('')
  let $div = $('<div>')
  const $marketing = $('.marketing')
  $marketing.append($('<h1>', {
    text: artist.name,
    class: 'push'
  }))

  $marketing.append($('<img>', {
    class: 'col rounded',
    src: artist.images[0].url,
    alt: `Image of ${artist.name}`
  }))
  if (artist.genres.length > 0) {
    $marketing.append($('<h4>', {
      text: `Genres: ${artist.genres.join(', ')}`,
      class: 'push'
    }))
  } else {
    $marketing.append($('<h4>', {
      text: `No genres found`,
      class: 'push '
    }))
  }
  $('#results').append($div)

  if (events._embedded !== undefined) {
    const eventList = events._embedded.events
    createTable(eventList)
  } else {
    $('#events').html('')
    $('#results').append($('<h4>', {
      text: 'No events found.'
    }))
  }
}

// Generates the table
// date, venue name, contact (link)
const createTable = function createTable(venueList) {
  venueList.sort(function (a, b) {
    return new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate)
  })
  $('#events').html('')
  const $table = $('<table>', {
    class: 'table table-hover rounded col-xs col-12',
    id: 'table'
  })

  // ==================================
  // Create the table header
  const $thead = $('<thead>')
  let $tr = $('<tr>')
  $tr.append($('<th>', {
    scope: 'col',
    text: 'Date'
  }))
  $tr.append($('<th>', {
    scope: 'col',
    text: 'Venue Name'
  }))
  $tr.append($('<th>', {
    scope: 'col',
    text: 'Box Office'
  }))
  $thead.append($tr)
  $table.append($thead)

  // ==================================
  // Create the table data
  const $tbody = $('<tbody>')
  venueList.forEach((venue) => {
    const venue0 = venue._embedded.venues[0]
    $tr = $('<tr>')
    if (venue.dates.start.noSpecificTime) {
      $tr.append($('<th>', {
        scope: 'row',
        text: dateFns.format(venue.dates.start.localDate, 'MM/DD/YYYY')
      }))
    } else {
      $tr.append($('<th>', {
        scope: 'row',
        text: dateFns.format(venue.dates.start.dateTime, 'MM/DD/YYYY hh:mm A')
      }))
    }
    if (venue0.name === undefined) {
      $tr.append($('<td>', {
        text: `No name given,
      ${venue0.city.name}, ${venue0.country.countryCode}`
      }))
    } else {
      $tr.append($('<td>', {
        text: `${venue0.name},
      ${venue0.city.name}, ${venue0.country.countryCode}`
      }))
    }
    $tr.append($('<td>').append($('<button>', {
      onclick: `document.location.href='${venue.url}';`,
      text: 'tickets'
    })))
    $tbody.append($tr)
  })

  $table.append($tbody)

  // Append the entire table to the page at once
  $('#events').append($table)
}

// On submit of the form
$('#form').on('submit', (event) => {
  event.preventDefault()
  const artist = $('#artist').val().trim()
  if (artist === '') {
    return false
  }
  searchArtist(artist)
  $('#replace').hide()
  $('.marketing').html('')
})