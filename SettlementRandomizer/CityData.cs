using System.Collections.Generic;
using System.Linq;
using System.Globalization;

namespace SettlementRandomizer
{
    internal class CityData
    {
        internal string Name { get; set; }
        internal string Nation { get; set; }
        internal int Population { get; set; }
        internal string Size { get; set; }
        internal string Region { get; set; }
        internal string Terrain { get; set; }
        internal List<NPCRandomizer.NamedRange> Races { get; set; }
        internal int Tech { get; set; }
        internal List<string> Prefixes { get; set; }
        internal List<string> Infixes { get; set; }
        internal List<string> Suffixes { get; set; }
        internal string Combiner { get; set; }

        internal string GetRace()
        {
            var r = random.NextDouble();
            return Races.First(x => x.Start >= r && x.Stop < r).Name;
        }

        private System.Random random = new System.Random();
        internal string GetName()
        {
            var textInfo = new CultureInfo("en-US", false).TextInfo;
            var prefix = Prefixes.Count == 0 ? "" : random.Choice(Prefixes)+Combiner;
            var infix = Infixes.Count == 0 ? "" : random.Choice(Infixes) + Combiner;
            var suffix = random.Choice(Suffixes);
            return textInfo.ToTitleCase(prefix+infix+suffix);
        }
    }
}