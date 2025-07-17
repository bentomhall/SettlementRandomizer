import math
import json


origin="https://github.com/KarlAmort/firstname-database"
lineage_nation_map = {
    "wall-builder": ["Great Britain", "U.S.A", "Germany", "Austria", "Swiss", "the Netherlands"],
    "orc": ["Ireland", "Germany", "Austria", "East Frisia", "Swiss"],
    "ihmisi": ["Finland", "Estonia", "Iceland", "Denmark", "Norway", "Sweden", "Hungary", "the Netherlands"],
    "gwerin": ["Great Britain", "Latvia", "Lithuania", "Denmark", "Norway", "Sweden", "the Netherlands", "Swiss"],
    "dwarf": ["Kazakhstan/Uzbekistan,etc.", "Azerbaijan"],
    "fang-kin": ["China", "Japan", "Korea", "Vietnam"],
    "byssian": ["Greece", "Macedonia", "Moldova", "Armenia"],
    "auringon": ["Italy", "Malta", "Portugal", "Spain", "France", "Belgium", "Luxembourg"],
    "dragonborn": ["Russia", "Belarus", "Ukraine", "Georgia", "Croatia", "Kosovo", "Serbia", "Slovenia", "Poland"]
}

nation_lineage_map = {
    "Great Britain": ["wall-builder", "gwerin"],
    "Ireland": ["orc"],
    "U.S.A": ["wall-builder"],
    "Italy": ["auringon"],
    "Malta": ["auringon"],
    "Portugal": ["auringon"],
    "Spain": ["auringon"],
    "France": ["auringon"],
    "Belgium": ["auringon"],
    "Luxembourg": ["auringon"],
    "East Frisia": ["orc"],
    "Germany": ["wall-builder", "orc"],
    "Austria": ["wall-builder", "orc"],
    "Swiss": ["wall-builder", "orc", "gwerin"],
    "Iceland": ["ihmisi"],
    "Denmark": ["ihmisi", "gwerin"],
    "Norway": ["ihmisi", "gwerin"],
    "Sweden": ["ihmisi", "gwerin"],
    "Finland": ["ihmisi"],
    "Estonia": ["ihmisi"],
    "Latvia": ["gwerin"],
    "Lithuania": ["gwerin"],
    "Poland": ["dragonborn"],
    "Hungary": ["ihmisi"],
    "Croatia": ["dragonborn"],
    "Kosovo": ["dragonborn"],
    "Macedonia": ["byssian"],
    "Serbia": ["dragonborn"],
    "Slovenia": ["dragonborn"],
    "Albania": ["byssian"],
    "Greece": ["byssian"],
    "Russia": ["dragonborn"],
    "Belarus": ["dragonborn"],
    "Ukraine": ["dragonborn"],
    "Georgia": ["dragonborn"],
    "Azerbaijan": ["dwarf"],
    "Kazakhstan/Uzbekistan,etc.": ["dwarf"],
    "China": ["fang-kin"],
    "Japan": ["fang-kin"],
    "Korea": ["fang-kin"],
    "Vietnam": ["fang-kin"]
}

def get_sex(gender):
    if (gender == "F" or gender == "1F" or gender == "?F"):
        return "F"
    elif (gender == "M" or gender == "1M" or gender == "?M"):
        return "M"
    return "N"

def get_frequency(exponent: int):
    return math.pow(2, exponent)

def get_compound_name(name: str):
    return name.replace('+', '-')

class PersonName:
    def __init__(self, name, lineage, sex, frequency):
        self.name = get_compound_name(name)
        self.lineage = lineage
        self.sex = get_sex(sex)
        self.frequency = get_frequency(frequency)

header = [
  "name","gender","Great Britain","Ireland","U.S.A.","Italy","Malta","Portugal","Spain","France","Belgium","Luxembourg","the Netherlands","East Frisia","Germany","Austria","Swiss","Iceland","Denmark","Norway","Sweden","Finland","Estonia","Latvia","Lithuania","Poland","Czech Republic","Slovakia","Hungary","Romania","Bulgaria","Bosnia and Herzegovina","Croatia","Kosovo","Macedonia","Montenegro","Serbia","Slovenia","Albania","Greece","Russia","Belarus","Moldova","Ukraine","Armenia","Azerbaijan","Georgia","Kazakhstan/Uzbekistan,etc.","Turkey","Arabia/Persia","Israel","China","India/Sri Lanka","Japan","Korea","Vietnam","other countries"
]

def parse(lines):
    output = {
        "wall-builder": [],
        "orc": [],
        "ihmisi": [],
        "gwerin": [],
        "dwarf": [],
        "fang-kin": [],
        "byssian": [],
        "auringon": [],
        "dragonborn": [],
        "other": []
    }
    countries = header[2:]

    for line in lines[1:]:
        fields = line.split(';')
        name = fields[header.index("name")]
        gender = fields[header.index("gender")]
        for country in countries:
            exponent = fields[header.index(country)].replace('\n', '')
            lineages = []
            try:
                lineages = nation_lineage_map[country]
            except KeyError:
                lineages = ["other"]
            if exponent == "":
                continue
            for lineage in lineages:
                personName = PersonName(name, lineage, gender, int(exponent))
                if personName is None:
                    continue
                output[personName.lineage].append(personName)
    for key, lst in output.items():
        output[key] = deduplicateEntries(lst)
    return output

def deduplicateEntries(lst: list)->list:
    output = []
    for person in lst:
        existing = next((x for x in output if x.name == person.name), None)
        if existing is None:
            output.append(person)
    return output


class NameEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__

if __name__ == "__main__":
    filename = "firstnames.csv"
    lines = []
    with open(filename, 'r', encoding='utf-8') as ifile:
        lines = ifile.readlines()
    output = parse(lines)
    with open('names.json', 'w', encoding='utf-8') as ofile:
        json.dump(output, ofile, indent=2, ensure_ascii=False, cls=NameEncoder)