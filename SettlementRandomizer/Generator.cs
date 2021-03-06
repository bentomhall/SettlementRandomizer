﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace SettlementRandomizer
{
    internal class SettlementGenerator
    {
        internal SettlementGenerator()
        {
            npcGenerator = new NPCRandomizer.Generator("npc_names.json", "races.json", "nations.json");
            cities = ConfigurationLoader.GetConfiguration<CityData>("data/city_data.json");
            items = ConfigurationLoader.GetConfiguration<ItemData>("data/itemRanks.json");
            settlements = ConfigurationLoader.GetConfiguration<SettlementData>("data/settlementTypes.json");
            roles = ConfigurationLoader.GetConfiguration<SettlementRole>("data/settlementRoles.json");
        }

        internal void Create(string size, int n, string city)
        {
            if (size.ToLower() == "all")
            {
                var valid = GetPossibleSettlementTypes();
                foreach (var s in valid)
                {
                    Create(s, n, city);
                }
                return;
            }
            for (int i = 0; i < n; i++)
            {
                var s = GenerateSettlement(size, city);
                generatedSettlements.Add(s);
            }
            CreateTemplatedOutput();
        }

        internal IEnumerable<string> GetPossibleSettlementTypes()
        {
            return settlements.Select(x => x.Name);
        }

        private void CreateTemplatedOutput()
        {
            foreach (Settlement s in generatedSettlements)
            {
                var filename = s.Name.Replace(' ','_').Replace('\'', '-') + ".html";
                var template = new SettlementOutput(s, true);
                var text = template.TransformText();
                System.IO.File.WriteAllText(filename, text);
                Console.WriteLine($"Wrote file: {filename}");
            }

        }

        internal Settlement GenerateSettlement(string size, string nearestCity)
        {
            var nearest = cities.First(x => x.Name.ToLower() == nearestCity.ToLower());
            var name = nearest.GetName();
            var sInfo = settlements.First(x => x.Name.ToLower() == size.ToLower());
            var pop = sInfo.GetPopulation(random.NextDouble());
            var demographics = nearest.GetDemographics(pop);
            var sNPCs = sInfo.GetNPCs(nearest, npcGenerator);
            var role = sInfo.GetRole(random.NextDouble());
            var tech = ApplyRole(sInfo, roles.First(x => x.Name.ToLower() == role.ToLower()));
            var sItems = new Dictionary<string, List<string>>();
            foreach (KeyValuePair<string,int> kv in tech)
            {
                var data = items.Where(x => x.Category == kv.Key);
                foreach (ItemData item in data) {
                    sItems[kv.Key + $":{item.Subcategory}"] = item.AvailableItems(kv.Value).Select(x => x.Name).ToList();    
                }

            }
            return new Settlement()
            {
                Name = name,
                NPCs = sNPCs,
                Population = pop,
                Role = role,
                Demographics = demographics,
                Size = size,
                NearestCity = nearest.Name,
                TechLevels = tech,
                AvailableItems = sItems
            };
        }

        private Dictionary<string, int> ApplyRole(SettlementData data, SettlementRole role)
        {
            var tech = data.TechCaps;
            foreach (Specialty s in role.Specialties)
            {
                var current = tech[s.Name];
                tech[s.Name] = Math.Min(4, Math.Max(0, current + s.Modifier));
            }
            return tech;
        }

        private NPCRandomizer.Generator npcGenerator;
        private Random random = new Random();
        private List<CityData> cities;
        private List<ItemData> items;
        private List<NPCRandomizer.PersonData> npcs = new List<NPCRandomizer.PersonData>();
        private List<SettlementData> settlements;
        private List<SettlementRole> roles;
        private List<Settlement> generatedSettlements = new List<Settlement>();
    }
}
