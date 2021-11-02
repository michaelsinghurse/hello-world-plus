const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function scrapeNameMeaning(name) {
  const url = 'https://www.thebump.com/b/search?name=' + name;

  const response = await fetch(url);
  const body = await response.text();

  const $ = cheerio.load(body);

  const targetSiblingNode = $('.nameCardContent .item').filter(function() {
    return $(this).text().trim().toLowerCase() === 'meaning';
  });

  const targetNode = targetSiblingNode.next();
  
  let meaning = targetNode.text().slice(0, 100) || '';

  if (meaning.length > 0) {
    meaning = meaning[0].toUpperCase() + meaning.slice(1);
  }

  return {
    url: url,
    meaning: meaning 
  };
}

module.exports = {
  scrapeNameMeaning
};

