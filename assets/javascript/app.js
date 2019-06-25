const spotify = 'https://api.spotify.com/v1/search?'
const ticketMaster = 'https://app.ticketmaster.com/discovery/v2/'
const songKick = 'https://api.songkick.com/api/3.0'

const clientId = '4fd7a3464d9a42b3b839a4db644067c4'
const clientSecret = 'de44091eeac14f2290afee5f5156b863'
const apiSongKick = 'VvQYn6KSt5RXRyuY'
let accessToken = ''

const returnBasic = function (id, secret) {
  return 'Basic ' + window.btoa(id + ':' + secret)
}

const searchArtist = function searchArtist(artistName) {
  const spotifyFull = spotify + $.param({
    q: artistName,
    type: 'artist'
  })
  const songKickArtistSearch = songKick + '/artists.json?' + $.param({
    apikey: apiSongKick,
    query: artistName
  })
  const songKickVenueSearch = songKick + '/events.json?' + $.param({
    apikey: apiSongKick,
    artist_name: artistName
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
        return false
      }
      const artist = response.artists.items[0]

      // Do the search for venues on SongKick
      $.ajax({
        url: songKickVenueSearch,
        method: 'GET'
      }).then((response) => {
        let results = response.resultsPage.results.event
        createResults(results, artist)
      })
    })
  })
}

const createResults = function createResults(events, artist) {
  $('#results').html('')
  let $div = $('<div>')
  $div.append($('<h1>', {
    text: artist.name
  }))
  $div.append($('<h4>', {
    text: `Popularity on Spotify: ${artist.popularity}`
  }))
  $div.append($('<h4>', {
    text: `Followers on Spotify: ${artist.followers.total}`
  }))
  $div.append($('<h4>', {
    text: `Genres: ${artist.genres.join(', ')}`
  }))

  $('#results').append($div)
}

$('#form').on('submit', (event) => {
  event.preventDefault()
  searchArtist($('#artist').val().trim())
})