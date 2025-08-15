class RandomSettlementInput {
  size;
  name;
  constructor(size, name) {
    this.size = size;
    this.name = name;
  }
}

const sizes = ["hamlet", "estate", "village", "small town", "large town", "city", "metropolis"];
const cultureDropdown = document.getElementById('culture-select');
const sizeDropdown = document.getElementById('size-select');
async function randomSettlement() {
  let cultureId = cultureDropdown.value;
  if (cultureId == '') {
    return;
  }
  let size = sizeDropdown.value;
  if (size == 'random') {
    size = sizes[Math.floor(Math.random()*sizes.length)];
  }
  let response = await fetch(`/cultures/${cultureId}/settlement?${new URLSearchParams([['size', size]])}`, {
    headers: {
      'accept': 'application/json',
    },
    method: 'GET'
  });
  return await response.json();
}

async function randomPerson() {
  let cultureId = cultureDropdown.value;
  if (cultureId == '') {
    return;
  }
  let response = await fetch(`/cultures/${cultureId}/settlement`, {
    headers: {
      'accept': 'application/json'
    },
    method: 'GET'
  });
  return await response.json();
}

async function logResponse(f) {
  try {
    let output = await f();
    console.log(JSON.stringify(output, undefined, 2));
  } catch (error) {
    console.error(error);
  }
}

(function() {
  document.getElementById('get-settlement').addEventListener('click', async () => {
    await logResponse(randomSettlement);
  }, false);
  document.getElementById('get-person').addEventListener('click', async () => {
    await logResponse(randomPerson);
  }, false);
})();