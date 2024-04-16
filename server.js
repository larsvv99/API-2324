import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import { URLSearchParams } from 'url'; // Import URLSearchParams
let accessToken = null;

const engine = new Liquid({
  extname: '.liquid'
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('src'))
  .listen(3000);



//https://developer.spotify.com/documentation/web-api/concepts/access-token
const getAccessToken = async () => {
  const postData = {
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  };

  console.log('test', process.env.CLIENT_ID, process.env.CLIENT_SECRET);

  const url = 'https://accounts.spotify.com/api/token';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(postData)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Rethrow the error for the caller to handle
  }
};

const getGenres = async () => {
  const url = 'https://api.spotify.com/v1/browse/categories?locale=sv_US';
  return getData(url);
};


// const albumIds = [
//   '382ObEPsp2rxGrnsizN5TX',
//   '1A2GTWGtFfWp7KSQTwWOyo',
//   '2noRn2Aes5aoNVsU6iWThc',
//   '4FabIeNicgzy4CJhVzIMzC',
//   '3cqYmQtWHMUjSFL40lSIeB',
//   '0ee1sAau9a2DXQkAyezdwk',
//   '7KYYQoMRiu79IK0XhtnpPY',
//   '2WFFcvzM0CgLaSq4MSkyZk',
//   '3A125M77Q1pkNik2HvB1MN',
//   '4EQbuZ20BLzc1AenXH2dt5',
//   '59aeoDXr1SZjDRJNqOl3J7',
//   '3dM5WCvdXdNqLE14d16GmJ',
//   '5gHsDs3ofg8qejWBcIGtJv',
//   '3z24fpMlBap60LQ1Or1Gq2',
//   '5G6ucK9w07iiLSLCoXFHet',
//   '0wxJDfO0ByfrJI9pGjmnMp',
//   '2hzRKcoWZUPY5M1qMrgtmR',
//   '0c2tBXzscXU7yKWMPwZhaw',
//   '6BhETuUZVqSvfMkubo6z9Z',
//   '5ls56sziRLk01UpqwT8d97',
//   '24MIItEwthSQQm9rG4aQZc',
//   '74ndMzNPLdloOAQ4f7h0tE',
//   '5zhRR1TMQhpcaH1RPFE5MP',
//   '408HP6kZX2afGve443MAyu',
//   '3fDcDGQX6EHrRwpu6ypmgu',
//   '1MRsZGS6mSNFefbve8vABn',
//   '0fo8pR2n3XCpVweMgeIbEQ'
// ];

// const getRandomAlbumIds = (count) => {
//   const randomIds = [];
//   const albumCount = albumIds.length;

//   // Selecteer willekeurige ID's uit de lijst
//   while (randomIds.length < count) {
//     const randomIndex = Math.floor(Math.random() * albumCount);
//     const randomId = albumIds[randomIndex];
//     // Voorkom dat dezelfde ID twee keer wordt gekozen
//     if (!randomIds.includes(randomId)) {
//       randomIds.push(randomId);
//     }
//   }

//   return randomIds.join(',');
// };

// const getAlbums = async () => {
//   const randomIds = getRandomAlbumIds(5); // Adjust the count as needed
//   const url = `https://api.spotify.com/v1/albums?ids=${randomIds}`;
//   return getData(url);
// };

// Functie om een willekeurige letter te genereren
const getRandomLetter = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};



const getAlbums = async () => {
  // Genereren van een willekeurige letter voor de 'a'
  const randomA = getRandomLetter();
  // Genereren van een willekeurige offset tussen 0 en 1000
  const randomOffset = Math.floor(Math.random() * 1001);

  const url = `https://api.spotify.com/v1/search?q=${randomA}&type=track&limit=20&offset=${randomOffset}`;
  return getData(url);
};



async function getData(url) {
  if (!accessToken) {
    accessToken = await getAccessToken();
  }

  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
  const data = await response.json();

  if (data.error && data.error.status === 401) {
    accessToken = await getAccessToken();
    return getData(url)
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }
  return data;
}


app.get('/', async (req, res) => {
  const data = await getAlbums();

  // console.log('data', data.tracks.items);

  return res.send(renderTemplate('views/index.liquid', { title: 'Hidden💎Gems', data: data }));
  // return res.send(renderTemplate('views/index.liquid', { title: 'Hidden Gems' }));

});


const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};