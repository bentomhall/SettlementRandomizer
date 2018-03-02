using System.Collections.Generic;
using System.Linq;
using System.Globalization;

namespace SettlementRandomizer
{
    public class CityData
    {
        public string Name { get; set; }
        public string Nation { get; set; }
        public int Population { get; set; }
        public string Size { get; set; }
        public string Region { get; set; }
        public string Terrain { get; set; }
        public Dictionary<string, double> Races { get; set; }
        public int Tech { get; set; }
        public List<string> Prefixes { get; set; }
        public List<string> Infixes { get; set; }
        public List<string> Suffixes { get; set; }
        public string Combiner { get; set; }

        private NPCRandomizer.WeightedChoiceSet races;

        public string GetRace()
        {
            if (races == null)
            {
                races = new NPCRandomizer.WeightedChoiceSet(Races);
            }
            var r = random.NextDouble();
            return races.Match(r);
        }

        private System.Random random = new System.Random();
        public string GetName()
        {
            var textInfo = new CultureInfo("en-US", false).TextInfo;
            var prefix = Prefixes.Count == 0 ? "" : random.Choice(Prefixes)+Combiner;
            var infix = Infixes.Count == 0 ? "" : random.Choice(Infixes) + Combiner;
            var suffix = random.Choice(Suffixes);
            return textInfo.ToTitleCase(prefix+infix+suffix);
        }

        public Dictionary<string, int> GetDemographics(int population)
        {
            return Races.ToDictionary(o => o.Key, o => (int)(o.Value * population));
        }
    }
}