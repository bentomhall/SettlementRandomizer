using System.Collections.Generic;

namespace SettlementRandomizer
{
    public class Settlement
    {
        public string Name { get; set; }
        public List<NPCRandomizer.PersonData> NPCs { get; set; }
        public string Size { get; set; }
        public int Population { get; set; }
        public Dictionary<string, int> Demographics { get; set; }
        public string NearestCity { get; set; }
        public string Role { get; set; }
        public Dictionary<string, List<string>> AvailableItems { get; set; }
        public Dictionary<string, int> TechLevels { get; set; }
    }
}