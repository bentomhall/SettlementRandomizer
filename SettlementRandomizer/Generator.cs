using System;
using System.Collections.Generic;
using System.Text;

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

        internal Settlement GenerateSettlement(string size, string nearestCity)
        {

            return new Settlement();
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
        private List<CityData> cities;
        private List<ItemData> items;
        private List<NPCRandomizer.PersonData> npcs = new List<NPCRandomizer.PersonData>();
        private List<SettlementData> settlements;
        private List<SettlementRole> roles;
        private List<Settlement> generatedSettlements;
    }
}
