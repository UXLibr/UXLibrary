const software = [
    {
      name: 'Wallpaper Engine',
      categories: ['other'],
      img: 'https://play-lh.googleusercontent.com/MumkEpSL7dj16Rt_JfqgKPmMhaWlBhQN5HD2sxNpCgKhUEiIkfcktW_pllWM3wfKeQ',
      download: 'https://buzzheavier.com/c5xtv20gn8q9',
      specs: ['OS: Windows 10', 'RAM: 1GB', 'Graphics: HD Graphics 4000 +'],
      description: 'Cracked Version of Wallpaper Engine',
      howTo: ['Click the download button and download the right .7z file', '(If the game download doesnt start try using a vpn)', 'Extract the game from .7z file', 'Run the .exe'],
      video: ''
    },
        {
      name: 'Vegas 22.0',
      categories: ['videoediting'],
      img: 'https://m.media-amazon.com/images/I/51fcdkRkoaL._AC_UF1000,1000_QL80_.jpg',
      download: 'https://buzzheavier.com/b4fglnejtir4',
      specs: ['OS: Windows 10', 'RAM: 4GB', 'Graphics: HD Graphics 4000 +'],
      description: '',
      howTo: ['Click the download button and download the right .7z file', '(If the game download doesnt start try using a vpn)', 'Extract the game from .7z file', 'Run the .exe'],
      video: ''
    },
            {
      name: 'Vegas Datamosh Script',
      categories: ['videoediting'],
      img: 'https://camo.githubusercontent.com/8695a14127a242dc3adc11f04f78c47e6daf70e2ebef1f607386c41e741e9881/68747470733a2f2f696d672e796f75747562652e636f6d2f76692f3644326c573648306262382f302e6a7067',
      download: 'https://buzzheavier.com/d0nykdiq3q3j',
      specs: ['OS: Windows 10', 'RAM: 4GB', 'Graphics: HD Graphics 4000 +'],
      description: 'Vegas Datamosh transition script for Vegas Pro 18.0 and above',
      howTo: ['Click the download button and download the right .7z file', '(If the game download doesnt start try using a vpn)', 'Watch the Video for the rest of the tutorial', 'Original YT Tutorial by Lebanese Lizard'],
      video: 'https://rumble.com/embed/v6r32vx/?pub=4le6k9'
    },
            {
      name: 'FL Studio',
      categories: ['audioediting'],
      img: 'https://r2.gear4music.com/media/90/902177/600/preview.jpg',
      download: 'https://buzzheavier.com/8nb263r8gwwi',
      specs: ['OS: Windows 10', 'RAM: 4GB', 'Graphics: HD Graphics 4000 +'],
      description: '',
      howTo: ['Click the download button and download the right .7z file', '(If the game download doesnt start try using a vpn)', 'Extract the game from .7z file', 'Run the .exe'],
      video: ''
    },
                {
      name: 'Microsoft Office / 365',
      categories: ['windows'],
      img: 'https://www.microsoft.com/content/dam/microsoft/final/en-us/microsoft-brand/icons/Icon_Copilot_64x64.svg',
      download: 'https://massgrave.dev/genuine-installation-media',
      specs: ['OS: Windows 10/11'],
      description: '',
      howTo: ['Download Office', 'Open PowerShell (Not CMD). To do that, right-click on the Windows start menu and select PowerShell', 'Copy and paste the code in the powershell and press enter', '" irm https://get.activated.win | iex "', 'After downloading office run the script in powershell', 'Select office OHook hack and let it do its thing to activate office on your computer', 'Its should work and now you can close the powershell window and use word, powerpoint etc. for free!'],
      video: ''
    },
                    {
      name: 'Windows Activate',
      categories: ['windows'],
      img: 'https://winaero.com/blog/wp-content/uploads/2021/06/Windows-11-Win-X-Menu-icon.png',
      specs: ['OS: Windows 10/11'],
      description: '',
      howTo: ['Open PowerShell (Not CMD). To do that, right-click on the Windows start menu and select PowerShell', 'Copy and paste the code in the powershell and press enter', '" irm https://get.activated.win | iex "', 'run the script in powershell', 'Select activate windows hack and let it do its thing to activate office on your computer', 'Its should work and now, i suggest restarting your computer.'],
      video: ''
    },
                    {
      name: 'Photoshop C6 13.0.1',
      categories: ['photoediting'],
      img: 'https://images.dwncdn.net/images/t_app-cover-s,f_auto/p/ab2e1c88-96d0-11e6-b3fe-00163ec9f5fa/3657819310/adobe-photoshop-cs6-update-screenshot',
      download: 'https://buzzheavier.com/qfrscl78cq4w',
      specs: ['OS: Windows 10/11'],
      description: '',
      howTo: ['Click the download button and download the right .7z file', '(If the game download doesnt start try using a vpn)', 'Extract the game from .7z file', 'Run the .exe'],
      video: ''
    },
    // Add more software here
  ];
  
  function renderSoftware() {
    const softCats = Array.from(document.querySelectorAll('#software aside input:checked')).map(cb => cb.value);
    renderList(document.querySelector('.software-list'), software, '#search-software', softCats, false);
  }
  
  document.querySelectorAll('#software aside input').forEach(el => el.addEventListener('input', renderSoftware));
  document.getElementById('search-software').addEventListener('input', renderSoftware);
  renderSoftware();
  