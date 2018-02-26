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
        public List<NPCRandomizer.NamedRange> Races { get; set; }
        public int Tech { get; set; }
        public List<string> Prefixes { get; set; }
        public List<string> Infixes { get; set; }
        public List<string> Suffixes { get; set; }
        public string Combiner { get; set; }

        public string GetRace()
        {
            var r = random.NextDouble();
            return Races.First(x => x.Start >= r && x.Stop < r).Name;
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
    }
}