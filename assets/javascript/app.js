const url = 'https://api.spotify.com/v1/search?'
const apiTokenEndpoint = 'https://accounts.spotify.com/api/token'
const clientId = '4fd7a3464d9a42b3b839a4db644067c4'
const clientSecret = 'de44091eeac14f2290afee5f5156b863'

$.ajax({
  type: 'POST',
  url: apiTokenEndpoint,
  crossDomain: true,
  data: {
    'grant_type': 'client_credentials'
  },
  beforeSend: function (xhr) {
    xhr.setRequestHeader('Authorization', btoa(clientId + ':' + clientSecret))
  }
}).then((response) => {
  console.log(response)
})

const searchArtist = function searchArtist(artistName) {
  const fullUrl = url + $.param({
    q_artist: artistName
  })

  $.ajax({
    url: fullUrl,
    method: 'GET',
    beforeSend: (xhr) => {
      /* Authorization header */
      xhr.setRequestHeader('Authorization', apiKey)
    }
  }).then((response) => {
    console.log(response)
  })
}

const createResults = function createResults(artistObj) {
  return true
}

$('#form').on('submit', (event) => {
  event.preventDefault()
  const artist = searchArtist($('#artist').val().trim())
  createResults(artist)
})