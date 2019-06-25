
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
    console.log(accessToken)
    $.ajax({
      url: spotifyFull,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {
      const artist = response.artists.items[0]
      console.log(artist)
    })
  })

  $.ajax({
    url: songKickVenueSearch,
    method: 'GET'
  }).then((response) => {
    let results = response.resultsPage.results.event
    console.log(results)
  })
}

const createResults = function createResults(artistObj) {
  return true
}

$('#form').on('submit', (event) => {
  event.preventDefault()
  searchArtist($('#artist').val().trim())
})