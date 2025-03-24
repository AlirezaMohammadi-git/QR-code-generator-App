

loadPage();



function loadPage() {

  const invalidText = document.querySelector('.invalid-text')
  const onlineImage = document.querySelector('.qr-img')
  const qrContainer = document.querySelector('.qrcode');
  const elText = document.querySelector('.qr-input')
  const generateCodeBtn = document.querySelector('.js-btn');
  const onlineGeneratorBtn = document.querySelector('.btn-online')
  const qrcode = new QRCode(qrContainer, {
    text: "https://example.com",
    width: 168, // QR code width
    height: 168, // QR code height
    colorDark: "#000000", // QR code color
    colorLight: "#ffffff", // QR code background
    correctLevel: QRCode.CorrectLevel.H // Error correction level
  });

  // local method btn
  generateCodeBtn.addEventListener('click', () => { makeCode(qrcode, elText, invalidText); })
  // online method btn
  onlineGeneratorBtn.addEventListener('click', () => { loadOnlineImage(onlineImage, elText.value, invalidText) })

}

function loadOnlineImage(imgContainer, text, invalidText) {
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code';

  if (!text) {
    hideQrCode(() => {
      hideOnlineImage(() => {
        showInvalidText(invalidText);
      });
    });
    return;
  } else {
    hideInvalidText(invalidText, () => {
      hideQrCode(() => {
        imgContainer.src = `${baseUrl}/?data=${text}&size=${150}x${150}`;
        showOnlineImage();
      });
    });
  }
}


function makeCode(qrcode, elText, invalidText) {
  if (!elText.value) {
    hideQrCode(() => {
      hideOnlineImage(() => {
        showInvalidText(invalidText);
      });
    });
    elText.focus();
    return;
  } else {
    hideInvalidText(invalidText, () => {
      hideOnlineImage(() => {
        qrcode.makeCode(elText.value);
        showQrCode();
      });
    });
  }
}

function showQrCode() {
  const qrContainer = document.querySelector('.qrcode');
  qrContainer.style.display = 'block';
  qrContainer.classList.add("animate-in");
  setTimeout(() => {
    qrContainer.classList.remove('animate-in');
  }, 1000);
}

function hideQrCode(callback) {
  const qrContainer = document.querySelector('.qrcode');
  if (window.getComputedStyle(qrContainer).display === 'none') {
    callback();
    return;
  }

  qrContainer.classList.add("animate-out");
  setTimeout(() => {
    qrContainer.classList.remove('animate-out');
    qrContainer.style.display = 'none';
    if (callback) callback();
  }, 1000);
}

function showOnlineImage(callback) {
  const imgContainer = document.querySelector('.qr-img');
  imgContainer.style.display = 'block';
  imgContainer.classList.add('animate-in');
  setTimeout(() => {
    imgContainer.classList.remove('animate-in');
    if (callback) callback();
  }, 1000);
}

function hideOnlineImage(callback) {
  const imgContainer = document.querySelector('.qr-img');
  if (window.getComputedStyle(imgContainer).display === 'none') {
    if (callback) callback();
    return;
  }

  imgContainer.classList.add("animate-out");
  setTimeout(() => {
    imgContainer.classList.remove('animate-out');
    imgContainer.style.display = 'none';
    if (callback) callback();
  }, 1000); // Changed from 9000 to 1000 for reasonable timing
}

// empy text
function showInvalidText(invalidText) {
  invalidText.classList.add("animate-in")
  invalidText.style.display = 'block'
  setTimeout(() => {
    invalidText.classList.remove("animate-in")
  }, 1000);
}
function hideInvalidText(invalidText, callBack) {
  invalidText.classList.add("animate-out")
  setTimeout(() => {
    invalidText.classList.remove("animate-out");
    invalidText.style.display = 'none'
    callBack();
  }, 1000);
}

async function loadImageWithProgress(src) {
  const spinner = document.querySelector('.loading-spinner');
  spinner.style.display = 'block';

  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const img = document.querySelector('.qr-img');
    img.src = URL.createObjectURL(blob);
    // image loaded successfully, Now time to show it:
    //hiding previous local div if exist
    hideQrCode(() => {
      // show img after qr animation finished
      showOnlineImage()
    })
    // hiding loading... div
    spinner.style.display = 'none';

  } catch (error) {
    spinner.textContent = 'Failed to load image';
  }
}

