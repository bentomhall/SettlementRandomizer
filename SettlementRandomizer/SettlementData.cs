using System.Collections.Generic;
using System.Linq;

namespace SettlementRandomizer
{
    public class SettlementData
    {
        public string Name { get; set; }
        public int Population { get; set; }
        public List<string> NPCs { get; set; }
        public Dictionary<string, int> TechCaps { get; set; }
        public Dictionary<string, double> Roles { get; set; }

        private NPCRandomizer.WeightedChoiceSet roles;

        public string GetRole(double x)
        {
            if (roles == null)
            {
                roles = new NPCRandomizer.WeightedChoiceSet(Roles);
            }
            return roles.Match(x);
        }

        public int GetPopulation(double x)
        {
            var multiplier = x * 0.2 + 0.9;
            return (int)(Population * multiplier);
        }

        public List<NPCRandomizer.PersonData> GetNPCs(CityData city, NPCRandomizer.Generator gen)
        {
            var nation = new NPCRandomizer.NationData() { Name = city.Nation, Races = city.Races };
            var output = new List<NPCRandomizer.PersonData>();
            foreach (var prof in NPCs)
            {
                var npc = gen.GenerateNPCforCity(nation);
                npc.Profession = prof;
                output.Add(npc);
            }
            return output;
        }

    }
}