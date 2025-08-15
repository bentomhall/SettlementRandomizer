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

(function() {
  document.getElementById('get-settlement').addEventListener('click', () => {
    randomSettlement().then((data) => {
      console.log(JSON.stringify(data, undefined, 2));
    }).catch((reason) => {
      console.error(reason);
    });
  });
  document.getElementById('get-person').addEventListener('click', () => {
    randomPerson().then((data => {
      console.log(JSON.stringify(data, undefined, 2));
    })).catch((reason) => {
      console.error(reason);
    })
  })
})();