- fix data model
- don't use orm at all, just use straight sql
- figure out how to seed mass data
- 

## Data Model

### Values

#### Name
value is string, length > 0 <= X.

#### Age
value is number, constrained 1 <= x

### Gender
- id: number (PK)
- key: string (Unique)
- name: Name

#### Values
- (1, "M", "Male")
- (2, "F", "Female")
- (3, "N", "Neuter")
- (4, "O", "Other")

### Lineage
- id: number PK
- name: Name Unique
- adultAge: Age
- maxAge: Age

#### Rules
- 10 < adultAge < maxAge
- maxAge < 200 (?)
- getting age labels:
- - child = age < adultAge
- - adult = adultAge <= age <= 0.8*maxAge
- - elderly = 0.8*maxAge < age < maxAge

### LineageGenderDistributions
- id: number PK
- genderId: foreign key gender (id)
- lineageId: foreign key lineage (id)
- frequency: number

#### Rules
- frequency <= 1 (1 implies even distribution)

### PotentialName
- id: number
- value: Name
- type: settlement | person-given | person-family

### Culture
- id: number
- name: Name (Unique)
- namePattern: string (template)

#### Rules
- namePattern like `{{given}} {{family}}`

### CultureLineageDistributions
- id: number
- cultureId: fk culture(id)
- lineageId: fk lineage(id)
- frequency: number

### CultureNameDistributions
- id: number
- cultureId: fk culture(id)
- nameId: fk potential_name(id)
- frequency: number
