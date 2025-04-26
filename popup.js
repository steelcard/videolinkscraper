
function collectMediaLinks() {

  function extractSources(selector) {
    return Array.from(document.querySelectorAll(selector)).flatMap(el => {
      const srcs = [];
      if (el.src) srcs.push(el.src);
      el.querySelectorAll('source').forEach(s => { if (s.src) srcs.push(s.src); });
      return srcs;
    });
  }

  const images = extractSources('img');
  const videos = extractSources('video');
  const audios = extractSources('audio');

  return { images, videos, audios };
}

document.addEventListener('DOMContentLoaded', async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: collectMediaLinks
  });

  const media = results.reduce((agg, frame) => {
    agg.images.push(...frame.result.images);
    agg.videos.push(...frame.result.videos);
    agg.audios.push(...frame.result.audios);
    return agg;
  }, { images: [], videos: [], audios: [] });

  media.images = Array.from(new Set(media.images));
  media.videos = Array.from(new Set(media.videos));
  media.audios = Array.from(new Set(media.audios));

  function addLinks(id, urls) {
    const ul = document.getElementById(id);
    urls.forEach(url => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.textContent = url;
      a.target = '_blank';
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  addLinks('imageLinks', media.images);
  addLinks('videoLinks', media.videos);
  addLinks('audioLinks', media.audios);
});
