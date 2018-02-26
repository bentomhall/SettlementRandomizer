using System.Collections.Generic;

namespace SettlementRandomizer
{
    internal class Settlement
    {
        internal string Name { get; set; }
        internal List<NPCRandomizer.PersonData> NPCs { get; set; }
        internal string Size { get; set; }
        internal int Population { get; set; }
        internal Dictionary<string, int> Demographics { get; set; }
        internal string NearestCity { get; set; }
        internal string Role { get; set; }
        internal Dictionary<string, List<string>> AvailableItems { get; set; }
        internal Dictionary<string, int> TechLevels { get; set; }
    }
}