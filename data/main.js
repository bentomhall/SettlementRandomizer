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
const outputBlock = document.getElementById('output-block');
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
  let response = await fetch(`/cultures/${cultureId}/person`, {
    headers: {
      'accept': 'application/json'
    },
    method: 'GET'
  });
  return await response.json();
}

async function logResponse(f, type) {
  try {
    let output = await f();
    console.log(JSON.stringify(output, undefined, 2));
    if (type == "settlement") {
      outputBlock.innerText = createTextOutput(output);
    } else {
      outputBlock.innerText = createPersonOutput(output);
    }
    
  } catch (error) {
    console.error(error);
  }
}

function createPersonOutput(person) {
  return `====${person.name}====
'''Occupation:''' ${person.occupation}
'''Lineage:''' ${person.lineage}
'''Age:''' ${person.age} (${person.ageCategory})
'''Quirks:''' ${person.quirks.join(', ')}\n`
}

function createTextOutput(data) {
  let header = `==${data.name}==
A ${data.size} settlement of the ${data.culture} culture.
===Demographics===
'''Population:''' ${data.population}
'''Breakdown:''' 
  `
  let demo = ``;
  for (let str of data.demographics) {
    demo += `* ${str}\n`
  }

  let peopleChunk = '===Important People===\n'
  for (let person of data.importantPeople) {
    peopleChunk += createPersonOutput(person)
    peopleChunk += "\n"
  }
  return [header, demo, peopleChunk].join('\n')
}

(function() {
  document.getElementById('get-settlement').addEventListener('click', async () => {
    await logResponse(randomSettlement, 'settlement');
  }, false);
  document.getElementById('get-person').addEventListener('click', async () => {
    await logResponse(randomPerson, 'person');
  }, false);
})();