export enum Gender {
  M = 'Male',
  F = 'Female',
  N = 'Neuter',
  O = 'Other'
}

export const genderKeyMap = new Map<Gender, string>([
  [Gender.M, "M"],
  [Gender.F, "F"],
  [Gender.N, "N"],
  [Gender.O, "O"]
]);