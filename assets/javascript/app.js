const url = 'https://api.musixmatch.com/ws/1.1/artist.search?'
const api_key = 'a669389450300699ff0a296b2323e688'

const searchArtist = function searchArtist(artistName) {
  const fullUrl = url + $.param({
    apikey: api_key,
    q_artist: artistName
  })
  console.log(fullUrl)

  $.ajax({
    url: fullUrl,
    method: 'GET',
    dataType: 'jsonp'
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