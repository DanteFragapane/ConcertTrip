const clientId = '4fd7a3464d9a42b3b839a4db644067c4'
const clientSecret = 'de44091eeac14f2290afee5f5156b863'
let accessToken = ''

const returnBasic = function (id, secret) {
  return 'Basic ' + window.btoa(id + ':' + secret)
}

var settings = {
  'async': true,
  'crossDomain': true,
  'url': 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token?grant_type=client_credentials',
  'method': 'POST',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': returnBasic(clientId, clientSecret)
  }
}

const searchArtist = function searchArtist(artistName) {
  const fullUrl = url + $.param({
    q: artistName,
    type: 'artist'
  })
  console.log(fullUrl)
  $.ajax(settings).then(function (response) {
    accessToken = response.access_token
    console.log(accessToken)

    $.ajax({
      url: fullUrl,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {
      const artist = response.artists.items[0]
      console.log(artist)
    })
  })
}

const createResults = function createResults(artistObj) {
  return true
}

$('#form').on('submit', (event) => {
  event.preventDefault()
  searchArtist($('#artist').val().trim())
})