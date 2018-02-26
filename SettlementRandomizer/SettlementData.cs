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
        public List<NPCRandomizer.NamedRange> Roles { get; set; }

        public string GetRole(double x)
        {
            return Roles.First(r => r.Start <= x && r.Stop > x).Name;
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

        public Dictionary<string, int> GetDemographics(CityData city, int population)
        {
            var basePercentages = new Dictionary<string, double>();
            var output = new Dictionary<string, int>();
            var p = new List<double>();
            foreach (NPCRandomizer.NamedRange r in city.Races)
            {
                basePercentages[r.Name] = r.Stop - r.Start;
            }
            foreach (KeyValuePair<string, double> kvp in basePercentages)
            {
                output[kvp.Key] = (int)(kvp.Value * population);
            }
            return output;
        }

    }
}