
function collectMediaLinks() {

  const images = Array.from(document.querySelectorAll('img'))
                      .map(img => img.src)
                      .filter(src => src);


  const videos = Array.from(document.querySelectorAll('video'))
    .flatMap(video => {
      let srcs = [];
      if (video.src) srcs.push(video.src);
      video.querySelectorAll('source').forEach(source => {
        if (source.src) srcs.push(source.src);
      });
      return srcs;
    });


  const audios = Array.from(document.querySelectorAll('audio'))
    .flatMap(audio => {
      let srcs = [];
      if (audio.src) srcs.push(audio.src);
      audio.querySelectorAll('source').forEach(source => {
        if (source.src) srcs.push(source.src);
      });
      return srcs;
    });


  return { images, videos, audios };
}


document.addEventListener('DOMContentLoaded', async () => {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });


  let results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: collectMediaLinks
  });


  const media = results[0].result;
  const { images, videos, audios } = media;


  function addLinksToList(id, urls) {
    const ul = document.getElementById(id);
    urls.forEach(url => {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = url;
      a.textContent = url;
      a.target = '_blank';
      li.appendChild(a);
      ul.appendChild(li);
    });
  }


  addLinksToList('audioLinks', audios);
});

